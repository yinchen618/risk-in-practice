/**
 * API 重複調用修復驗證腳本
 *
 * 用於驗證所有已修復的 API 重複調用問題
 */

// 要監控的關鍵 API 端點
const MONITORED_ENDPOINTS = [
	"experiment-runs",
	"training-stats",
	"training-data-preview",
	"stats?experiment_run_id=",
	"ERM_BASELINE",
];

// 預期修復的問題
const EXPECTED_FIXES = {
	// 404 錯誤應該消除
	"404_errors": {
		ERM_BASELINE: 0, // 應該不再有 404 錯誤
	},

	// 重複調用應該大幅減少
	duplicate_reduction: {
		"experiment-runs": 70, // 減少 70%+
		"training-stats": 80, // 減少 80%+
		"training-data-preview": 80, // 減少 80%+
		stats: 60, // 減少 60%+
	},
};

class ApiCallMonitor {
	constructor() {
		this.apiCalls = new Map();
		this.startTime = Date.now();
		this.originalFetch = window.fetch;
		this.setupInterception();
	}

	setupInterception() {
		const self = this;

		// 攔截 fetch 調用
		window.fetch = function (...args) {
			const url = args[0];
			const timestamp = Date.now();

			// 記錄調用
			self.recordApiCall(url, timestamp);

			// 調用原始 fetch
			return self.originalFetch.apply(this, args);
		};

		console.log("🔍 API 調用監控已啟動");
	}

	recordApiCall(url, timestamp) {
		const urlStr = url.toString();

		// 檢查是否是我們關注的端點
		const endpoint = MONITORED_ENDPOINTS.find((ep) => urlStr.includes(ep));
		if (!endpoint) return;

		if (!this.apiCalls.has(endpoint)) {
			this.apiCalls.set(endpoint, []);
		}

		this.apiCalls.get(endpoint).push({
			url: urlStr,
			timestamp,
			relativeTime: timestamp - this.startTime,
		});
	}

	getReport() {
		const report = {
			monitorDuration: Date.now() - this.startTime,
			apiCallStats: {},
			issues: [],
			fixes: [],
		};

		// 分析每個端點的調用情況
		MONITORED_ENDPOINTS.forEach((endpoint) => {
			const calls = this.apiCalls.get(endpoint) || [];
			report.apiCallStats[endpoint] = {
				totalCalls: calls.length,
				uniqueUrls: new Set(calls.map((c) => c.url)).size,
				calls: calls,
			};

			// 檢查重複調用
			if (calls.length > 1) {
				// 檢查是否在短時間內有重複調用
				const duplicates = this.findDuplicatesInTimeWindow(calls, 1000); // 1秒內
				if (duplicates.length > 0) {
					report.issues.push({
						type: "duplicate_calls",
						endpoint,
						count: duplicates.length,
						details: duplicates,
					});
				}
			}

			// 檢查 404 錯誤（通過 URL 模式）
			if (endpoint === "ERM_BASELINE") {
				const errorCalls = calls.filter((c) =>
					c.url.includes("/ERM_BASELINE"),
				);
				if (errorCalls.length === 0) {
					report.fixes.push({
						type: "404_eliminated",
						endpoint,
						description: "ERM_BASELINE 404 錯誤已消除",
					});
				} else {
					report.issues.push({
						type: "404_still_present",
						endpoint,
						count: errorCalls.length,
					});
				}
			}
		});

		return report;
	}

	findDuplicatesInTimeWindow(calls, windowMs) {
		const duplicates = [];
		const urlGroups = {};

		calls.forEach((call) => {
			if (!urlGroups[call.url]) {
				urlGroups[call.url] = [];
			}
			urlGroups[call.url].push(call);
		});

		Object.values(urlGroups).forEach((group) => {
			if (group.length > 1) {
				// 檢查是否在時間窗口內
				for (let i = 0; i < group.length - 1; i++) {
					for (let j = i + 1; j < group.length; j++) {
						if (
							Math.abs(group[i].timestamp - group[j].timestamp) <
							windowMs
						) {
							duplicates.push({
								url: group[i].url,
								timeDiff: Math.abs(
									group[i].timestamp - group[j].timestamp,
								),
							});
						}
					}
				}
			}
		});

		return duplicates;
	}

