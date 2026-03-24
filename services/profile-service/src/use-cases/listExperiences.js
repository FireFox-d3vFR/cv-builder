const { getProfileOrThrow } = require("./getProfileOrThrow");

async function listExperiences({ prisma, profileId }) {
  await getProfileOrThrow({ prisma, profileId });

  return prisma.experience.findMany({
    where: { profileId },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
  });
}

module.exports = { listExperiences };
