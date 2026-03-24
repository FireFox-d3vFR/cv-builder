const { updateProfileInputSchema } = require("@cv-builder/schemas");
const { getProfileOrThrow } = require("./getProfileOrThrow");

async function updateProfile({ prisma, profileId, input }) {
  await getProfileOrThrow({ prisma, profileId });

  const parsed = updateProfileInputSchema.parse(input);

  return prisma.profile.update({
    where: { id: profileId },
    data: {
      ...(parsed.fullName !== undefined ? { fullName: parsed.fullName } : {}),
      ...(parsed.title !== undefined ? { title: parsed.title ?? null } : {}),
    },
  });
}

module.exports = { updateProfile };
