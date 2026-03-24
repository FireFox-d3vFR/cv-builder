const express = require("express");
const { createProfile } = require("../use-cases/createProfile");
const { listProfiles } = require("../use-cases/listProfiles");
const { createExperience } = require("../use-cases/createExperience");
const { listExperiences } = require("../use-cases/listExperiences");
const { createEducation } = require("../use-cases/createEducation");
const { listEducations } = require("../use-cases/listEducations");
const { createSkill } = require("../use-cases/createSkill");
const { listSkills } = require("../use-cases/listSkills");

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

  profileRouter.post("/profiles/:profileId/experiences", async (req, res) => {
    const experience = await createExperience({
      prisma,
      profileId: req.params.profileId,
      input: req.body ?? {},
    });

    return res.status(201).json(experience);
  });

  profileRouter.get("/profiles/:profileId/experiences", async (req, res) => {
    const experiences = await listExperiences({
      prisma,
      profileId: req.params.profileId,
    });

    return res.json(experiences);
  });

  profileRouter.post("/profiles/:profileId/educations", async (req, res) => {
    const education = await createEducation({
      prisma,
      profileId: req.params.profileId,
      input: req.body ?? {},
    });

    return res.status(201).json(education);
  });

  profileRouter.get("/profiles/:profileId/educations", async (req, res) => {
    const educations = await listEducations({
      prisma,
      profileId: req.params.profileId,
    });

    return res.json(educations);
  });

  profileRouter.post("/profiles/:profileId/skills", async (req, res) => {
    const skill = await createSkill({
      prisma,
      profileId: req.params.profileId,
      input: req.body ?? {},
    });

    return res.status(201).json(skill);
  });

  profileRouter.get("/profiles/:profileId/skills", async (req, res) => {
    const skills = await listSkills({
      prisma,
      profileId: req.params.profileId,
    });

    return res.json(skills);
  });

  return profileRouter;
}

module.exports = { buildProfileRouter };
