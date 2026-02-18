const { prisma } = require("./db/prismaClient");
const { buildApp } = require("./app");

// Lit le port depuis l'environnement avec fallback local.
const port = Number(process.env.PORT || 4001);

// Construit l'app en injectant les dependances.
const app = buildApp({ prisma });

// Demarre le serveur HTTP et conserve la reference pour le fermer proprement.
const server = app.listen(port, () => {
  console.log(`profile-service listening on port ${port}`);
});

// Gère un arrêt gracieux: stop HTTP puis ferme Prisma.
async function shutdown(signal) {
  console.log(`received ${signal}, starting graceful shutdown`);

  // N'accepte plus de nouvelles connexions, puis ferme la DB.
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log("prisma disconnected");
      process.exit(0);
    } catch (error) {
      console.error("shutdown error:", error);
      process.exit(1);
    }
  });
}

// Intercepte Ctrl+C et arrêt Docker pour fermer proprement l'application.
process.once("SIGINT", () => {
  shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  shutdown("SIGTERM");
});
