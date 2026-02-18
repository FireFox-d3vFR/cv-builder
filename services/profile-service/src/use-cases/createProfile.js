// Utilise Zod pour valider proprement les entrées métier.
const { z } = require("zod");

// Schéma de validation pour la création d'un profil.
const createProfileInputSchema = z.object({
    fullName: z.string().trim().min(2, "fullName doit comporter au moins 2 caractères"),
    title: z.string().trim().min(1).optional().nullable(),
});

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