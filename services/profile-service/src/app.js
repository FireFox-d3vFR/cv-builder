const express = require("express");
const cors = require("cors");
const { healthRouter } = require("./routes/healthRoutes");
const { buildProfileRouter } = require("./routes/profileRoutes");
const { errorHandler } = require("./middlewares/errorHandler");

// Construit l'application HTTP (sans la lancer)
function buildApp({ prisma }) {
    const app = express();

    // Middleware globaux.
    app.use(cors());
    app.use(express.json());

    // Montage des routeurs.
    app.use(healthRouter);
    app.use(buildProfileRouter({ prisma }));
    app.use(errorHandler);

    return app;
}

module.exports = { buildApp };
