// Centralise l'instance Prisma pour eviter de la recreer dans chaque fichier.
const { PrismaClient } = require("@prisma/client");

// Cree une unique connexion client a la base.
const prisma = new PrismaClient();

// Exporte l'instance partagee.
module.exports = { prisma };
