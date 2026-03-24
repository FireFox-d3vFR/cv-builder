const { z } = require("zod");
const { HttpError } = require("../errors/httpError");
const { getProfileOrThrow } = require("./getProfileOrThrow");

const experienceInputSchema = z.object({
  company: z.string().trim().min(1, "company est requis"),
  role: z.string().trim().min(1, "role est requis"),
  summary: z.string().trim().min(1).optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  isCurrent: z.boolean().optional().default(false),
});

async function createExperience({ prisma, profileId, input }) {
  await getProfileOrThrow({ prisma, profileId });

  const parsed = experienceInputSchema.parse(input);

  if (parsed.isCurrent && parsed.endDate) {
    throw new HttpError({
      statusCode: 400,
      code: "validation_error",
      message: "Une expérience en cours ne peut pas avoir de endDate",
      details: [{ field: "endDate", message: "endDate doit être vide si isCurrent=true" }],
    });
  }

  if (parsed.startDate && parsed.endDate && parsed.endDate < parsed.startDate) {
    throw new HttpError({
      statusCode: 400,
      code: "validation_error",
      message: "endDate doit être postérieure ou égale à startDate",
      details: [{ field: "endDate", message: "endDate doit être postérieure ou égale à startDate" }],
    });
  }

  return prisma.experience.create({
    data: {
      profileId,
      company: parsed.company,
      role: parsed.role,
      summary: parsed.summary ?? null,
      startDate: parsed.startDate ?? null,
      endDate: parsed.endDate ?? null,
      isCurrent: parsed.isCurrent,
    },
  });
}

module.exports = { createExperience };
