const { getProfileOrThrow } = require("./getProfileOrThrow");

async function deleteProfile({ prisma, profileId }) {
  await getProfileOrThrow({ prisma, profileId });

  await prisma.profile.delete({
    where: { id: profileId },
  });

  return { success: true };
}

module.exports = { deleteProfile };
