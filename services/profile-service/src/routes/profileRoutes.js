const express = require("express");
const { createProfile } = require("../use-cases/createProfile");
const { listProfiles } = require("../use-cases/listProfiles");

// Fabrique un routeur profils en injectant Prisma.
function buildProfileRouter({ prisma }) {
  const profileRouter = express.Router();

  profileRouter.post("/profiles", async (req, res) => {
    // Délègue la logique métier au use-case.
    const profile = await createProfile({ prisma, input: req.body ?? {} });
    res.status(201).json(profile);
  });

  profileRouter.get("/profiles", async (_req, res) => {
    // Retourne la liste des profils.
    const profiles = await listProfiles({ prisma });
    return res.json(profiles);
  });

  return profileRouter;
}

module.exports = { buildProfileRouter };
