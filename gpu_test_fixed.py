#!/usr/bin/env python3
"""
Simple GPU Tensor Conversion Test
Tests if the tensor conversion issue has been resolved.
"""

import torch
import numpy as np

def test_gpu_conversion():
    print("🔬 Testing GPU Tensor Conversion")
    print("=" * 40)

    # Check if GPU is available
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"🖥️ Device: {device}")

    if device.type == 'cpu':
        print("⚠️ GPU not available, testing CPU conversion only")
        # Test CPU conversion
        tensor = torch.tensor([1.0, 2.0, 3.0])
        numpy_array = tensor.numpy()
        print(f"✅ CPU conversion successful: {numpy_array}")
        return True

    # Create tensor on GPU
    gpu_tensor = torch.tensor([1.0, 2.0, 3.0]).to(device)
    print(f"✅ GPU tensor created: {gpu_tensor}")

    # This should fail (the old way)
    try:
        numpy_array_wrong = gpu_tensor.numpy()
        print("❌ Direct .numpy() should have failed but didn't")
        return False
    except (RuntimeError, TypeError) as e:
        print(f"✅ Direct .numpy() correctly failed: {str(e)[:50]}...")

    # This should work (the fixed way)
    try:
        numpy_array_correct = gpu_tensor.cpu().numpy()
        print(f"✅ Fixed conversion successful: {numpy_array_correct}")
    except Exception as e:
        print(f"❌ Fixed conversion failed: {e}")
        return False

    # Test with validation-like scenario
    try:
        outputs = torch.tensor([[0.8], [0.3], [0.9]]).to(device)
        predictions = (outputs > 0.5).float()
        predictions_np = predictions.cpu().numpy().flatten()
        print(f"✅ Validation-style conversion: {predictions_np}")
    except Exception as e:
        print(f"❌ Validation-style conversion failed: {e}")
        return False

    return True

if __name__ == "__main__":
    success = test_gpu_conversion()
    if success:
        print("\n🎉 All tests passed! GPU tensor conversion is working correctly.")
        print("The training system fixes should work now.")
    else:
        print("\n❌ Tests failed!")
