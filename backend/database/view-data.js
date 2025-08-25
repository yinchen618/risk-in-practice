const { PrismaClient } = require("./prisma/generated");

async function viewData() {
	const prisma = new PrismaClient();

	try {
		console.log("=== Database Summary ===");

		// 統計資訊
		const datasetCount = await prisma.analysisDataset.count();
		const dataCount = await prisma.analysisReadyData.count();
		const experimentCount = await prisma.experimentRun.count();

		console.log(`📊 Analysis Datasets: ${datasetCount}`);
		console.log(`📈 Analysis Ready Data: ${dataCount.toLocaleString()}`);
		console.log(`🧪 Experiment Runs: ${experimentCount}`);

		console.log("\n=== Recent Datasets ===");
		const recentDatasets = await prisma.analysisDataset.findMany({
			take: 10,
			orderBy: { createdAt: "desc" },
			select: {
				name: true,
				building: true,
				floor: true,
				room: true,
				totalRecords: true,
				positiveLabels: true,
				createdAt: true,
			},
		});

		recentDatasets.forEach((dataset) => {
			console.log(`📍 ${dataset.name}`);
			console.log(
				`   Location: ${dataset.building}-${dataset.floor}-${dataset.room}`,
			);
			console.log(
				`   Records: ${dataset.totalRecords.toLocaleString()}, Anomalies: ${dataset.positiveLabels}`,
			);
			console.log(`   Created: ${dataset.createdAt.toLocaleString()}`);
			console.log("");
		});

		console.log("=== Experiment Runs ===");
		const experiments = await prisma.experimentRun.findMany({
			orderBy: { createdAt: "desc" },
			select: {
				name: true,
				status: true,
				candidateCount: true,
				createdAt: true,
			},
		});

		experiments.forEach((exp) => {
			console.log(`🧪 ${exp.name} - ${exp.status}`);
			console.log(`   Candidates: ${exp.candidateCount || 0}`);
			console.log(`   Created: ${exp.createdAt.toLocaleString()}`);
			console.log("");
		});
	} catch (error) {
		console.error("Error:", error);
	} finally {
		await prisma.$disconnect();
	}
}

// 如果直接執行此檔案
if (require.main === module) {
	viewData();
}

module.exports = { viewData };
