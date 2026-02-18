const express = require("express");

// Router dédié au health-check technique du service.
const healthRouter = express.Router();

healthRouter.get("/health", (_req, res) => {
  // Réponse simple pour monitoring / smoke test.
  res.json({ service: "profile-service", status: "OK" });
});

module.exports = { healthRouter };