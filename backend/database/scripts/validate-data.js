// 資料驗證腳本 - 檢查 SQLite 資料庫中所有資料表的完整性
const { PrismaClient } = require("../prisma/generated");

// 輔助函數：驗證單一資料表
async function validateTable(
	tableName,
	testFunction,
	skipErrorHandling = false,
) {
	try {
		console.log(`\n📋 檢查 ${tableName}...`);
		const result = await testFunction();

		console.log(`✅ ${tableName} 資料完整性良好`);
		console.log(`   📊 記錄數量: ${result.count}`);

		if (result.sample) {
			console.log(`   🔍 範例資料: ID=${result.sample.id || "N/A"}`);
			// 顯示一些關鍵欄位
			if (result.sample.createdAt) {
				console.log(`   📅 建立時間: ${result.sample.createdAt}`);
			}
			if (result.sample.name) {
				console.log(`   📝 名稱: ${result.sample.name}`);
			}
		} else if (result.count === 0) {
			console.log("   ⚠️  此資料表目前沒有資料");
		}
	} catch (error) {
		if (skipErrorHandling) {
			throw error; // 讓外層處理
		}

		console.log(`❌ ${tableName} 發現問題:`);
		console.log(`   錯誤訊息: ${error.message}`);

		// 嘗試基本的資料修復
		if (error.message.includes("date") || error.message.includes("time")) {
			console.log("   🔧 嘗試修復日期時間格式問題...");
			// 這裡可以加入特定的修復邏輯
		}
	}
}

async function validateAndFixData() {
	const prisma = new PrismaClient();

	try {
		console.log("🔍 開始檢查資料庫所有資料表的完整性...");
		console.log("=".repeat(60));

		// 1. 測試 AnalysisDataset - 包含修復功能
		try {
			await validateTable(
				"AnalysisDataset",
				async () => {
					const count = await prisma.analysisDataset.count();
					const sample = await prisma.analysisDataset.findMany({
						take: 1,
					});
					return {
						count,
						sample: sample.length > 0 ? sample[0] : null,
					};
				},
				true,
			); // 跳過內建錯誤處理，讓外層處理
		} catch (error) {
			console.log("❌ AnalysisDataset 發現問題，開始修復...");

			// 使用原生 SQL 修復日期格式問題
			await prisma.$executeRaw`
                UPDATE analysis_datasets 
                SET created_at = datetime('now') 
                WHERE created_at LIKE '%�%' OR length(created_at) != 23
            `;

			await prisma.$executeRaw`
                UPDATE analysis_datasets 
                SET start_date = start_date || '.000Z',
                    end_date = end_date || '.000Z'
                WHERE start_date NOT LIKE '%.%Z'
            `;

			console.log("✅ AnalysisDataset 修復完成");

			// 重新驗證
			await validateTable("AnalysisDataset", async () => {
				const count = await prisma.analysisDataset.count();
				const sample = await prisma.analysisDataset.findMany({
					take: 1,
				});
				return { count, sample: sample.length > 0 ? sample[0] : null };
			});
		}

		// 2. 測試 AnalysisReadyData
		await validateTable("AnalysisReadyData", async () => {
			const count = await prisma.analysisReadyData.count();
			const sample = await prisma.analysisReadyData.findMany({ take: 1 });
			return { count, sample: sample.length > 0 ? sample[0] : null };
		});

		// 3. 測試 ExperimentRun - 包含錯誤處理
		try {
			await validateTable(
				"ExperimentRun",
				async () => {
					const count = await prisma.experimentRun.count();
					const sample = await prisma.experimentRun.findMany({
						take: 1,
					});
					return {
						count,
						sample: sample.length > 0 ? sample[0] : null,
					};
				},
				true,
			); // 跳過內建錯誤處理，讓外層處理
		} catch (error) {
			console.log("❌ ExperimentRun 發現問題:", error.message);
			// 這裡可以加入更多特定的修復邏輯
		}

		// 4. 測試 AnomalyEvent
		await validateTable("AnomalyEvent", async () => {
			const count = await prisma.anomalyEvent.count();
			const sample = await prisma.anomalyEvent.findMany({ take: 1 });
			return { count, sample: sample.length > 0 ? sample[0] : null };
		});

		// 5. 測試 AnomalyLabel
		await validateTable("AnomalyLabel", async () => {
			const count = await prisma.anomalyLabel.count();
			const sample = await prisma.anomalyLabel.findMany({ take: 1 });
			return { count, sample: sample.length > 0 ? sample[0] : null };
		});

		// 6. 測試 EventLabelLink
		await validateTable("EventLabelLink", async () => {
			const count = await prisma.eventLabelLink.count();
			const sample = await prisma.eventLabelLink.findMany({ take: 1 });
			return { count, sample: sample.length > 0 ? sample[0] : null };
		});

		// 7. 測試 TrainedModel
		await validateTable("TrainedModel", async () => {
			const count = await prisma.trainedModel.count();
			const sample = await prisma.trainedModel.findMany({ take: 1 });
			return { count, sample: sample.length > 0 ? sample[0] : null };
		});

		// 8. 測試 EvaluationRun
		await validateTable("EvaluationRun", async () => {
			const count = await prisma.evaluationRun.count();
			const sample = await prisma.evaluationRun.findMany({ take: 1 });
			return { count, sample: sample.length > 0 ? sample[0] : null };
		});

		// 9. 測試 ModelPrediction
		await validateTable("ModelPrediction", async () => {
			const count = await prisma.modelPrediction.count();
			const sample = await prisma.modelPrediction.findMany({ take: 1 });
			return { count, sample: sample.length > 0 ? sample[0] : null };
		});

		// 10. 測試 Ammeter
		await validateTable("Ammeter", async () => {
			const count = await prisma.ammeter.count();
			const sample = await prisma.ammeter.findMany({ take: 1 });
			return { count, sample: sample.length > 0 ? sample[0] : null };
		});

		// 11. 測試 AmmeterLog
		await validateTable("AmmeterLog", async () => {
			const count = await prisma.ammeterLog.count();
			const sample = await prisma.ammeterLog.findMany({ take: 1 });
			return { count, sample: sample.length > 0 ? sample[0] : null };
		});

		console.log(`\n${"=".repeat(60)}`);
		console.log("🎉 所有資料表驗證完成");
	} catch (error) {
		console.error("❌ 驗證過程中發生錯誤:", error);
	} finally {
		await prisma.$disconnect();
	}
}

// 如果直接執行此腳本
if (require.main === module) {
	validateAndFixData();
}

module.exports = { validateAndFixData };
