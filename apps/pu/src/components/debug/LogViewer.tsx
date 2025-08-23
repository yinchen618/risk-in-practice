"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LogEntry, logger } from "@/utils/logger";
import { Download, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export function LogViewer() {
	const [logs, setLogs] = useState<LogEntry[]>([]);
	const [apiStats, setApiStats] = useState<{ [key: string]: number }>({});

	const refreshLogs = () => {
		setLogs(logger.getLogs());
		setApiStats(logger.getApiCallStats());
	};

	const clearLogs = () => {
		logger.clear();
		refreshLogs();
	};

	const exportLogs = () => {
		const logData = logger.exportLogs();
		const blob = new Blob([logData], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `api-logs-${new Date().toISOString().slice(0, 19)}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	useEffect(() => {
		refreshLogs();
		const interval = setInterval(refreshLogs, 1000); // 每秒更新
		return () => clearInterval(interval);
	}, []);

	const recentApiLogs = logs.filter(
		(log) =>
			log.source?.includes("API") &&
			Date.now() - new Date(log.timestamp).getTime() < 30000, // 最近30秒
	);

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">API 調用監控</CardTitle>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={refreshLogs}
						>
							<RefreshCw className="w-4 h-4 mr-1" />
							刷新
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={exportLogs}
						>
							<Download className="w-4 h-4 mr-1" />
							導出
						</Button>
						<Button
							variant="destructive"
							size="sm"
							onClick={clearLogs}
						>
							<Trash2 className="w-4 h-4 mr-1" />
							清除
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* API 調用統計 */}
				<div>
					<h4 className="font-medium mb-2">API 調用統計</h4>
					<div className="flex flex-wrap gap-2">
						{Object.entries(apiStats).map(([source, count]) => (
							<Badge key={source} variant="secondary">
								{source}: {count}
							</Badge>
						))}
					</div>
				</div>

				{/* 最近的 API 調用 */}
				<div>
					<h4 className="font-medium mb-2">最近 API 調用 (30秒內)</h4>
					<div className="h-64 border rounded-md p-2 overflow-auto">
						{recentApiLogs.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								暫無 API 調用記錄
							</p>
						) : (
							<div className="space-y-1">
								{recentApiLogs
									.slice(-20)
									.reverse()
									.map((log, idx) => (
										<div
											key={idx}
											className="text-xs font-mono bg-slate-50 p-2 rounded"
										>
											<div className="flex items-center gap-2">
												<Badge
													variant={
														log.level === "error"
															? "destructive"
															: log.level ===
																	"warn"
																? "default"
																: log.source?.includes(
																			"Cache",
																		)
																	? "secondary"
																	: "outline"
													}
													className="text-xs"
												>
													{log.level}
												</Badge>
												<span className="text-slate-500">
													{new Date(
														log.timestamp,
													).toLocaleTimeString()}
												</span>
												<span className="text-slate-600">
													{log.source}
												</span>
											</div>
											<div className="mt-1 text-slate-700">
												{log.message}
											</div>
											{log.data && (
												<details className="mt-1">
													<summary className="text-slate-500 cursor-pointer">
														詳細資料
													</summary>
													<pre className="mt-1 text-xs text-slate-600 overflow-x-auto">
														{JSON.stringify(
															log.data,
															null,
															2,
														)}
													</pre>
												</details>
											)}
										</div>
									))}
							</div>
						)}
					</div>
				</div>

				{/* 總計 */}
				<div className="text-sm text-muted-foreground">
					總日誌條數: {logs.length} | API 相關:{" "}
					{logs.filter((l) => l.source?.includes("API")).length}
				</div>
			</CardContent>
		</Card>
	);
}
