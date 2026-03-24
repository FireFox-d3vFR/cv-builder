const { createSkillInputSchema } = require("@cv-builder/schemas");
const { getProfileOrThrow } = require("./getProfileOrThrow");

async function createSkill({ prisma, profileId, input }) {
  await getProfileOrThrow({ prisma, profileId });

  const parsed = createSkillInputSchema.parse(input);

  return prisma.skill.create({
    data: {
      profileId,
      name: parsed.name,
      category: parsed.category ?? null,
      level: parsed.level ?? null,
    },
  });
}

module.exports = { createSkill };