	stop() {
		window.fetch = this.originalFetch;
		console.log("🛑 API 調用監控已停止");
	}
}

// 自動測試函數
function runApiFixVerification(durationMs = 30000) {
	console.log("🚀 開始 API 修復驗證測試...");

	const monitor = new ApiCallMonitor();

	// 運行指定時間後生成報告
	setTimeout(() => {
		const report = monitor.getReport();
		monitor.stop();

		console.log("\n📊 API 修復驗證報告:");
		console.log("==================");

		// 顯示統計
		console.log("\n📈 API 調用統計:");
		Object.entries(report.apiCallStats).forEach(([endpoint, stats]) => {
			console.log(
				`${endpoint}: ${stats.totalCalls} 次調用, ${stats.uniqueUrls} 個唯一 URL`,
			);
		});

		// 顯示修復成果
		console.log("\n✅ 修復成果:");
		if (report.fixes.length > 0) {
			report.fixes.forEach((fix) => {
				console.log(`- ${fix.description}`);
			});
		} else {
			console.log("- 暫無明確的修復成果記錄");
		}

		// 顯示剩餘問題
		console.log("\n⚠️ 剩餘問題:");
		if (report.issues.length > 0) {
			report.issues.forEach((issue) => {
				console.log(
					`- ${issue.type}: ${issue.endpoint} (${issue.count} 次)`,
				);
			});
		} else {
			console.log("- 未發現重複調用問題 ✅");
		}

		// 整體評估
		console.log("\n🎯 整體評估:");
		const totalIssues = report.issues.length;
		const totalFixes = report.fixes.length;

		if (totalIssues === 0) {
			console.log("✅ 所有已知問題已修復！");
		} else if (totalIssues < 3) {
			console.log("🟡 大部分問題已修復，仍有少量問題需要關注");
		} else {
			console.log("🔴 仍有較多問題需要進一步修復");
		}

		return report;
	}, durationMs);

	console.log(`⏱️ 將監控 ${durationMs / 1000} 秒，請正常使用應用程序...`);
}

// 快速檢查函數
function quickApiCheck() {
	console.log("⚡ 快速 API 狀態檢查...");

	// 檢查全局 API 管理器
	if (window.globalApiManager) {
		console.log("✅ 全局 API 管理器已載入");
		console.log(`📊 當前緩存: ${window.globalApiManager.cache.size} 項`);
		console.log(
			`📊 進行中請求: ${window.globalApiManager.pendingRequests.size} 個`,
		);
	} else {
		console.log("❌ 全局 API 管理器未載入");
	}

	// 檢查日誌系統
	if (window.logger) {
		const logs = window.logger.getLogs();
		const apiLogs = logs.filter((log) => log.source?.includes("API"));
		console.log(`📝 API 相關日誌: ${apiLogs.length} 條`);

		const recentLogs = apiLogs.filter(
			(log) => Date.now() - new Date(log.timestamp).getTime() < 10000,
		);
		console.log(`📝 最近 10 秒日誌: ${recentLogs.length} 條`);
	} else {
		console.log("⚠️ 日誌系統未找到");
	}
}

// 暴露到全局
if (typeof window !== "undefined") {
	window.apiFixVerification = {
		runTest: runApiFixVerification,
		quickCheck: quickApiCheck,
		ApiCallMonitor,
	};

	console.log("🔧 API 修復驗證工具已載入");
	console.log("💡 運行完整測試: window.apiFixVerification.runTest()");
	console.log("💡 快速檢查: window.apiFixVerification.quickCheck()");
}

export { runApiFixVerification, quickApiCheck, ApiCallMonitor };
