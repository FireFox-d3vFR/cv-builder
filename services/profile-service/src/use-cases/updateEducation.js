const { updateEducationInputSchema } = require("@cv-builder/schemas");
const { HttpError } = require("../errors/httpError");
const { getProfileOrThrow } = require("./getProfileOrThrow");
const { getProfileSectionOrThrow } = require("./getProfileSectionOrThrow");

async function updateEducation({ prisma, profileId, educationId, input }) {
  await getProfileOrThrow({ prisma, profileId });
  const currentEducation = await getProfileSectionOrThrow({
    prisma,
    model: "education",
    profileId,
    sectionId: educationId,
    code: "education_not_found",
  });

  const parsed = updateEducationInputSchema.parse(input);
  const nextValue = {
    ...(parsed.school !== undefined ? { school: parsed.school } : {}),
    ...(parsed.degree !== undefined ? { degree: parsed.degree } : {}),
    ...(parsed.fieldOfStudy !== undefined ? { fieldOfStudy: parsed.fieldOfStudy ?? null } : {}),
    ...(parsed.description !== undefined ? { description: parsed.description ?? null } : {}),
    ...(parsed.startDate !== undefined ? { startDate: parsed.startDate ?? null } : {}),
    ...(parsed.endDate !== undefined ? { endDate: parsed.endDate ?? null } : {}),
  };
  const mergedEducation = {
    ...currentEducation,
    ...nextValue,
  };

  if (
    mergedEducation.startDate &&
    mergedEducation.endDate &&
    mergedEducation.endDate < mergedEducation.startDate
  ) {
    throw new HttpError({
      statusCode: 400,
      code: "validation_error",
      message: "endDate doit être postérieure ou égale à startDate",
      details: [{ field: "endDate", message: "endDate doit être postérieure ou égale à startDate" }],
    });
  }

  return prisma.education.update({
    where: { id: educationId },
    data: nextValue,
  });
}

module.exports = { updateEducation };
