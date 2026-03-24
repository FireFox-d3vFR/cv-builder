const { getProfileOrThrow } = require("./getProfileOrThrow");

async function listEducations({ prisma, profileId }) {
  await getProfileOrThrow({ prisma, profileId });

  return prisma.education.findMany({
    where: { profileId },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
  });
}

module.exports = { listEducations };
