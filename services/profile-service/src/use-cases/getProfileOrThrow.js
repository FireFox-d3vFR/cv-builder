const { HttpError } = require("../errors/httpError");

// Vérifie qu'un profil existe avant de rattacher ou lire ses sections.
async function getProfileOrThrow({ prisma, profileId }) {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });

  if (!profile) {
    throw new HttpError({
      statusCode: 404,
      code: "profile_not_found",
      message: `Profile ${profileId} not found`,
    });
  }

  return profile;
}

module.exports = { getProfileOrThrow };
