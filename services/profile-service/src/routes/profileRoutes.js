const express = require("express");
const { ZodError } = require("zod");
const { createProfile } = require("../use-cases/createProfile");
const { listProfiles } = require("../use-cases/listProfiles");

// Fabrique un routeur profils en injectant Prisma.
function buildProfileRouter({ prisma }) {
  const profileRouter = express.Router();

  profileRouter.post("/profiles", async (req, res) => {
    try {
      // Délègue la logique métier au use-case.
      const profile = await createProfile({ prisma, input: req.body ?? {} });
      res.status(201).json(profile);
    } catch (error) {
      // Gestion explicite des erreurs de validation.
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "validation_error",
          details: error.issues,
        });
      }

      // Gestion des erreurs serveurs inattendues.
      return res.status(500).json({
        error: "internal_error",
        details: String(error),
      });
    }
  });

  profileRouter.get("/profiles", async (_req, res) => {
    try {
      // Retourne la liste des profils.
      const profiles = await listProfiles({ prisma });
      return res.json(profiles);
    } catch (error) {
      return res.status(500).json({
        error: "internal_error",
        details: String(error),
      });
    }
  });

  return profileRouter;
}

module.exports = { buildProfileRouter };
