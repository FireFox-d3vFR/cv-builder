// Cas d'usage: lister les profils par ordre de création décroissant.
async function listProfiles({ prisma }) {
    return prisma.profile.findMany({
        orderBy: { createdAt: "desc" },
    });
}

module.exports = { listProfiles };