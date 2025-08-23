# Data models and schemas

# 重新導出 pu-learning 模塊中的模型
try:
    import sys
    import os

    # 添加 pu-learning 目錄到 Python 路徑
    pu_learning_path = os.path.join(os.path.dirname(__file__), '..', 'pu-learning')
    if pu_learning_path not in sys.path:
        sys.path.insert(0, pu_learning_path)

    # 導入模型
    from models import SimulationRequest, SimulationResponse, DataParams, ModelParams

    __all__ = ['SimulationRequest', 'SimulationResponse', 'DataParams', 'ModelParams']
except ImportError as e:
    # 如果導入失敗，定義空類以避免錯誤
    print(f"Warning: Could not import PU learning models: {e}")

    # 定義替代類
    from pydantic import BaseModel
    from typing import Dict, Any, Optional

    class SimulationRequest(BaseModel):
        model_config = {"protected_namespaces": ()}

        data: Dict[str, Any] = {}
        model_params: Dict[str, Any] = {}

    class SimulationResponse(BaseModel):
        result: Dict[str, Any] = {}

    class DataParams(BaseModel):
        pass

    class ModelParams(BaseModel):
        model_config = {"protected_namespaces": ()}
        pass

    __all__ = ['SimulationRequest', 'SimulationResponse', 'DataParams', 'ModelParams']
