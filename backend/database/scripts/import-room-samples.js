/**
 * 房間樣本數據匯入腳本
 *
 * 功能：
 * 1. 讀取 *.json 檔案創建 AnalysisDataset 記錄
 * 2. 讀取 *.csv 檔案填充 AnalysisReadyData 記錄
 * 3. 使用 rooms_metadata.csv 提供建築物/樓層資訊
 */

const { PrismaClient } = require("../prisma/generated");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const prisma = new PrismaClient();

// ========== 配置 ==========
const ROOM_SAMPLES_DIR = path.join(
	__dirname,
	"../../preprocessing/room_samples_for_pu",
);
const METADATA_FILE = path.join(ROOM_SAMPLES_DIR, "rooms_metadata.csv");

/**
 * 讀取並解析房間元資料
 */
async function loadRoomMetadata() {
	return new Promise((resolve, reject) => {
		const metadata = {};

		if (!fs.existsSync(METADATA_FILE)) {
			reject(new Error(`元資料文件不存在: ${METADATA_FILE}`));
			return;
		}

		fs.createReadStream(METADATA_FILE)
			.pipe(csv())
			.on("data", (data) => {
				metadata[data.room_id] = {
					building: data.building,
					floor: data.floor,
					room: data.room,
					occupantType: data.occupant_type || "OFFICE_WORKER",
					l1Device: data.l1_device,
					l2Device: data.l2_device,
					isHighQuality: data.is_high_quality === "True",
				};
			})
			.on("end", () => {
				console.log(
					`✅ 已讀取 ${Object.keys(metadata).length} 筆房間元資料`,
				);
				resolve(metadata);
			})
			.on("error", reject);
	});
}

/**
 * 讀取房間樣本 JSON 檔案來建立 AnalysisDataset
 */
async function loadDatasetFromJson(jsonFilePath) {
	if (!fs.existsSync(jsonFilePath)) {
		throw new Error(`JSON 檔案不存在: ${jsonFilePath}`);
	}

	const jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

	return {
		roomId: jsonContent.room_id,
		startDate: jsonContent.data_summary.time_range.start,
		endDate: jsonContent.data_summary.time_range.end,
		totalRecords: jsonContent.data_summary.total_samples,
		positiveLabels: jsonContent.data_summary.positive_samples,
	};
}

/**
 * 讀取房間樣本 CSV 文件
 */
async function loadRoomSampleData(csvFilePath) {
	return new Promise((resolve, reject) => {
		const data = [];

		if (!fs.existsSync(csvFilePath)) {
			reject(new Error(`CSV 文件不存在: ${csvFilePath}`));
			return;
		}

		fs.createReadStream(csvFilePath)
			.pipe(csv())
			.on("data", (row) => {
				// 標準化時間戳格式 (移除毫秒和時區)
				let timestamp = row.timestamp;
				if (timestamp) {
					// 移除毫秒部分 (.000) 和時區部分 (+00:00)
					timestamp = timestamp.replace(
						/\.\d{3}[+-]\d{2}:\d{2}$/,
						"",
					);
					timestamp = timestamp.replace(/[+-]\d{2}:\d{2}$/, "");
				}

				data.push({
					timestamp: new Date(timestamp),
					room: row.room_id,
					rawWattageL1: Number.parseFloat(row.rawWattageL1) || 0,
					rawWattageL2: Number.parseFloat(row.rawWattageL2) || 0,
					wattage110v:
						Number.parseFloat(row.wattage110v_current) || 0,
					wattage220v:
						Number.parseFloat(row.wattage220v_current) || 0,
					wattageTotal:
						Number.parseFloat(row.wattageTotal_current) || 0,
					isPositiveLabel:
						row.isPositiveLabel === "True" ||
						row.isPositiveLabel === true,
					sourceAnomalyEventId:
						row.sourceAnomalyEventId &&
						row.sourceAnomalyEventId !== ""
							? row.sourceAnomalyEventId
							: null,
				});
			})
			.on("end", () => {
				console.log(
					`✅ 從 ${csvFilePath} 讀取了 ${data.length} 筆記錄`,
				);
				resolve(data);
			})
			.on("error", reject);
	});
}

/**
 * 創建 AnalysisDataset 記錄
 */
