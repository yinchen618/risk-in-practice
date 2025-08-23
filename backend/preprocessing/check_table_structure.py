#!/usr/bin/env python3
"""
檢查 ammeter_log 表的正確欄位名稱
"""
import subprocess
import os

DB_CONFIG = {
    'host': 'supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com',
    'port': 5432,
    'database': 'supa',
    'user': 'postgres',
    'password': 'Info4467'
}

def check_table_structure():
    """檢查表結構"""
    env = os.environ.copy()
    env['PGPASSWORD'] = DB_CONFIG['password']

    # 查詢表結構
    psql_command = [
        'psql',
        '-h', DB_CONFIG['host'],
        '-p', str(DB_CONFIG['port']),
        '-U', DB_CONFIG['user'],
        '-d', DB_CONFIG['database'],
        '-c', "\\d ammeter_log"
    ]

    try:
        result = subprocess.run(
            psql_command,
            env=env,
            capture_output=True,
            text=True,
            check=True
        )

        print("ammeter_log 表結構:")
        print(result.stdout)

    except subprocess.CalledProcessError as e:
        print(f"錯誤: {e}")
        print(f"錯誤訊息: {e.stderr}")

def check_sample_data():
    """檢查範例資料"""
    env = os.environ.copy()
    env['PGPASSWORD'] = DB_CONFIG['password']

    # 查詢前5筆資料
    psql_command = [
        'psql',
        '-h', DB_CONFIG['host'],
        '-p', str(DB_CONFIG['port']),
        '-U', DB_CONFIG['user'],
        '-d', DB_CONFIG['database'],
        '-c', "SELECT * FROM ammeter_log LIMIT 5;"
    ]

    try:
        result = subprocess.run(
            psql_command,
            env=env,
            capture_output=True,
            text=True,
            check=True
        )

        print("\nammeter_log 範例資料:")
        print(result.stdout)

    except subprocess.CalledProcessError as e:
        print(f"錯誤: {e}")
        print(f"錯誤訊息: {e.stderr}")

if __name__ == "__main__":
    check_table_structure()
    check_sample_data()
