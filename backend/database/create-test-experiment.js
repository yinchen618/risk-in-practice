const { PrismaClient } = require("./prisma/generated");

async function createTestExperimentRun() {
	const prisma = new PrismaClient();

	try {
		console.log("Creating test experiment run...");

		const testExperiment = await prisma.experimentRun.create({
			data: {
				name: "Test Experiment",
				description: "Testing character encoding",
				filteringParameters: JSON.stringify({
					power_threshold_min: 0,
					power_threshold_max: 10000,
					spike_detection_threshold: 2,
					start_date: new Date("2025-07-26"),
					end_date: new Date("2025-08-25"),
					exclude_weekends: false,
					time_window_hours: 24,
					max_missing_ratio: 0.1,
					min_data_points: 100,
					enable_peer_comparison: true,
					peer_deviation_threshold: 1.5,
					buildings: [],
					floors: [],
					rooms: [],
				}),
				status: "CONFIGURING",
			},
		});

		console.log("✅ Test experiment created:", testExperiment.name);

		// 測試讀取
		const readBack = await prisma.experimentRun.findMany();
		console.log("✅ Read back successful, count:", readBack.length);

		readBack.forEach((exp) => {
			console.log(`  - ${exp.name}: ${exp.status}`);
			if (exp.filteringParameters) {
				try {
					const params = JSON.parse(exp.filteringParameters);
					console.log(
						`    Parameters parsed successfully, keys: ${Object.keys(params).length}`,
					);
				} catch (error) {
					console.log(`    JSON parse error: ${error.message}`);
				}
			}
		});
	} catch (error) {
		console.error("Error:", error);
	} finally {
		await prisma.$disconnect();
	}
}

createTestExperimentRun();
