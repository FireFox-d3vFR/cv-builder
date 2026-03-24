const { HttpError } = require("../errors/httpError");

async function getProfileSectionOrThrow({ prisma, model, profileId, sectionId, code }) {
  const section = await prisma[model].findFirst({
    where: {
      id: sectionId,
      profileId,
    },
  });

  if (!section) {
    throw new HttpError({
      statusCode: 404,
      code,
      message: `${model} ${sectionId} not found for profile ${profileId}`,
    });
  }

  return section;
}

module.exports = { getProfileSectionOrThrow };
