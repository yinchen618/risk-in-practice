#!/usr/bin/env python3
"""
PU-in-Practice 專案啟動器
現在重新導向到 backend/main.py，後端已經整合了端口清理功能
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    """主函數 - 重新導向到後端的main.py"""
    print("� 重新導向到 backend/main.py...")
    print("   後端服務現在已經整合了端口清理功能")
    print("   您可以直接使用: python3 backend/main.py")
    print()

    # 獲取專案根目錄
    project_root = Path(__file__).parent
    backend_main = project_root / "backend" / "main.py"

    if not backend_main.exists():
        print(f"❌ 找不到後端主檔案: {backend_main}")
        sys.exit(1)

    # 將命令行參數傳遞給 backend/main.py
    cmd = [sys.executable, str(backend_main)] + sys.argv[1:]

    print(f"🚀 執行命令: {' '.join(cmd)}")
    print("="*60)

    try:
        # 直接執行 backend/main.py
        os.execvp(cmd[0], cmd)
    except Exception as e:
        print(f"💥 執行錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
