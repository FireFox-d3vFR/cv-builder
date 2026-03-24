const { updateExperienceInputSchema } = require("@cv-builder/schemas");
const { HttpError } = require("../errors/httpError");
const { getProfileOrThrow } = require("./getProfileOrThrow");
const { getProfileSectionOrThrow } = require("./getProfileSectionOrThrow");

async function updateExperience({ prisma, profileId, experienceId, input }) {
  await getProfileOrThrow({ prisma, profileId });
  const currentExperience = await getProfileSectionOrThrow({
    prisma,
    model: "experience",
    profileId,
    sectionId: experienceId,
    code: "experience_not_found",
  });

  const parsed = updateExperienceInputSchema.parse(input);
  const nextValue = {
    ...(parsed.company !== undefined ? { company: parsed.company } : {}),
    ...(parsed.role !== undefined ? { role: parsed.role } : {}),
    ...(parsed.summary !== undefined ? { summary: parsed.summary ?? null } : {}),
    ...(parsed.startDate !== undefined ? { startDate: parsed.startDate ?? null } : {}),
    ...(parsed.endDate !== undefined ? { endDate: parsed.endDate ?? null } : {}),
    ...(parsed.isCurrent !== undefined ? { isCurrent: parsed.isCurrent } : {}),
  };
  const mergedExperience = {
    ...currentExperience,
    ...nextValue,
  };

  if (mergedExperience.isCurrent === true && mergedExperience.endDate) {
    throw new HttpError({
      statusCode: 400,
      code: "validation_error",
      message: "Une expérience en cours ne peut pas avoir de endDate",
      details: [{ field: "endDate", message: "endDate doit être vide si isCurrent=true" }],
    });
  }

  if (
    mergedExperience.startDate &&
    mergedExperience.endDate &&
    mergedExperience.endDate < mergedExperience.startDate
  ) {
    throw new HttpError({
      statusCode: 400,
      code: "validation_error",
      message: "endDate doit être postérieure ou égale à startDate",
      details: [{ field: "endDate", message: "endDate doit être postérieure ou égale à startDate" }],
    });
  }

  return prisma.experience.update({
    where: { id: experienceId },
    data: nextValue,
  });
}

module.exports = { updateExperience };
