const { getProfileOrThrow } = require("./getProfileOrThrow");
const { getProfileSectionOrThrow } = require("./getProfileSectionOrThrow");

async function deleteEducation({ prisma, profileId, educationId }) {
  await getProfileOrThrow({ prisma, profileId });
  await getProfileSectionOrThrow({
    prisma,
    model: "education",
    profileId,
    sectionId: educationId,
    code: "education_not_found",
  });

  await prisma.education.delete({
    where: { id: educationId },
  });

  return { success: true };
}

module.exports = { deleteEducation };
