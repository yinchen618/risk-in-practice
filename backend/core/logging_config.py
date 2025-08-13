"""
日誌配置模組 - 統一管理後端服務的日誌設定
"""

import logging
import os
import sys
from datetime import datetime
from typing import Optional

class LoggingConfig:
    """日誌配置管理器"""
    
    def __init__(self):
        self.log_level = logging.INFO
        self.enable_detailed_logs = False
        self.log_file = None
        self.console_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        self.file_format = '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
    
    def setup_logging(self, 
                     log_level: str = "INFO",
                     enable_detailed_logs: bool = False,
                     log_file: Optional[str] = None,
                     enable_console: bool = True):
        """
        設置日誌配置
        
        Args:
            log_level: 日誌級別 (DEBUG, INFO, WARNING, ERROR)
            enable_detailed_logs: 是否啟用詳細日誌（包含電表設備詳情）
            log_file: 日誌文件路徑
            enable_console: 是否啟用控制台輸出
        """
        self.log_level = getattr(logging, log_level.upper(), logging.INFO)
        self.enable_detailed_logs = enable_detailed_logs
        self.log_file = log_file
        
        # 清除現有的處理器
        root_logger = logging.getLogger()
        for handler in root_logger.handlers[:]:
            root_logger.removeHandler(handler)
        
        # 設置根日誌級別
        root_logger.setLevel(self.log_level)
        
        handlers = []
        
        # 控制台處理器
        if enable_console:
            console_handler = logging.StreamHandler(sys.stdout)
            console_handler.setLevel(self.log_level)
            console_formatter = logging.Formatter(self.console_format)
            console_handler.setFormatter(console_formatter)
            handlers.append(console_handler)
        
        # 文件處理器
        if log_file:
            # 確保日誌目錄存在
            os.makedirs(os.path.dirname(log_file), exist_ok=True)
            
            file_handler = logging.FileHandler(log_file, encoding='utf-8')
            file_handler.setLevel(self.log_level)
            file_formatter = logging.Formatter(self.file_format)
            file_handler.setFormatter(file_formatter)
            handlers.append(file_handler)
        
        # 添加處理器到根日誌記錄器
        for handler in handlers:
            root_logger.addHandler(handler)
        
        # 設置特定模組的日誌級別
        if enable_detailed_logs:
            # 為候選事件和數據載入器啟用詳細日誌
            logging.getLogger('routes.candidates').setLevel(logging.INFO)
            logging.getLogger('services.data_loader').setLevel(logging.INFO)
        
        logging.info(f"日誌配置完成:")
        logging.info(f"  - 日誌級別: {log_level}")
        logging.info(f"  - 詳細日誌: {'啟用' if enable_detailed_logs else '停用'}")
        logging.info(f"  - 日誌文件: {log_file or '無'}")
        logging.info(f"  - 控制台輸出: {'啟用' if enable_console else '停用'}")
    
    def is_detailed_logs_enabled(self) -> bool:
        """檢查是否啟用詳細日誌"""
        return self.enable_detailed_logs

# 全域日誌配置實例
logging_config = LoggingConfig()

def setup_backend_logging(log_level: str = "INFO",
                         enable_detailed_logs: bool = False,
                         log_file: Optional[str] = None):
    """
    設置後端日誌的便捷函數
    
    Args:
        log_level: 日誌級別
        enable_detailed_logs: 是否啟用詳細日誌（電表設備詳情等）
        log_file: 日誌文件路徑
    """
    logging_config.setup_logging(
        log_level=log_level,
        enable_detailed_logs=enable_detailed_logs,
        log_file=log_file
    )

def get_device_logs_enabled() -> bool:
    """
    檢查是否啟用設備詳細日誌
    
    Returns:
        bool: 是否啟用設備詳細日誌
    """
    return logging_config.is_detailed_logs_enabled()
