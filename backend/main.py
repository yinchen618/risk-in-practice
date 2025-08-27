from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.database import init_database
from core.logging_config import setup_backend_logging
from routes.ammeters import ammeters_router
from routes.pu_learning import router as pu_learning_router
from routes.testbed import router as testbed_router
from routes.casestudy import router as casestudy_router
from routes.candidates import router as candidates_router
from routes.experiment_runs import router as experiment_runs_router
from routes.models import router as models_router
from routes.model_training import router as model_training_router
from routes.case_study_v2 import case_study_v2_router, init_case_study_v2, cleanup_case_study_v2
from ai_api import router as ai_router
import asyncio
import argparse
import os
import logging
import time
import psutil
import sys
import signal
import threading
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from cron_ammeter import start_cron, manual_fetch

# 設置日誌記錄
logger = logging.getLogger(__name__)

# 注意：coding 相關的 API 端點現在由 coding/main.py 提供

# 全域變數控制 cron 啟動
ENABLE_CRON = False
ENABLE_AUTO_RELOAD = False

def set_cron_enabled(enabled: bool):
    """設定 cron 任務啟用狀態"""
    global ENABLE_CRON
    ENABLE_CRON = enabled

def set_auto_reload_enabled(enabled: bool):
    """設定自動重載啟用狀態"""
    global ENABLE_AUTO_RELOAD
    ENABLE_AUTO_RELOAD = enabled

class FileChangeHandler(FileSystemEventHandler):
    """檔案變更監控處理器"""
    def __init__(self):
        self.last_modified = {}
        self.debounce_time = 1.0  # 防抖時間（秒）

    def on_modified(self, event):
        if event.is_directory:
            return

        # 只監控 Python 檔案
        if not event.src_path.endswith('.py'):
            return

        # 忽略 __pycache__ 和 .pyc 檔案
        if '__pycache__' in event.src_path or event.src_path.endswith('.pyc'):
            return

        current_time = time.time()
        file_path = event.src_path

        # 防抖：如果檔案在短時間內多次修改，只處理最後一次
        if file_path in self.last_modified:
            if current_time - self.last_modified[file_path] < self.debounce_time:
                return

        self.last_modified[file_path] = current_time

        print(f"\n🔄 檔案變更偵測: {file_path}")
        print(f"⏰ 時間: {datetime.fromtimestamp(current_time).strftime('%H:%M:%S')}")
        print("🔄 正在重啟伺服器...")

        # 延遲重啟，給檔案時間完成寫入
        threading.Timer(0.5, self._restart_server).start()

    def _restart_server(self):
        """重啟伺服器"""
        try:
            # 發送 SIGTERM 信號給當前進程
            os.kill(os.getpid(), signal.SIGTERM)
        except Exception as e:
            print(f"⚠️ 重啟伺服器時發生錯誤: {e}")

def setup_file_watcher():
    """設置檔案監控"""
    if not ENABLE_AUTO_RELOAD:
        return None

    backend_path = os.path.dirname(os.path.abspath(__file__))

    # 要監控的目錄
    watch_paths = [
        os.path.join(backend_path, 'routes'),
        os.path.join(backend_path, 'core'),
        os.path.join(backend_path, 'coding'),
        backend_path  # 監控 backend 根目錄的 .py 檔案
    ]

    # 過濾存在的目錄
    existing_paths = [path for path in watch_paths if os.path.exists(path)]

    if not existing_paths:
        print("⚠️ 找不到要監控的目錄，跳過檔案監控設置")
        return None

    print(f"📁 設置檔案監控:")
    for path in existing_paths:
        print(f"   - {path}")

    event_handler = FileChangeHandler()
    observer = Observer()

    for path in existing_paths:
        observer.schedule(event_handler, path, recursive=True)

    observer.start()
    print("👁️ 檔案監控已啟動 (自動重載已開啟)")

    return observer

def find_processes_using_port(port):
    """找到使用指定端口的所有進程"""
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            for conn in proc.connections():
                if conn.laddr.port == port:
                    processes.append(proc)
                    break
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return processes

