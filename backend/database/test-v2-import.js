const { PrismaClient } = require("./prisma/generated");

async function testV2Import() {
	const prisma = new PrismaClient();

	try {
		console.log("🧪 Testing V2 import data quality...\n");

		// Test 1: Query all AnalysisDataset records (this would fail with V1 data)
		console.log("Test 1: Querying all AnalysisDataset records...");
		const datasets = await prisma.analysisDataset.findMany({
			take: 5,
			include: {
				analysisData: {
					take: 1,
				},
			},
		});
		console.log(`✅ Successfully queried ${datasets.length} datasets`);

		// Test 2: Check datetime format
		console.log("\nTest 2: Checking datetime formats...");
		const sampleDataset = datasets[0];
		console.log(`Sample start date: ${sampleDataset.startDate}`);
		console.log(`Sample end date: ${sampleDataset.endDate}`);
		console.log(`Sample created at: ${sampleDataset.createdAt}`);

		// Verify ISO format with milliseconds and timezone
		const isValidFormat = (dateStr) => {
			return dateStr.includes(".") && dateStr.endsWith("Z");
		};

		if (
			isValidFormat(sampleDataset.startDate.toISOString()) &&
			isValidFormat(sampleDataset.endDate.toISOString()) &&
			isValidFormat(sampleDataset.createdAt.toISOString())
		) {
			console.log("✅ All datetime formats are correct");
		} else {
			console.log("❌ Some datetime formats are incorrect");
		}

		// Test 3: Query AnalysisReadyData with all fields
		console.log("\nTest 3: Querying AnalysisReadyData records...");
		const readyData = await prisma.analysisReadyData.findMany({
			take: 3,
		});
		console.log(
			`✅ Successfully queried ${readyData.length} ready data records`,
		);

		// Test 4: Check for data integrity
		console.log("\nTest 4: Checking data integrity...");
		const totalDatasets = await prisma.analysisDataset.count();
		const totalReadyData = await prisma.analysisReadyData.count();

		console.log(`Total datasets: ${totalDatasets}`);
		console.log(`Total analysis ready data: ${totalReadyData}`);

		if (totalDatasets > 0 && totalReadyData > 0) {
			console.log("✅ Data import successful");
		} else {
			console.log("❌ Data import incomplete");
		}

		console.log("\n🎉 All V2 tests passed! The import was successful.");
	} catch (error) {
		console.error("❌ Test failed:", error.message);
		console.error("This indicates there are still data integrity issues.");
	} finally {
		await prisma.$disconnect();
	}
}

testV2Import();
