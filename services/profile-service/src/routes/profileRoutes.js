const express = require("express");
const { createProfile } = require("../use-cases/createProfile");
const { listProfiles } = require("../use-cases/listProfiles");
const { getProfile } = require("../use-cases/getProfile");
const { updateProfile } = require("../use-cases/updateProfile");
const { deleteProfile } = require("../use-cases/deleteProfile");
const { createExperience } = require("../use-cases/createExperience");
const { listExperiences } = require("../use-cases/listExperiences");
const { getExperience } = require("../use-cases/getExperience");
const { updateExperience } = require("../use-cases/updateExperience");
const { deleteExperience } = require("../use-cases/deleteExperience");
const { createEducation } = require("../use-cases/createEducation");
const { listEducations } = require("../use-cases/listEducations");
const { getEducation } = require("../use-cases/getEducation");
const { updateEducation } = require("../use-cases/updateEducation");
const { deleteEducation } = require("../use-cases/deleteEducation");
const { createSkill } = require("../use-cases/createSkill");
const { listSkills } = require("../use-cases/listSkills");
const { getSkill } = require("../use-cases/getSkill");
const { updateSkill } = require("../use-cases/updateSkill");
const { deleteSkill } = require("../use-cases/deleteSkill");

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

  profileRouter.get("/profiles/:profileId", async (req, res) => {
    const profile = await getProfile({
      prisma,
      profileId: req.params.profileId,
    });

    return res.json(profile);
  });

  profileRouter.patch("/profiles/:profileId", async (req, res) => {
    const profile = await updateProfile({
      prisma,
      profileId: req.params.profileId,
      input: req.body ?? {},
    });

    return res.json(profile);
  });

  profileRouter.delete("/profiles/:profileId", async (req, res) => {
    await deleteProfile({
      prisma,
      profileId: req.params.profileId,
    });

    return res.status(204).send();
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

  profileRouter.get("/profiles/:profileId/experiences/:experienceId", async (req, res) => {
    const experience = await getExperience({
      prisma,
      profileId: req.params.profileId,
      experienceId: req.params.experienceId,
    });

    return res.json(experience);
  });

  profileRouter.patch("/profiles/:profileId/experiences/:experienceId", async (req, res) => {
    const experience = await updateExperience({
      prisma,
      profileId: req.params.profileId,
      experienceId: req.params.experienceId,
      input: req.body ?? {},
    });

    return res.json(experience);
  });

  profileRouter.delete("/profiles/:profileId/experiences/:experienceId", async (req, res) => {
    await deleteExperience({
      prisma,
      profileId: req.params.profileId,
      experienceId: req.params.experienceId,
    });

    return res.status(204).send();
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

  profileRouter.get("/profiles/:profileId/educations/:educationId", async (req, res) => {
    const education = await getEducation({
      prisma,
      profileId: req.params.profileId,
      educationId: req.params.educationId,
    });

    return res.json(education);
  });

  profileRouter.patch("/profiles/:profileId/educations/:educationId", async (req, res) => {
    const education = await updateEducation({
      prisma,
      profileId: req.params.profileId,
      educationId: req.params.educationId,
      input: req.body ?? {},
    });

    return res.json(education);
  });

  profileRouter.delete("/profiles/:profileId/educations/:educationId", async (req, res) => {
    await deleteEducation({
      prisma,
      profileId: req.params.profileId,
      educationId: req.params.educationId,
    });

    return res.status(204).send();
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

  profileRouter.get("/profiles/:profileId/skills/:skillId", async (req, res) => {
    const skill = await getSkill({
      prisma,
      profileId: req.params.profileId,
      skillId: req.params.skillId,
    });

    return res.json(skill);
  });

  profileRouter.patch("/profiles/:profileId/skills/:skillId", async (req, res) => {
    const skill = await updateSkill({
      prisma,
      profileId: req.params.profileId,
      skillId: req.params.skillId,
      input: req.body ?? {},
    });

    return res.json(skill);
  });

  profileRouter.delete("/profiles/:profileId/skills/:skillId", async (req, res) => {
    await deleteSkill({
      prisma,
      profileId: req.params.profileId,
      skillId: req.params.skillId,
    });

    return res.status(204).send();
  });

  return profileRouter;
}

module.exports = { buildProfileRouter };
