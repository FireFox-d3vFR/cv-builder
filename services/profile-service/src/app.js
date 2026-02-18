const express = require("express");
const cors = require("cors");
const { healthRouter } = require("./routes/healthRoutes");
const { buildProfileRouter } = require("./routes/profileRoutes");

// Construit l'application HTTP (sans la lancer)
function buildApp({ prisma }) {
    const app = express();

    // Middleware globaux.
    app.use(cors());
    app.use(express.json());

    // Montage des routeurs.
    app.use(healthRouter);
    app.use(buildProfileRouter({ prisma }));

    return app;
}

module.exports = { buildApp };
