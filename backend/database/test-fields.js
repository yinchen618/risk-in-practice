const { PrismaClient } = require("./prisma/generated");

async function testFields() {
	const prisma = new PrismaClient();

	const fields = [
		"id",
		"name",
		"description",
		"building",
		"floor",
		"room",
		"startDate",
		"endDate",
		"occupantType",
		"meterIdL1",
		"meterIdL2",
		"totalRecords",
		"positiveLabels",
		"createdAt",
	];

	for (const field of fields) {
		try {
			console.log(`Testing field: ${field}`);
			const select = { [field]: true };
			const result = await prisma.analysisDataset.findMany({
				take: 1,
				select,
			});
			console.log(`✓ ${field} is OK`);
		} catch (error) {
			console.error(`✗ ${field} has invalid characters:`, error.message);
		}
	}

	await prisma.$disconnect();
}

testFields();