def kill_processes_on_port(port):
    """終止使用指定端口的所有進程"""
    print(f"🔍 檢查端口 {port} 上的進程...")

    processes = find_processes_using_port(port)

    if not processes:
        print(f"✅ 端口 {port} 沒有被佔用")
        return

    print(f"🚫 發現 {len(processes)} 個進程佔用端口 {port}")

    for proc in processes:
        try:
            print(f"   📋 PID: {proc.pid}, Name: {proc.name()}")
            print(f"   📝 Command: {' '.join(proc.cmdline()) if proc.cmdline() else 'N/A'}")

            # 優雅地終止進程
            proc.terminate()
            print(f"   ⏳ 發送 SIGTERM 到 PID {proc.pid}")

        except (psutil.NoSuchProcess, psutil.AccessDenied):
            print(f"   ⚠️ 無法終止 PID {proc.pid} (可能已經結束或權限不足)")

    # 等待進程結束
    print("⏳ 等待進程結束...")
    time.sleep(2)

    # 檢查是否還有殘留進程，強制終止
    remaining_processes = find_processes_using_port(port)
    if remaining_processes:
        print(f"🔥 強制終止 {len(remaining_processes)} 個殘留進程")
        for proc in remaining_processes:
            try:
                proc.kill()
                print(f"   💀 強制終止 PID {proc.pid}")
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        time.sleep(1)

    # 最終檢查
    final_check = find_processes_using_port(port)
    if final_check:
        print(f"⚠️ 警告：仍有 {len(final_check)} 個進程佔用端口 {port}")
        for proc in final_check:
            try:
                print(f"   殘留進程 PID: {proc.pid}, Name: {proc.name()}")
            except:
                pass
    else:
        print(f"✅ 端口 {port} 已成功清理")

# 使用 lifespan 事件處理器取代已棄用的 on_event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 啟動時執行
    await init_database()

    # 初始化 Case Study v2 服務（現在是可選的，不會阻止服務器啟動）
    try:
        await init_case_study_v2()
    except Exception as e:
        logger.error(f"Case Study v2 initialization failed: {e}")
        logger.info("Main server will continue without Case Study v2")

    # 只有在啟用 cron 時才啟動 cron 任務
    if ENABLE_CRON:
        print("啟動 cron 任務...")
        asyncio.create_task(start_cron())
    else:
        print("Cron 任務已停用")

    # 設置檔案監控（如果啟用）
    file_observer = setup_file_watcher()

    yield

    # 關閉時執行
    if file_observer:
        print("🛑 停止檔案監控...")
        file_observer.stop()
        file_observer.join()

    try:
        await cleanup_case_study_v2()
    except Exception as e:
        logger.error(f"Case Study v2 cleanup failed: {e}")
    print("應用程序關閉")

app = FastAPI(
    title="AI 學習平台",
    description="基於 PyTorch 的互動式 AI 展示平台",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:3001","http://localhost:3003","https://pu-in-practice.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含電表路由（整合後的統一路由）
app.include_router(ammeters_router)
# 包含 AI 路由
app.include_router(ai_router)
# 包含 PU Learning 路由
app.include_router(pu_learning_router)
# 包含 Testbed 路由
app.include_router(testbed_router)
# 包含 Case Study 路由
app.include_router(casestudy_router)
# 包含新的候選事件 API
app.include_router(candidates_router)
# 包含實驗批次管理 API
app.include_router(experiment_runs_router)
# 包含新的模型訓練 API
app.include_router(models_router)
# 包含 PU Learning 模型訓練 API
app.include_router(model_training_router)
# 包含 Case Study v2 路由
app.include_router(case_study_v2_router)

# 導入並包含完整的 coding 應用程式
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'coding'))
from coding.main import coding_router, session_router, files_router, live_preview_router

# 將 coding 應用程式的所有路由包含到主應用程式中
app.include_router(coding_router)
app.include_router(session_router)
app.include_router(files_router)
app.include_router(live_preview_router)

# 注意：coding 相關的 API 端點現在由 coding/main.py 提供
# 包括 /coding/chat, /coding/health, /live-preview/{session_id}/{file_path} 等

@app.get("/")
async def root():
    return {
        "message": "AI 學習平台後端服務運行中",
        "status": "active",
        "modules": {
            "ammeter": "電表數據管理",
            "ai": "AI 模型訓練與預測",
            "pu_learning": "PU Learning 模擬引擎",
            "case_study_v2": "PU Learning 工作台 v2",
            "coding": "AI 程式碼助手"
        },
        "endpoints": {
            "ammeter": "/api/ammeter",
            "ai": "/api/ai",
            "pu_learning": "/api/pu-learning",
            "case_study_v2": "/api/v2",
            "testbed": "/api/testbed",
            "coding": "/coding",
            "docs": "/docs"
        }
    }

