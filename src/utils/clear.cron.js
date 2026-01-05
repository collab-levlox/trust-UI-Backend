const nodeCron  = require("node-cron");
const prisma = require("../../prisma");

nodeCron.schedule('0 12 * * *', async () => {

  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const deleted = await prisma.otpStroe.deleteMany({
      where: {
        createdAt: {
          lt: oneHourAgo
        }
      }
    });
    console.log(`✅ Deleted ${deleted.count} old records`);
  } catch (err) {
    console.error('❌ Cleanup failed:', err);
  }
});
