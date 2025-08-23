// 全局API請求去重管理器
// 統一管理所有API請求，避免重複調用

interface PendingRequest<T = any> {
	promise: Promise<T>;
	timestamp: number;
}

class GlobalApiManager {
	private pendingRequests = new Map<string, PendingRequest>();
	private cache = new Map<string, { data: any; timestamp: number }>();
	private readonly CACHE_DURATION = 30000; // 30秒
	private readonly REQUEST_TIMEOUT = 60000; // 60秒請求超時

	private generateKey(url: string, method = "GET", body?: any): string {
		const bodyStr = body ? JSON.stringify(body) : "";
		return `${method}:${url}:${bodyStr}`;
	}

	async request<T = any>(
		url: string,
		options: RequestInit = {},
		enableCache = true,
		enableDeduplication = true,
	): Promise<T> {
		const method = options.method || "GET";
		const key = this.generateKey(url, method, options.body);
		const now = Date.now();

		// 檢查緩存
		if (enableCache && this.cache.has(key)) {
			const cached = this.cache.get(key);
			if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
				return cached.data;
			}
			this.cache.delete(key);
		}

		// 檢查是否有正在進行的相同請求
		if (enableDeduplication) {
			const pending = this.pendingRequests.get(key);
			if (pending && now - pending.timestamp < this.REQUEST_TIMEOUT) {
				try {
					return await pending.promise;
				} catch (error) {
					console.error(`等待API請求失敗: ${url}`, error);
					// 清理失敗的請求
					this.pendingRequests.delete(key);
				}
			}
		}

		// 創建新的請求
		const requestPromise = this.executeRequest<T>(
			url,
			options,
			key,
			enableCache,
		);

		// 註冊請求
		if (enableDeduplication) {
			this.pendingRequests.set(key, {
				promise: requestPromise,
				timestamp: now,
			});
		}

		try {
			const result = await requestPromise;
			return result;
		} finally {
			// 清理pending請求
			if (enableDeduplication) {
				this.pendingRequests.delete(key);
			}
		}
	}

	private async executeRequest<T>(
		url: string,
		options: RequestInit,
		cacheKey: string,
		enableCache: boolean,
	): Promise<T> {
		try {
			const response = await fetch(url, options);

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			const data = await response.json();

			// 更新緩存（僅對GET請求）
			if (enableCache && (options.method || "GET") === "GET") {
				this.cache.set(cacheKey, {
					data,
					timestamp: Date.now(),
				});
			}

			return data;
		} catch (error) {
			console.error(`API請求失敗: ${url}`, error);
			throw error;
		}
	}

	// 清理過期的緩存和請求
	cleanup() {
		const now = Date.now();

		// 清理過期緩存
		for (const [key, cached] of this.cache.entries()) {
			if (now - cached.timestamp > this.CACHE_DURATION) {
				this.cache.delete(key);
			}
		}

		// 清理超時的請求
		for (const [key, pending] of this.pendingRequests.entries()) {
			if (now - pending.timestamp > this.REQUEST_TIMEOUT) {
				this.pendingRequests.delete(key);
			}
		}
	}

	// 手動清除特定URL的緩存
	clearCache(url?: string) {
		if (url) {
			const key = this.generateKey(url);
			this.cache.delete(key);
		} else {
			this.cache.clear();
		}
	}

	// 獲取緩存統計信息
	getCacheStats() {
		return {
			cacheSize: this.cache.size,
			pendingRequests: this.pendingRequests.size,
			cachedUrls: Array.from(this.cache.keys()),
		};
	}
}

// 全局實例
export const globalApiManager = new GlobalApiManager();

// 定期清理
if (typeof window !== "undefined") {
	setInterval(() => {
		globalApiManager.cleanup();
	}, 60000); // 每分鐘清理一次
}

// 便利函數
export const apiRequest = {
	get: <T = any>(
		url: string,
		enableCache = true,
		enableDeduplication = true,
	) =>
		globalApiManager.request<T>(
			url,
			{ method: "GET" },
			enableCache,
			enableDeduplication,
		),

	post: <T = any>(url: string, body: any, enableDeduplication = true) =>
		globalApiManager.request<T>(
			url,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			},
			false,
			enableDeduplication,
		),

	put: <T = any>(url: string, body: any, enableDeduplication = true) =>
		globalApiManager.request<T>(
			url,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			},
			false,
			enableDeduplication,
		),

	delete: <T = any>(url: string, enableDeduplication = true) =>
		globalApiManager.request<T>(
			url,
			{ method: "DELETE" },
			false,
			enableDeduplication,
		),
};