# 手動觸發電表資料抓取的端點
@app.post("/api/trigger-meter-fetch")
async def trigger_meter_fetch():
    """手動觸發電表資料抓取"""
    try:
        result = await manual_fetch()
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["message"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"電表資料抓取失敗: {str(e)}")

if __name__ == "__main__":
    import uvicorn

    # 解析命令行參數
    parser = argparse.ArgumentParser(description="AI 學習平台後端服務")
    parser.add_argument(
        "--enable-cron",
        action="store_true",
        help="啟用 cron 任務（預設停用）"
    )
    parser.add_argument(
        "--auto-reload",
        action="store_true",
        help="啟用自動重載，檔案變更時自動重啟（預設停用）"
    )
    parser.add_argument(
        "--host",
        default="0.0.0.0",
        help="服務器主機地址（預設: 0.0.0.0）"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="服務器端口（預設: 8000）"
    )
    parser.add_argument(
        "--skip-port-cleanup",
        action="store_true",
        help="跳過端口清理（預設會清理端口）"
    )

    args = parser.parse_args()

    # 設定全域變數
    set_cron_enabled(args.enable_cron)
    set_auto_reload_enabled(args.auto_reload)

    print(f"🎯" + "="*60)
    print(f"🚀 AI 學習平台後端服務")
    print(f"📅 {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🎯" + "="*60)
    print(f"主機: {args.host}")
    print(f"端口: {args.port}")
    print(f"Cron 任務: {'啟用' if ENABLE_CRON else '停用'}")
    print(f"自動重載: {'啟用' if ENABLE_AUTO_RELOAD else '停用'}")
    print(f"包含模組: 電表管理, AI 訓練, PU Learning, Case Study v2, Testbed, Coding Assistant")

    # 端口清理（除非明確跳過）
    if not args.skip_port_cleanup:
        print(f"\n📋 Step 1: 清理端口 {args.port}")
        kill_processes_on_port(args.port)
        print("\n⏳ 等待端口完全釋放...")
        time.sleep(2)
        print(f"\n📋 Step 2: 啟動服務器")
    else:
        print(f"\n⚠️ 跳過端口清理，直接啟動服務器")

    # 設置信號處理器處理優雅關閉和重啟
    def signal_handler(signum, frame):
        print(f"\n📤 收到信號 {signum}")
        if ENABLE_AUTO_RELOAD and signum == signal.SIGTERM:
            print("🔄 檔案變更觸發重啟...")
            # 重新執行當前腳本
            python = sys.executable
            os.execv(python, [python] + sys.argv)
        else:
            print("🛑 正常關閉服務器...")
            sys.exit(0)

    # 註冊信號處理器
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)

    try:
        uvicorn.run(app, host=args.host, port=args.port)
    except KeyboardInterrupt:
        print("\n🛑 用戶中斷，關閉服務器...")

"""
使用方式：

1. 預設啟動（不啟用 cron，會清理端口）
   python3 main.py

2. 啟用 cron 任務
   python3 main.py --enable-cron

3. 啟用自動重載（檔案變更時自動重啟）
   python3 main.py --auto-reload

4. 自定義主機和端口
   python3 main.py --host 127.0.0.1 --port 8080

5. 跳過端口清理（快速啟動）
   python3 main.py --skip-port-cleanup

6. 完整參數（推薦開發模式）
   python3 main.py --enable-cron --auto-reload --host 0.0.0.0 --port 8000

參數說明：
- --enable-cron：啟用 cron 任務（預設停用）
- --auto-reload：啟用自動重載，檔案變更時自動重啟（預設停用）
- --host：服務器主機地址（預設：0.0.0.0）
- --port：服務器端口（預設：8000）
- --skip-port-cleanup：跳過端口清理，直接啟動（預設會清理端口）

新增功能：
- 自動端口清理：啟動前自動清理佔用的端口
- 檔案自動重載：監控 routes/, core/, coding/ 目錄及根目錄的 .py 檔案變更
- Coding Assistant API：/coding/chat, /coding/health

自動重載功能：
- 監控目錄：routes/, core/, coding/, backend/
- 監控檔案類型：.py 檔案
- 防抖機制：1 秒內的重複變更只觸發一次重啟
- 優雅重啟：檔案變更後延遲 0.5 秒重啟，確保檔案寫入完成
"""
