/**
 * 前端日誌記錄工具
 */

export interface LogEntry {
	timestamp: string;
	level: "info" | "warn" | "error" | "debug";
	message: string;
	data?: any;
	source?: string;
}

class Logger {
	private logs: LogEntry[] = [];
	private maxLogs = 1000; // 最大日誌條數

	private formatTimestamp(): string {
		return new Date().toISOString();
	}

	private addLog(
		level: LogEntry["level"],
		message: string,
		data?: any,
		source?: string,
	) {
		const entry: LogEntry = {
			timestamp: this.formatTimestamp(),
			level,
			message,
			data,
			source,
		};

		this.logs.push(entry);

		// 保持日誌數量在限制內
		if (this.logs.length > this.maxLogs) {
			this.logs = this.logs.slice(-this.maxLogs);
		}

		// 只輸出錯誤和警告到控制台，跳過 API 相關的 info 日誌
		if (
			level === "error" ||
			level === "warn" ||
			(level === "debug" && source !== "API")
		) {
			switch (level) {
				case "error":
					console.error(
						`[${entry.timestamp}] ${source ? `[${source}] ` : ""}${message}`,
						data,
					);
					break;
				case "warn":
					console.warn(
						`[${entry.timestamp}] ${source ? `[${source}] ` : ""}${message}`,
						data,
					);
					break;
				case "debug":
					console.debug(
						`[${entry.timestamp}] ${source ? `[${source}] ` : ""}${message}`,
						data,
					);
					break;
			}
		}
	}

	info(message: string, data?: any, source?: string) {
		this.addLog("info", message, data, source);
	}

	warn(message: string, data?: any, source?: string) {
		this.addLog("warn", message, data, source);
	}

	error(message: string, data?: any, source?: string) {
		this.addLog("error", message, data, source);
	}

	debug(message: string, data?: any, source?: string) {
		this.addLog("debug", message, data, source);
	}

	getLogs(): LogEntry[] {
		return [...this.logs];
	}

	getLogsByLevel(level: LogEntry["level"]): LogEntry[] {
		return this.logs.filter((log) => log.level === level);
	}

	getLogsBySource(source: string): LogEntry[] {
		return this.logs.filter((log) => log.source === source);
	}

	clear() {
		this.logs = [];
		console.log("Logger cleared");
	}

	// 導出日誌為 JSON
	exportLogs(): string {
		return JSON.stringify(this.logs, null, 2);
	}

	// 顯示 API 調用統計
	getApiCallStats(): { [key: string]: number } {
		const apiCalls = this.logs.filter(
			(log) =>
				log.source?.includes("API") ||
				log.message.includes("API") ||
				log.message.includes("fetch"),
		);
		const stats: { [key: string]: number } = {};

		apiCalls.forEach((log) => {
			const key = log.source || "unknown";
			stats[key] = (stats[key] || 0) + 1;
		});

		return stats;
	}
}

// 單例模式
export const logger = new Logger();

// 便捷的 API 調用記錄器
export const apiLogger = {
	request: (url: string, method = "GET", data?: any) => {
		logger.info(`API Request: ${method} ${url}`, data, "API");
	},
	response: (url: string, status: number, data?: any) => {
		logger.info(`API Response: ${status} ${url}`, data, "API");
	},
	error: (url: string, error: any) => {
		logger.error(`API Error: ${url}`, error, "API");
	},
	cached: (url: string, data?: any) => {
		logger.debug(`API Cached: ${url}`, data, "API-Cache");
	},
};
