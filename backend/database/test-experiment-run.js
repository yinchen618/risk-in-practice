const { PrismaClient } = require("./prisma/generated");

async function checkExperimentRun() {
	const prisma = new PrismaClient();

	try {
		console.log("=== Checking ExperimentRun without JSON field ===");

		// 先嘗試不包含 filtering_parameters 的查詢
		const experimentsBasic = await prisma.experimentRun.findMany({
			select: {
				id: true,
				name: true,
				status: true,
				candidateCount: true,
				createdAt: true,
			},
		});

		console.log("✅ Basic fields query successful:");
		experimentsBasic.forEach((exp) => {
			console.log(`  ${exp.name} - ${exp.status}`);
		});

		console.log("\n=== Trying to access JSON field individually ===");

		// 嘗試逐一讀取 filtering_parameters
		for (const exp of experimentsBasic) {
			try {
				const fullExp = await prisma.experimentRun.findUnique({
					where: { id: exp.id },
					select: {
						id: true,
						name: true,
						filteringParameters: true,
					},
				});

				console.log(`✅ ${exp.name}: JSON field accessible`);
				if (fullExp.filteringParameters) {
					console.log(
						`   Parameters: ${typeof fullExp.filteringParameters}`,
					);
				}
			} catch (error) {
				console.log(`❌ ${exp.name}: Error reading JSON field`);
				console.log(`   Error: ${error.message}`);
			}
		}
	} catch (error) {
		console.error("Error:", error.message);
	} finally {
		await prisma.$disconnect();
	}
}

checkExperimentRun();
