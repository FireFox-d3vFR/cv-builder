const { createProfileInputSchema } = require("@cv-builder/schemas");

// Cas d'usage: créer un profil.
async function createProfile({ prisma, input }) {
  // Valide et normalise le payload avant d'accès DB.
  const parsed = createProfileInputSchema.parse(input);

  // Persiste le profil en base.
  return prisma.profile.create({
    data: {
      fullName: parsed.fullName,
      title: parsed.title ?? null,
    },
  });
}

module.exports = { createProfile };
