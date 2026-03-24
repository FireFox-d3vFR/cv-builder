const { getProfileOrThrow } = require("./getProfileOrThrow");
const { getProfileSectionOrThrow } = require("./getProfileSectionOrThrow");

async function deleteExperience({ prisma, profileId, experienceId }) {
  await getProfileOrThrow({ prisma, profileId });
  await getProfileSectionOrThrow({
    prisma,
    model: "experience",
    profileId,
    sectionId: experienceId,
    code: "experience_not_found",
  });

  await prisma.experience.delete({
    where: { id: experienceId },
  });

  return { success: true };
}

module.exports = { deleteExperience };
