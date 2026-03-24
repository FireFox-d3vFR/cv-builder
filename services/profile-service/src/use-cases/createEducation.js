const { createEducationInputSchema } = require("@cv-builder/schemas");
const { HttpError } = require("../errors/httpError");
const { getProfileOrThrow } = require("./getProfileOrThrow");

async function createEducation({ prisma, profileId, input }) {
  await getProfileOrThrow({ prisma, profileId });

  const parsed = createEducationInputSchema.parse(input);

  if (parsed.startDate && parsed.endDate && parsed.endDate < parsed.startDate) {
    throw new HttpError({
      statusCode: 400,
      code: "validation_error",
      message: "endDate doit être postérieure ou égale à startDate",
      details: [{ field: "endDate", message: "endDate doit être postérieure ou égale à startDate" }],
    });
  }

  return prisma.education.create({
    data: {
      profileId,
      school: parsed.school,
      degree: parsed.degree,
      fieldOfStudy: parsed.fieldOfStudy ?? null,
      description: parsed.description ?? null,
      startDate: parsed.startDate ?? null,
      endDate: parsed.endDate ?? null,
    },
  });
}

module.exports = { createEducation };