async function createAnalysisDataset(metadata) {
	const dataset = await prisma.analysisDataset.create({
		data: {
			name: `${metadata.building}-${metadata.floor}-${metadata.room}-Golden-Week`,
			description: `Golden Week 數據集 - ${metadata.building} ${metadata.floor} ${metadata.room}`,
			building: metadata.building,
			floor: metadata.floor,
			room: metadata.room,
			startDate: new Date(metadata.startDate),
			endDate: new Date(metadata.endDate),
			occupantType: metadata.occupantType,
			meterIdL1: metadata.l1Device || "",
			meterIdL2: metadata.l2Device || "",
			totalRecords: metadata.totalRecords,
			positiveLabels: metadata.positiveLabels,
		},
	});

	console.log(`✅ 已創建數據集: ${dataset.name}`);
	return dataset;
}

/**
 * 批量插入 AnalysisReadyData
 */
async function insertAnalysisReadyData(datasetId, samples) {
	const BATCH_SIZE = 1000;
	const totalBatches = Math.ceil(samples.length / BATCH_SIZE);

	console.log(
		`📊 開始批量插入 ${samples.length} 筆數據，分 ${totalBatches} 批次...`,
	);

	for (let i = 0; i < totalBatches; i++) {
		const start = i * BATCH_SIZE;
		const end = Math.min((i + 1) * BATCH_SIZE, samples.length);
		const batch = samples.slice(start, end);

		const dataToInsert = batch.map((sample) => ({
			datasetId: datasetId,
			timestamp: sample.timestamp,
			room: sample.room,
			rawWattageL1: sample.rawWattageL1,
			rawWattageL2: sample.rawWattageL2,
			wattage110v: sample.wattage110v,
			wattage220v: sample.wattage220v,
			wattageTotal: sample.wattageTotal,
			isPositiveLabel: sample.isPositiveLabel,
			sourceAnomalyEventId: sample.sourceAnomalyEventId,
		}));

		await prisma.analysisReadyData.createMany({
			data: dataToInsert,
		});

		console.log(
			`✅ 已完成第 ${i + 1}/${totalBatches} 批次 (${end}/${samples.length} 筆)`,
		);
	}
}

/**
 * 主要匯入流程
 */
async function main() {
	try {
		console.log("🚀 開始匯入房間樣本數據...");

		// 1. 讀取房間元資料
		const roomMetadataMap = await loadRoomMetadata();
		const roomIds = Object.keys(roomMetadataMap);

		// 2. 清理現有數據（可選）
		console.log("🧹 清理現有數據...");
		await prisma.analysisReadyData.deleteMany();
		await prisma.analysisDataset.deleteMany();

		// 3. 逐個處理房間
		for (let i = 0; i < roomIds.length; i++) {
			const roomId = roomIds[i];
			const metadata = roomMetadataMap[roomId];
			console.log(`\n📂 處理房間 ${i + 1}/${roomIds.length}: ${roomId}`);

			try {
				// 檢查 JSON 和 CSV 檔案是否存在
				const jsonPath = path.join(
					ROOM_SAMPLES_DIR,
					`room_summary_${roomId}.json`,
				);
				const csvPath = path.join(
					ROOM_SAMPLES_DIR,
					`room_samples_${roomId}.csv`,
				);

				if (!fs.existsSync(jsonPath) || !fs.existsSync(csvPath)) {
					console.log(`⚠️  房間 ${roomId} 缺少必要檔案，跳過`);
					continue;
				}

				// 讀取 JSON 資料用於建立 AnalysisDataset
				const datasetInfo = await loadDatasetFromJson(jsonPath);

				// 創建數據集記錄，結合 metadata 和 JSON 資料
				const dataset = await createAnalysisDataset({
					...datasetInfo,
					...metadata,
					roomId: roomId,
				});

				// 讀取樣本數據
				const samples = await loadRoomSampleData(csvPath);

				if (samples.length > 0) {
					// 插入樣本數據
					await insertAnalysisReadyData(dataset.id, samples);
					console.log(`✅ 房間 ${roomId} 處理完成`);
				} else {
					console.log(`⚠️  房間 ${roomId} 無有效樣本數據`);
				}
			} catch (error) {
				console.error(
					`❌ 處理房間 ${roomId} 時發生錯誤:`,
					error.message,
				);
				// 繼續處理下一個房間
			}
		}

		// 4. 顯示匯入統計
		const datasetCount = await prisma.analysisDataset.count();
		const dataCount = await prisma.analysisReadyData.count();

		console.log("\n🎉 匯入完成！");
		console.log("📊 統計資訊:");
		console.log(`   - 數據集數量: ${datasetCount}`);
		console.log(`   - 樣本數據總數: ${dataCount}`);
	} catch (error) {
		console.error("❌ 匯入過程中發生錯誤:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

// 執行匯入
if (require.main === module) {
	main().catch(console.error);
}

module.exports = { main, loadRoomMetadata, loadRoomSampleData };
