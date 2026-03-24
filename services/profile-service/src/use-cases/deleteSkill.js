const { getProfileOrThrow } = require("./getProfileOrThrow");
const { getProfileSectionOrThrow } = require("./getProfileSectionOrThrow");

async function deleteSkill({ prisma, profileId, skillId }) {
  await getProfileOrThrow({ prisma, profileId });
  await getProfileSectionOrThrow({
    prisma,
    model: "skill",
    profileId,
    sectionId: skillId,
    code: "skill_not_found",
  });

  await prisma.skill.delete({
    where: { id: skillId },
  });

  return { success: true };
}

module.exports = { deleteSkill };
