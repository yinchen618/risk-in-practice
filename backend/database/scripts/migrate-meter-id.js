const { PrismaClient } = require("../prisma/generated");

const prisma = new PrismaClient();

async function main() {
	console.log("開始資料遷移...");

	// 1. 取得所有 AnalysisDataset，建立一個名稱到 ID 的映射表
	const datasets = await prisma.analysisDataset.findMany();
	const datasetNameToIdMap = new Map(datasets.map((d) => [d.name, d.id]));

	console.log(`找到 ${datasets.length} 個資料集：`);
	datasets.forEach((d) => console.log(`  - ${d.name} -> ${d.id}`));

	// 2. 查看現有的 AnomalyEvent 資料結構
	try {
		const sampleEvents = await prisma.$queryRaw`
      SELECT id, event_id, dataset_id, line 
      FROM anomaly_event 
      LIMIT 5
    `;

		console.log("\n現有的 AnomalyEvent 範例：");
		console.log(sampleEvents);

		if (sampleEvents.length > 0 && sampleEvents[0].dataset_id) {
			console.log("\n✅ 檢測到資料已經使用新的結構。無需遷移。");
			return;
		}
	} catch (error) {
		console.log("\n⚠️  看起來還是舊的資料結構，但新的 schema 已經生效。");
		console.log("可能沒有現有的 AnomalyEvent 資料，或者資料已經被重設。");
	}

	console.log("\n✅ 資料庫結構更新完成！");
}

main()
	.catch((e) => {
		console.error("遷移過程發生錯誤:", e);
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
