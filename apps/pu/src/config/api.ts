// API 端點設定
export const API_ENDPOINTS = {
  PYTHON_API:
    process.env.NODE_ENV === 'production'
      ? 'https://python.yinchen.tw'
      : 'https://python.yinchen.tw',
} as const

// 導出常用的 API URL
export const PYTHON_API_URL = API_ENDPOINTS.PYTHON_API
