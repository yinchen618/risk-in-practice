const express = require("express");
const { PrismaClient } = require("./prisma/generated");
const path = require("path");
const fs = require("fs");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// 靜態文件服務
app.use(express.static(path.join(__dirname, "public")));

// API Routes

/**
 * 獲取統計資訊
 */
app.get("/api/stats", async (req, res) => {
	try {
		const [totalDatasets, totalSamples, distinctRooms] = await Promise.all([
			prisma.analysisDataset.count(),
			prisma.analysisReadyData.count(),
			prisma.analysisReadyData.groupBy({
				by: ["room"],
				_count: true,
			}),
		]);

		// 獲取資料庫檔案大小
		const dbPath = path.join(__dirname, "prisma", "pu_practice.db");
		let dbSize = "未知";
		try {
			const stats = fs.statSync(dbPath);
			const sizeInMB = (stats.size / (1024 * 1024)).toFixed(1);
			dbSize = `${sizeInMB} MB`;
		} catch (error) {
			console.warn("無法獲取資料庫檔案大小:", error.message);
		}

		res.json({
			totalDatasets,
			totalSamples,
			totalRooms: distinctRooms.length,
			dbSize,
		});
	} catch (error) {
		console.error("獲取統計資訊失敗:", error);
		res.status(500).json({ error: "獲取統計資訊失敗" });
	}
});

/**
 * 獲取所有數據集
 */
app.get("/api/datasets", async (req, res) => {
	try {
		const datasets = await prisma.analysisDataset.findMany({
			include: {
				_count: {
					select: {
						analysisData: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});

		res.json(datasets);
	} catch (error) {
		console.error("獲取數據集失敗:", error);
		res.status(500).json({ error: "獲取數據集失敗" });
	}
});

/**
 * 獲取所有房間
 */
app.get("/api/rooms", async (req, res) => {
	try {
		const rooms = await prisma.analysisReadyData.groupBy({
			by: ["room"],
			_count: true,
			orderBy: {
				room: "asc",
			},
		});

		res.json(rooms);
	} catch (error) {
		console.error("獲取房間列表失敗:", error);
		res.status(500).json({ error: "獲取房間列表失敗" });
	}
});

/**
 * 獲取樣本數據
 */
app.get("/api/samples", async (req, res) => {
	try {
		const { datasetId, room, limit = 100, offset = 0 } = req.query;

		const where = {};
		if (datasetId) where.datasetId = datasetId;
		if (room) where.room = room;

		const [samples, total] = await Promise.all([
			prisma.analysisReadyData.findMany({
				where,
				include: {
					dataset: {
						select: {
							name: true,
						},
					},
				},
				orderBy: {
					timestamp: "desc",
				},
				take: Number.parseInt(limit),
				skip: Number.parseInt(offset),
			}),
			prisma.analysisReadyData.count({ where }),
		]);

		res.json({
			samples,
			total,
			limit: Number.parseInt(limit),
			offset: Number.parseInt(offset),
		});
	} catch (error) {
		console.error("獲取樣本數據失敗:", error);
		res.status(500).json({ error: "獲取樣本數據失敗" });
	}
});

/**
 * 獲取數據集詳細資訊
 */
app.get("/api/datasets/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const dataset = await prisma.analysisDataset.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						analysisData: true,
					},
				},
			},
		});

		if (!dataset) {
			return res.status(404).json({ error: "數據集不存在" });
		}

		// 獲取該數據集的統計資訊
		const [roomCount, positiveLabels, timeRange] = await Promise.all([
			prisma.analysisReadyData.groupBy({
				where: { datasetId: id },
				by: ["room"],
			}),
			prisma.analysisReadyData.count({
				where: {
					datasetId: id,
					isPositiveLabel: true,
				},
			}),
			prisma.analysisReadyData.aggregate({
				where: { datasetId: id },
				_min: { timestamp: true },
				_max: { timestamp: true },
			}),
		]);

		res.json({
			...dataset,
			stats: {
				roomCount: roomCount.length,
				positiveCount: positiveLabels,
				negativeCount: dataset._count.analysisData - positiveLabels,
				timeRange: {
					start: timeRange._min.timestamp,
					end: timeRange._max.timestamp,
				},
			},
		});
	} catch (error) {
		console.error("獲取數據集詳細資訊失敗:", error);
		res.status(500).json({ error: "獲取數據集詳細資訊失敗" });
	}
});

/**
 * 獲取房間詳細資訊
 */
app.get("/api/rooms/:room", async (req, res) => {
	try {
		const { room } = req.params;

		const [totalSamples, positiveLabels, timeRange, powerStats] =
			await Promise.all([
				prisma.analysisReadyData.count({
					where: { room },
				}),
				prisma.analysisReadyData.count({
					where: {
						room,
						isPositiveLabel: true,
					},
				}),
				prisma.analysisReadyData.aggregate({
					where: { room },
					_min: { timestamp: true },
					_max: { timestamp: true },
				}),
				prisma.analysisReadyData.aggregate({
					where: { room },
					_avg: {
						wattageTotal: true,
						rawWattageL1: true,
						rawWattageL2: true,
					},
					_max: {
						wattageTotal: true,
					},
					_min: {
						wattageTotal: true,
					},
				}),
			]);

		if (totalSamples === 0) {
			return res.status(404).json({ error: "房間不存在" });
		}

		res.json({
			room,
			totalSamples,
			positiveLabels,
			negativeLabels: totalSamples - positiveLabels,
			timeRange: {
				start: timeRange._min.timestamp,
				end: timeRange._max.timestamp,
			},
			powerStats: {
				avgTotal: powerStats._avg.wattageTotal,
				avgL1: powerStats._avg.rawWattageL1,
				avgL2: powerStats._avg.rawWattageL2,
				maxTotal: powerStats._max.wattageTotal,
				minTotal: powerStats._min.wattageTotal,
			},
		});
	} catch (error) {
		console.error("獲取房間詳細資訊失敗:", error);
		res.status(500).json({ error: "獲取房間詳細資訊失敗" });
	}
});

// 錯誤處理中間件
app.use((error, req, res, next) => {
	console.error("伺服器錯誤:", error);
	res.status(500).json({ error: "內部伺服器錯誤" });
});

// 404 處理
app.use((req, res) => {
	res.status(404).json({ error: "找不到資源" });
});

// 啟動伺服器
app.listen(PORT, () => {
	console.log("🚀 PU Learning SQLite 資料庫伺服器啟動成功！");
	console.log(`📊 網頁界面: http://localhost:${PORT}`);
	console.log(`🔗 API 端點: http://localhost:${PORT}/api/stats`);
	console.log(
		`📁 資料庫位置: ${path.join(__dirname, "prisma", "pu_practice.db")}`,
	);
});

// 優雅關閉
process.on("SIGINT", async () => {
	console.log("📡 正在關閉伺服器...");
	await prisma.$disconnect();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("📡 正在關閉伺服器...");
	await prisma.$disconnect();
	process.exit(0);
});
