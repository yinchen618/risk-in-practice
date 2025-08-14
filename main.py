#!/usr/bin/env python3
"""
PU-in-Practice 專案啟動器
自動管理後端服務的啟動，包括端口清理和服務啟動
"""

import os
import sys
import subprocess
import time
import signal
import psutil
from pathlib import Path

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

def start_backend_server():
    """啟動後端服務"""
    # 獲取專案根目錄
    project_root = Path(__file__).parent
    backend_dir = project_root / "backend"
    backend_main = backend_dir / "main.py"

    print(f"📂 專案根目錄: {project_root}")
    print(f"📂 後端目錄: {backend_dir}")
    print(f"📄 後端主檔案: {backend_main}")

    if not backend_main.exists():
        print(f"❌ 找不到後端主檔案: {backend_main}")
        sys.exit(1)

    if not backend_dir.exists():
        print(f"❌ 找不到後端目錄: {backend_dir}")
        sys.exit(1)

    print("🚀 啟動後端服務...")
    print("="*50)

    try:
        # 切換到後端目錄並執行
        os.chdir(backend_dir)

        # 執行 python3 main.py
        process = subprocess.Popen(
            [sys.executable, "main.py"],
            cwd=str(backend_dir),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )

        print(f"🆔 後端服務 PID: {process.pid}")
        print("📋 服務輸出:")
        print("-" * 50)

        # 即時顯示輸出
        try:
            for line in iter(process.stdout.readline, ''):
                if line:
                    print(line.rstrip())

                # 檢查進程是否還在運行
                if process.poll() is not None:
                    break

        except KeyboardInterrupt:
            print("\n🛑 收到中斷信號，正在停止服務...")
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                print("⚠️ 服務未能在 5 秒內停止，強制終止")
                process.kill()
            print("✅ 服務已停止")
            return

        # 檢查退出狀態
        exit_code = process.wait()
        if exit_code == 0:
            print("✅ 後端服務正常結束")
        else:
            print(f"❌ 後端服務異常結束，退出碼: {exit_code}")

    except Exception as e:
        print(f"💥 啟動後端服務時發生錯誤: {e}")
        sys.exit(1)

def main():
    """主函數"""
    print("🎯" + "="*60)
    print("🚀 PU-in-Practice 專案啟動器")
    print("📅 " + time.strftime("%Y-%m-%d %H:%M:%S"))
    print("🎯" + "="*60)

    try:
        # 1. 清理端口 8000
        print("\n📋 Step 1: 清理端口 8000")
        kill_processes_on_port(8000)

        # 2. 等待一下確保端口完全釋放
        print("\n⏳ 等待端口完全釋放...")
        time.sleep(2)

        # 3. 啟動後端服務
        print("\n📋 Step 2: 啟動後端服務")
        start_backend_server()

    except KeyboardInterrupt:
        print("\n🛑 用戶中斷程式")
        sys.exit(0)
    except Exception as e:
        print(f"\n💥 程式執行錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
