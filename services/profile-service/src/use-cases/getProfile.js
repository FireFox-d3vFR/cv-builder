const { getProfileOrThrow } = require("./getProfileOrThrow");

async function getProfile({ prisma, profileId }) {
  await getProfileOrThrow({ prisma, profileId });

  return prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      experiences: {
        orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
      },
      educations: {
        orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
      },
      skills: {
        orderBy: [{ createdAt: "desc" }],
      },
    },
  });
}

module.exports = { getProfile };
