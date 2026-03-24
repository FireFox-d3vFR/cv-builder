const { getProfileOrThrow } = require("./getProfileOrThrow");

async function listSkills({ prisma, profileId }) {
  await getProfileOrThrow({ prisma, profileId });

  return prisma.skill.findMany({
    where: { profileId },
    orderBy: [{ createdAt: "desc" }],
  });
}

module.exports = { listSkills };
