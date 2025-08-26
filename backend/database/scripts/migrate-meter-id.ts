import { PrismaClient } from "../prisma/generated";

const prisma = new PrismaClient();

async function main() {
	console.log("開始資料遷移...");

	// 1. 取得所有 AnalysisDataset，建立一個名稱到 ID 的映射表
	const datasets = await prisma.analysisDataset.findMany();
	const datasetNameToIdMap = new Map(datasets.map((d) => [d.name, d.id]));

	console.log(`找到 ${datasets.length} 個資料集：`);
	datasets.forEach((d) => console.log(`  - ${d.name} -> ${d.id}`));

	// 2. 查看現有的 AnomalyEvent 資料結構
	const sampleEvents = (await prisma.$queryRaw`
    SELECT id, event_id, meter_id 
    FROM anomaly_event 
    LIMIT 5
  `) as any[];

	console.log("\n現有的 AnomalyEvent 範例：");
	console.log(sampleEvents);

	// 3. 檢查是否已經有 dataset_id 和 line 欄位
	try {
		const eventsWithNewFields = (await prisma.$queryRaw`
      SELECT id, dataset_id, line 
      FROM anomaly_event 
      WHERE dataset_id IS NOT NULL 
      LIMIT 5
    `) as any[];

		if (eventsWithNewFields.length > 0) {
			console.log("\n⚠️  檢測到資料已經遷移過了。跳過遷移步驟。");
			return;
		}
	} catch (error) {
		console.log("\n新欄位尚未建立，將繼續進行 schema 遷移...");
	}

	// 4. 取得所有需要遷移的事件
	const allEvents = (await prisma.$queryRaw`
    SELECT id, event_id, meter_id, event_timestamp, detection_rule, score, data_window, status
    FROM anomaly_event
  `) as any[];

	console.log(`\n找到 ${allEvents.length} 筆事件需要遷移...`);

	for (const event of allEvents) {
		try {
			// 解析舊的 meterId，例如 "Room R041 Analysis Dataset_L1"
			const meterId = event.meter_id;
			const parts = meterId.split("_");
			const line = parts.pop(); // "L1" or "L2"
			const datasetName = parts.join("_"); // "Room R041 Analysis Dataset"

			console.log(
				`處理事件 ${event.event_id}: ${meterId} -> Dataset: "${datasetName}", Line: "${line}"`,
			);

			// 從映射表中找到對應的 datasetId
			const datasetId = datasetNameToIdMap.get(datasetName);

			if (!datasetId) {
				console.error(
					`❌ 錯誤：找不到對應的 Dataset，名稱為 "${datasetName}"，Event ID: ${event.id}`,
				);
				continue;
			}

			if (!line || (line !== "L1" && line !== "L2")) {
				console.error(
					`❌ 錯誤：無效的線路標識 "${line}"，Event ID: ${event.id}`,
				);
				continue;
			}

			// 先檢查這個資料集是否存在
			const datasetExists = await prisma.analysisDataset.findUnique({
				where: { id: datasetId },
			});

			if (!datasetExists) {
				console.error(
					`❌ 錯誤：資料集不存在，ID: ${datasetId}，Event ID: ${event.id}`,
				);
				continue;
			}

			console.log(
				`✅ 成功遷移 Event ID: ${event.id} -> Dataset: ${datasetId}, Line: ${line}`,
			);
		} catch (error) {
			console.error(`❌ 處理事件 ${event.id} 時發生錯誤:`, error);
		}
	}

	console.log("\n✅ 資料遷移完成！");
}

main()
	.catch((e) => {
		console.error("遷移過程發生錯誤:", e);
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
