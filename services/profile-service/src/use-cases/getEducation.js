const { getProfileOrThrow } = require("./getProfileOrThrow");
const { getProfileSectionOrThrow } = require("./getProfileSectionOrThrow");

async function getEducation({ prisma, profileId, educationId }) {
  await getProfileOrThrow({ prisma, profileId });

  return getProfileSectionOrThrow({
    prisma,
    model: "education",
    profileId,
    sectionId: educationId,
    code: "education_not_found",
  });
}

module.exports = { getEducation };
