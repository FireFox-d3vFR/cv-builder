const { createExperienceInputSchema } = require("@cv-builder/schemas");
const { HttpError } = require("../errors/httpError");
const { getProfileOrThrow } = require("./getProfileOrThrow");

async function createExperience({ prisma, profileId, input }) {
  await getProfileOrThrow({ prisma, profileId });

  const parsed = createExperienceInputSchema.parse(input);

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
      isCurrent: parsed.isCurrent ?? false,
    },
  });
}

module.exports = { createExperience };
