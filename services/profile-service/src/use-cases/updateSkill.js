const { updateSkillInputSchema } = require("@cv-builder/schemas");
const { getProfileOrThrow } = require("./getProfileOrThrow");
const { getProfileSectionOrThrow } = require("./getProfileSectionOrThrow");

async function updateSkill({ prisma, profileId, skillId, input }) {
  await getProfileOrThrow({ prisma, profileId });
  await getProfileSectionOrThrow({
    prisma,
    model: "skill",
    profileId,
    sectionId: skillId,
    code: "skill_not_found",
  });

  const parsed = updateSkillInputSchema.parse(input);

  return prisma.skill.update({
    where: { id: skillId },
    data: {
      ...(parsed.name !== undefined ? { name: parsed.name } : {}),
      ...(parsed.category !== undefined ? { category: parsed.category ?? null } : {}),
      ...(parsed.level !== undefined ? { level: parsed.level ?? null } : {}),
    },
  });
}

module.exports = { updateSkill };
