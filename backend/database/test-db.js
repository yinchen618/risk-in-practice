const { PrismaClient } = require("./prisma/generated");

async function test() {
	const prisma = new PrismaClient();

	try {
		console.log("Testing AnalysisDataset query...");
		const datasets = await prisma.analysisDataset.findMany({
			take: 1,
			select: {
				id: true,
				name: true,
				building: true,
				floor: true,
				room: true,
				occupantType: true,
			},
		});

		console.log("Success:", datasets);

		// Test with specific problematic fields
		console.log("\nTesting with all fields...");
		const allFields = await prisma.analysisDataset.findMany({
			take: 1,
		});

		console.log("All fields success:", allFields.length, "records");
	} catch (error) {
		console.error("Error:", error.message);
		console.error("Full error:", error);
	} finally {
		await prisma.$disconnect();
	}
}

test();
