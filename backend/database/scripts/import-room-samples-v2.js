/**
 * 房間樣本數據匯入腳本 (JavaScript 版本)
 *
 * 功能：
 * 1. 讀取 *.json 檔案創建 AnalysisDataset 記錄
 * 2. 讀取 *.csv 檔案填充 AnalysisReadyData 記錄
 * 3. 使用批次處理提高效率
 */

const { PrismaClient } = require("../prisma/generated");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const prisma = new PrismaClient();

// 配置路徑
const ROOM_SAMPLES_DIR = path.join(
	__dirname,
	"../../preprocessing/room_samples_for_pu",
);

/**
 * 讀取房間 JSON 檔案來建立 AnalysisDataset
 */
async function loadDatasetFromJson(jsonFilePath) {
	if (!fs.existsSync(jsonFilePath)) {
		throw new Error(`JSON 檔案不存在: ${jsonFilePath}`);
	}

	const jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

	return {
		roomId: jsonContent.room_id,
		building: jsonContent.building || "未知建築",
		floor: jsonContent.floor || "未知樓層",
		room: jsonContent.room || "未知房間",
		occupantType: jsonContent.occupant_type || "OFFICE_WORKER",
		meterIdL1: jsonContent.l1_device || "",
		meterIdL2: jsonContent.l2_device || "",
		startDate: jsonContent.start_date,
		endDate: jsonContent.end_date,
		totalRecords: jsonContent.total_records,
		positiveLabels: jsonContent.positive_labels,
		isHighQuality: jsonContent.is_high_quality || false,
	};
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
			meterIdL1: metadata.meterIdL1,
			meterIdL2: metadata.meterIdL2,
			totalRecords: metadata.totalRecords,
			positiveLabels: metadata.positiveLabels,
		},
	});

	console.log(`✅ 已創建數據集: ${dataset.name}`);
	return dataset;
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
				let timestamp = row.datetime;
				if (timestamp) {
					// 移除毫秒部分 (.000) 和時區部分 (+00:00)
					timestamp = timestamp.replace(
						/\.\d{3}[+-]\d{2}:\d{2}$/,
						"",
					);
					timestamp = timestamp.replace(/[+-]\d{2}:\d{2}$/, "");
				}

				data.push({
					datetime: timestamp,
					occupancy: Number.parseInt(row.occupancy, 10),
					hour: Number.parseInt(row.hour, 10),
					minute: Number.parseInt(row.minute, 10),
					dayOfWeek: Number.parseInt(row.dayOfWeek, 10),
					dayOfMonth: Number.parseInt(row.dayOfMonth, 10),
					month: Number.parseInt(row.month, 10),
					quarter: Number.parseInt(row.quarter, 10),
					kwh: Number.parseFloat(row.kwh),
					amperePeak: Number.parseFloat(row.amperePeak),
					ampereMean: Number.parseFloat(row.ampereMean),
					ampereVariance: Number.parseFloat(row.ampereVariance),
					voltPeak: Number.parseFloat(row.voltPeak),
					voltMean: Number.parseFloat(row.voltMean),
					voltVariance: Number.parseFloat(row.voltVariance),
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
 * 批次插入數據到資料庫
 */
async function batchInsertData(datasetId, data, batchSize = 1000) {
	const totalRecords = data.length;
	let insertedCount = 0;

	for (let i = 0; i < totalRecords; i += batchSize) {
		const batch = data.slice(i, i + batchSize);
		const batchData = batch.map((item) => ({
			...item,
			analysisDatasetId: datasetId,
		}));

		try {
			await prisma.analysisReadyData.createMany({
				data: batchData,
				skipDuplicates: true,
			});

			insertedCount += batch.length;
			console.log(
				`  📦 已插入第 ${Math.floor(i / batchSize) + 1} 批次: ${insertedCount}/${totalRecords} 筆記錄`,
			);
		} catch (error) {
			console.error(
				`❌ 批次插入失敗 (第 ${Math.floor(i / batchSize) + 1} 批):`,
				error.message,
			);
			throw error;
		}
	}

	return insertedCount;
}

/**
 * 主要匯入流程
 */
async function main() {
	console.log("🚀 開始房間樣本數據匯入...");

	try {
		// 獲取所有 JSON 檔案
		const jsonFiles = fs
			.readdirSync(ROOM_SAMPLES_DIR)
			.filter(
				(file) =>
					file.endsWith(".json") && file.startsWith("room_summary_"),
			);

		console.log(`📁 找到 ${jsonFiles.length} 個 JSON 檔案`);

		let totalDatasets = 0;
		let totalRecords = 0;

		for (const jsonFile of jsonFiles) {
			const jsonFilePath = path.join(ROOM_SAMPLES_DIR, jsonFile);
			const roomId = jsonFile
				.replace("room_summary_", "")
				.replace(".json", "");
			const csvFilePath = path.join(
				ROOM_SAMPLES_DIR,
				`room_samples_${roomId}.csv`,
			);

			console.log(`\n📊 處理房間: ${roomId}`);

			try {
				// 1. 讀取 JSON 檔案建立 dataset
				const metadata = await loadDatasetFromJson(jsonFilePath);
				const dataset = await createAnalysisDataset(metadata);
				totalDatasets++;

				// 2. 讀取 CSV 檔案並插入數據
				if (fs.existsSync(csvFilePath)) {
					const sampleData = await loadRoomSampleData(csvFilePath);
					const insertedCount = await batchInsertData(
						dataset.id,
						sampleData,
					);
					totalRecords += insertedCount;

					console.log(
						`✅ 房間 ${roomId} 完成: ${insertedCount} 筆記錄`,
					);
				} else {
					console.warn(`⚠️  房間 ${roomId} 沒有對應的 CSV 檔案`);
				}
			} catch (error) {
				console.error(
					`❌ 處理房間 ${roomId} 時發生錯誤:`,
					error.message,
				);
			}
		}

		console.log("\n🎉 匯入完成!");
		console.log(`📈 總計建立 ${totalDatasets} 個數據集`);
		console.log(`📊 總計插入 ${totalRecords} 筆記錄`);
	} catch (error) {
		console.error("❌ 匯入過程中發生錯誤:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

// 執行主程式
if (require.main === module) {
	main();
}

module.exports = {
	loadDatasetFromJson,
	createAnalysisDataset,
	loadRoomSampleData,
	batchInsertData,
	main,
};
