const { PrismaClient } = require("@prisma/client");

async function testConnection() {
	const prisma = new PrismaClient();

	try {
		// 簡單的連接測試
		const result = await prisma.$queryRaw`SELECT 1 as test`;
		console.log("✅ 資料庫連接成功！");
		console.log("測試結果:", result);

		// 檢查是否能查詢表格
		const userCount = await prisma.user.count();
		console.log(`✅ 能成功查詢 User 表，目前有 ${userCount} 個用戶`);

		const organizationCount = await prisma.organization.count();
		console.log(
			`✅ 能成功查詢 Organization 表，目前有 ${organizationCount} 個組織`,
		);
	} catch (error) {
		console.error("❌ 資料庫連接測試失敗:", error.message);
	} finally {
		await prisma.$disconnect();
	}
}

testConnection();
