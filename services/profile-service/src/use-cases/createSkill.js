const { z } = require("zod");
const { getProfileOrThrow } = require("./getProfileOrThrow");

const skillInputSchema = z.object({
  name: z.string().trim().min(1, "name est requis"),
  category: z.string().trim().min(1).optional().nullable(),
  level: z.string().trim().min(1).optional().nullable(),
});

async function createSkill({ prisma, profileId, input }) {
  await getProfileOrThrow({ prisma, profileId });

  const parsed = skillInputSchema.parse(input);

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
