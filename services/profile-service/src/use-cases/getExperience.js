const { getProfileOrThrow } = require("./getProfileOrThrow");
const { getProfileSectionOrThrow } = require("./getProfileSectionOrThrow");

async function getExperience({ prisma, profileId, experienceId }) {
  await getProfileOrThrow({ prisma, profileId });

  return getProfileSectionOrThrow({
    prisma,
    model: "experience",
    profileId,
    sectionId: experienceId,
    code: "experience_not_found",
  });
}

module.exports = { getExperience };
