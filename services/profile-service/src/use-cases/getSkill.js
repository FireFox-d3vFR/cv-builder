const { getProfileOrThrow } = require("./getProfileOrThrow");
const { getProfileSectionOrThrow } = require("./getProfileSectionOrThrow");

async function getSkill({ prisma, profileId, skillId }) {
  await getProfileOrThrow({ prisma, profileId });

  return getProfileSectionOrThrow({
    prisma,
    model: "skill",
    profileId,
    sectionId: skillId,
    code: "skill_not_found",
  });
}

module.exports = { getSkill };
