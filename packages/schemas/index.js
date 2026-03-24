const { z } = require("zod");

const createProfileInputSchema = z.object({
  fullName: z.string().trim().min(2, "fullName doit comporter au moins 2 caractères"),
  title: z.string().trim().min(1).optional().nullable(),
});

const createExperienceInputSchema = z.object({
  company: z.string().trim().min(1, "company est requis"),
  role: z.string().trim().min(1, "role est requis"),
  summary: z.string().trim().min(1).optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  isCurrent: z.boolean().optional(),
});

const createEducationInputSchema = z.object({
  school: z.string().trim().min(1, "school est requis"),
  degree: z.string().trim().min(1, "degree est requis"),
  fieldOfStudy: z.string().trim().min(1).optional().nullable(),
  description: z.string().trim().min(1).optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
});

const createSkillInputSchema = z.object({
  name: z.string().trim().min(1, "name est requis"),
  category: z.string().trim().min(1).optional().nullable(),
  level: z.string().trim().min(1).optional().nullable(),
});

function buildUpdateSchema(schema) {
  return schema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "Au moins un champ doit être fourni",
  });
}

const updateProfileInputSchema = buildUpdateSchema(createProfileInputSchema);
const updateExperienceInputSchema = buildUpdateSchema(createExperienceInputSchema);
const updateEducationInputSchema = buildUpdateSchema(createEducationInputSchema);
const updateSkillInputSchema = buildUpdateSchema(createSkillInputSchema);

module.exports = {
  createProfileInputSchema,
  updateProfileInputSchema,
  createExperienceInputSchema,
  updateExperienceInputSchema,
  createEducationInputSchema,
  updateEducationInputSchema,
  createSkillInputSchema,
  updateSkillInputSchema,
};
