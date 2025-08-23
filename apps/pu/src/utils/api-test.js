/**
 * API 調用優化測試腳本
 *
 * 測試我們的緩存機制和重複調用減少
 */

// 在瀏覽器控制台中運行此腳本來測試緩存效果
function testApiCacheEffectiveness() {
	// 檢查 logger 是否可用
	if (typeof window !== "undefined" && window.logger) {
		const logs = window.logger.getLogs();
		const apiLogs = logs.filter((log) => log.source?.includes("API"));

		// 分析最近 1 分鐘的 API 調用
		const oneMinuteAgo = Date.now() - 60000;
		const recentApiLogs = apiLogs.filter(
			(log) => new Date(log.timestamp).getTime() > oneMinuteAgo,
		);

		// 統計不同類型的調用
		const callStats = {};
		recentApiLogs.forEach((log) => {
			const url = log.message.split(" ").pop() || "unknown";
			if (url.includes("experiment-runs")) {
				callStats["experiment-runs"] =
					(callStats["experiment-runs"] || 0) + 1;
			} else if (url.includes("stats")) {
				callStats["stats"] = (callStats["stats"] || 0) + 1;
			}
		});

		// 統計緩存使用
		const cacheHits = recentApiLogs.filter(
			(log) =>
				log.source?.includes("Cache") || log.message.includes("cached"),
		).length;

		const actualRequests = recentApiLogs.filter(
			(log) =>
				log.message.includes("Request:") ||
				log.message.includes("Response:"),
		).length;

		console.log("=== API 調用統計 (最近 1 分鐘) ===");
		console.log("總 API 相關日誌:", recentApiLogs.length);
		console.log("緩存命中:", cacheHits);
		console.log("實際請求:", actualRequests);
		console.log(
			"緩存命中率:",
			cacheHits > 0
				? `${((cacheHits / (cacheHits + actualRequests)) * 100).toFixed(1)}%`
				: "0%",
		);
		console.log("調用統計:", callStats);

		return {
			totalApiLogs: recentApiLogs.length,
			cacheHits,
			actualRequests,
			cacheHitRatio: cacheHits / (cacheHits + actualRequests) || 0,
			callStats,
		};
	} else {
		console.error("Logger 不可用，請確保在 data-results 頁面運行此腳本");
		return null;
	}
}

// 測試重複調用檢測
function detectDuplicateApiCalls() {
	if (typeof window !== "undefined" && window.logger) {
		const logs = window.logger.getLogs();
		const recentLogs = logs.filter(
			(log) => Date.now() - new Date(log.timestamp).getTime() < 30000, // 最近 30 秒
		);

		// 檢測相同 URL 的重複調用
		const urlCounts = {};
		const duplicates = [];

		recentLogs.forEach((log) => {
			if (log.message.includes("Request:")) {
				const url = log.message.split(" ").pop();
				if (url) {
					urlCounts[url] = (urlCounts[url] || 0) + 1;
					if (urlCounts[url] > 3) {
						// 超過 3 次調用同一 URL 視為可疑
						duplicates.push({ url, count: urlCounts[url] });
					}
				}
			}
		});

		console.log("=== 重複調用檢測 (最近 30 秒) ===");
		if (duplicates.length > 0) {
			console.warn("發現可能的重複調用:");
			duplicates.forEach((dup) => {
				console.warn(`- ${dup.url}: ${dup.count} 次`);
			});
		} else {
			console.log("✅ 未發現明顯的重複調用");
		}

		return duplicates;
	}

	return null;
}

// 自動運行測試 (如果在瀏覽器環境中)
if (typeof window !== "undefined") {
	// 延遲運行，等待頁面載入完成
	setTimeout(() => {
		console.log("🚀 開始 API 優化效果測試...");
		const stats = testApiCacheEffectiveness();
		const duplicates = detectDuplicateApiCalls();

		if (stats) {
			console.log("\n📊 優化效果評估:");
			if (stats.cacheHitRatio > 0.3) {
				console.log("✅ 緩存機制工作良好");
			} else if (stats.cacheHitRatio > 0.1) {
				console.log("⚠️ 緩存機制部分有效，可進一步優化");
			} else {
				console.log("❌ 緩存機制可能未正常工作");
			}

			if (duplicates && duplicates.length === 0) {
				console.log("✅ 重複調用控制良好");
			} else {
				console.log("⚠️ 仍有重複調用需要優化");
			}
		}
	}, 5000);
}

console.log("API 優化測試腳本已載入，將在 5 秒後開始測試...");
