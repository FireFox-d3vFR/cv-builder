"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import schemas from "@cv-builder/schemas";

const {
  createExperienceInputSchema,
  updateExperienceInputSchema,
  createEducationInputSchema,
  updateEducationInputSchema,
  createSkillInputSchema,
  updateSkillInputSchema,
} = schemas;

const initialExperience = { company: "", role: "", summary: "", startDate: "", endDate: "", isCurrent: false };
const initialEducation = { school: "", degree: "", fieldOfStudy: "", description: "", startDate: "", endDate: "" };
const initialSkill = { name: "", category: "", level: "" };

function toNullableString(value) {
  return value?.trim() ? value : null;
}

function toNullableDate(value) {
  return value?.trim() ? value : null;
}

function dateInputValue(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

function formatExperiencePayload(data) {
  return {
    company: data.company,
    role: data.role,
    summary: toNullableString(data.summary || ""),
    startDate: toNullableDate(data.startDate || ""),
    endDate: toNullableDate(data.endDate || ""),
    isCurrent: Boolean(data.isCurrent),
  };
}

function formatEducationPayload(data) {
  return {
    school: data.school,
    degree: data.degree,
    fieldOfStudy: toNullableString(data.fieldOfStudy || ""),
    description: toNullableString(data.description || ""),
    startDate: toNullableDate(data.startDate || ""),
    endDate: toNullableDate(data.endDate || ""),
  };
}

function formatSkillPayload(data) {
  return {
    name: data.name,
    category: toNullableString(data.category || ""),
    level: toNullableString(data.level || ""),
  };
}

function inlineExperienceForm(item) {
  return {
    company: item.company || "",
    role: item.role || "",
    summary: item.summary || "",
    startDate: dateInputValue(item.startDate),
    endDate: dateInputValue(item.endDate),
    isCurrent: Boolean(item.isCurrent),
  };
}

function inlineEducationForm(item) {
  return {
    school: item.school || "",
    degree: item.degree || "",
    fieldOfStudy: item.fieldOfStudy || "",
    description: item.description || "",
    startDate: dateInputValue(item.startDate),
    endDate: dateInputValue(item.endDate),
  };
}

function inlineSkillForm(item) {
  return {
    name: item.name || "",
    category: item.category || "",
    level: item.level || "",
  };
}

export function ProfileSectionsForm({ profile }) {
  const router = useRouter();
  const [experienceData, setExperienceData] = useState(initialExperience);
  const [educationData, setEducationData] = useState(initialEducation);
  const [skillData, setSkillData] = useState(initialSkill);
  const [editingSection, setEditingSection] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(fieldName) {
    setFieldErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  }

  function handleCreateChange(setter) {
    return (event) => {
      const { name, value, type, checked } = event.target;
      setter((currentValue) => ({
        ...currentValue,
        [name]: type === "checkbox" ? checked : value,
      }));
      clearFieldError(name);
    };
  }

  function handleEditChange(event) {
    const { name, value, type, checked } = event.target;
    setEditingData((currentValue) => ({
      ...currentValue,
      [name]: type === "checkbox" ? checked : value,
    }));
    clearFieldError(name);
  }

  async function submitRequest({ endpoint, method, payload, schema, successMessage, onSuccess }) {
    setServerMessage("");
    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      let responseBody = null;
      if (response.status !== 204) {
        responseBody = await response.json();
      }

      if (!response.ok) {
        setServerMessage(responseBody?.error || "Une erreur est survenue.");
        return;
      }

      onSuccess?.();
      setServerMessage(successMessage);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Section request failed:", error);
      setServerMessage("Impossible de contacter l'application.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteSection(endpoint, successMessage) {
    setServerMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(endpoint, { method: "DELETE" });

      if (!response.ok) {
        const responseBody = await response.json();
        setServerMessage(responseBody?.error || "Suppression impossible.");
        return;
      }

      if (editingSection?.endpoint === endpoint) {
        setEditingSection(null);
        setEditingData({});
      }

      setServerMessage(successMessage);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Section deletion failed:", error);
      setServerMessage("Impossible de contacter l'application.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(type, item) {
    const builders = {
      experience: inlineExperienceForm,
      education: inlineEducationForm,
      skill: inlineSkillForm,
    };

    setFieldErrors({});
    setServerMessage("");
    setEditingSection({ type, id: item.id });
    setEditingData(builders[type](item));
  }

  function cancelEditing() {
    setEditingSection(null);
    setEditingData({});
    setFieldErrors({});
  }

  const handleExperienceCreate = async (event) => {
    event.preventDefault();
    await submitRequest({
      endpoint: `/api/profiles/${profile.id}/experiences`,
      method: "POST",
      payload: formatExperiencePayload(experienceData),
      schema: createExperienceInputSchema,
      successMessage: "Experience ajoutee.",
      onSuccess: () => setExperienceData(initialExperience),
    });
  };

  const handleEducationCreate = async (event) => {
    event.preventDefault();
    await submitRequest({
      endpoint: `/api/profiles/${profile.id}/educations`,
      method: "POST",
      payload: formatEducationPayload(educationData),
      schema: createEducationInputSchema,
      successMessage: "Formation ajoutee.",
      onSuccess: () => setEducationData(initialEducation),
    });
  };

  const handleSkillCreate = async (event) => {
    event.preventDefault();
    await submitRequest({
      endpoint: `/api/profiles/${profile.id}/skills`,
      method: "POST",
      payload: formatSkillPayload(skillData),
      schema: createSkillInputSchema,
      successMessage: "Competence ajoutee.",
      onSuccess: () => setSkillData(initialSkill),
    });
  };

  function renderEditableSection({ type, item, title, subtitle, fields, updateSchema, endpoint, deleteLabel }) {
    const isEditing = editingSection?.type === type && editingSection?.id === item.id;

    if (!isEditing) {
      return (
        <div key={item.id} style={styles.sectionItem}>
          <div>
            <strong>{title}</strong>
            <div style={styles.sectionMeta}>{subtitle}</div>
          </div>
          <div style={styles.actions}>
            <button type="button" onClick={() => startEditing(type, item)} style={styles.secondaryButton}>
              Modifier
            </button>
            <button
              type="button"
              onClick={() => deleteSection(endpoint, `${deleteLabel} supprime(e).`)}
              style={styles.deleteButton}
              disabled={isSubmitting}
            >
              Supprimer
            </button>
          </div>
        </div>
      );
    }

    return (
      <form
        key={item.id}
        style={styles.editCard}
        onSubmit={async (event) => {
          event.preventDefault();
          await submitRequest({
            endpoint,
            method: "PATCH",
            payload: fields.buildPayload(editingData),
            schema: updateSchema,
            successMessage: `${deleteLabel} mis(e) a jour.`,
            onSuccess: cancelEditing,
          });
        }}
      >
        {fields.render(editingData, handleEditChange, fieldErrors)}
        <div style={styles.actions}>
          <button type="submit" style={styles.secondaryButton} disabled={isSubmitting}>
            Enregistrer
          </button>
          <button type="button" onClick={cancelEditing} style={styles.ghostButton}>
            Annuler
          </button>
        </div>
      </form>
    );
  }

  return (
    <section style={styles.wrapper}>
      <div style={styles.header}>
        <p style={styles.eyebrow}>Sections CV</p>
        <p style={styles.description}>
          Creation, edition et suppression utilisent les schemas partages de <code>@cv-builder/schemas</code>.
        </p>
      </div>

      {serverMessage ? <p style={styles.feedback}>{serverMessage}</p> : null}

      <div style={styles.grid}>
        <form onSubmit={handleExperienceCreate} style={styles.formCard}>
          <h4 style={styles.cardTitle}>Experience</h4>
          <input name="company" value={experienceData.company} onChange={handleCreateChange(setExperienceData)} placeholder="Entreprise" style={styles.input} />
          {fieldErrors.company ? <span style={styles.error}>{fieldErrors.company[0]}</span> : null}
          <input name="role" value={experienceData.role} onChange={handleCreateChange(setExperienceData)} placeholder="Poste" style={styles.input} />
          {fieldErrors.role ? <span style={styles.error}>{fieldErrors.role[0]}</span> : null}
          <textarea name="summary" value={experienceData.summary} onChange={handleCreateChange(setExperienceData)} placeholder="Resume" style={styles.textarea} />
          <div style={styles.dateGrid}>
            <input name="startDate" type="date" value={experienceData.startDate} onChange={handleCreateChange(setExperienceData)} style={styles.input} />
            <input name="endDate" type="date" value={experienceData.endDate} onChange={handleCreateChange(setExperienceData)} style={styles.input} />
          </div>
          <label style={styles.checkboxRow}>
            <input name="isCurrent" type="checkbox" checked={experienceData.isCurrent} onChange={handleCreateChange(setExperienceData)} />
            <span>Poste en cours</span>
          </label>
          <button type="submit" disabled={isSubmitting} style={styles.button}>Ajouter</button>
        </form>

        <form onSubmit={handleEducationCreate} style={styles.formCard}>
          <h4 style={styles.cardTitle}>Formation</h4>
          <input name="school" value={educationData.school} onChange={handleCreateChange(setEducationData)} placeholder="Ecole" style={styles.input} />
          {fieldErrors.school ? <span style={styles.error}>{fieldErrors.school[0]}</span> : null}
          <input name="degree" value={educationData.degree} onChange={handleCreateChange(setEducationData)} placeholder="Diplome" style={styles.input} />
          {fieldErrors.degree ? <span style={styles.error}>{fieldErrors.degree[0]}</span> : null}
          <input name="fieldOfStudy" value={educationData.fieldOfStudy} onChange={handleCreateChange(setEducationData)} placeholder="Domaine" style={styles.input} />
          <textarea name="description" value={educationData.description} onChange={handleCreateChange(setEducationData)} placeholder="Description" style={styles.textarea} />
          <div style={styles.dateGrid}>
            <input name="startDate" type="date" value={educationData.startDate} onChange={handleCreateChange(setEducationData)} style={styles.input} />
            <input name="endDate" type="date" value={educationData.endDate} onChange={handleCreateChange(setEducationData)} style={styles.input} />
          </div>
          <button type="submit" disabled={isSubmitting} style={styles.button}>Ajouter</button>
        </form>

        <form onSubmit={handleSkillCreate} style={styles.formCard}>
          <h4 style={styles.cardTitle}>Competence</h4>
          <input name="name" value={skillData.name} onChange={handleCreateChange(setSkillData)} placeholder="Nom" style={styles.input} />
          {fieldErrors.name ? <span style={styles.error}>{fieldErrors.name[0]}</span> : null}
          <input name="category" value={skillData.category} onChange={handleCreateChange(setSkillData)} placeholder="Categorie" style={styles.input} />
          <input name="level" value={skillData.level} onChange={handleCreateChange(setSkillData)} placeholder="Niveau" style={styles.input} />
          <button type="submit" disabled={isSubmitting} style={styles.button}>Ajouter</button>
        </form>
      </div>

      <div style={styles.sectionColumns}>
        <section style={styles.sectionBox}>
          <h4 style={styles.sectionTitle}>Experiences</h4>
          {profile.experiences.length === 0 ? <p style={styles.sectionEmpty}>Aucune experience.</p> : profile.experiences.map((experience) =>
            renderEditableSection({
              type: "experience",
              item: experience,
              title: experience.role,
              subtitle: experience.company,
              updateSchema: updateExperienceInputSchema,
              endpoint: `/api/profiles/${profile.id}/experiences/${experience.id}`,
              deleteLabel: "Experience",
              fields: {
                buildPayload: formatExperiencePayload,
                render: (data, onChange, errors) => (
                  <>
                    <input name="company" value={data.company} onChange={onChange} placeholder="Entreprise" style={styles.input} />
                    {errors.company ? <span style={styles.error}>{errors.company[0]}</span> : null}
                    <input name="role" value={data.role} onChange={onChange} placeholder="Poste" style={styles.input} />
                    {errors.role ? <span style={styles.error}>{errors.role[0]}</span> : null}
                    <textarea name="summary" value={data.summary} onChange={onChange} placeholder="Resume" style={styles.textarea} />
                    <div style={styles.dateGrid}>
                      <input name="startDate" type="date" value={data.startDate} onChange={onChange} style={styles.input} />
                      <input name="endDate" type="date" value={data.endDate} onChange={onChange} style={styles.input} />
                    </div>
                    <label style={styles.checkboxRow}>
                      <input name="isCurrent" type="checkbox" checked={data.isCurrent} onChange={onChange} />
                      <span>Poste en cours</span>
                    </label>
                  </>
                ),
              },
            })
          )}
        </section>

        <section style={styles.sectionBox}>
          <h4 style={styles.sectionTitle}>Formations</h4>
          {profile.educations.length === 0 ? <p style={styles.sectionEmpty}>Aucune formation.</p> : profile.educations.map((education) =>
            renderEditableSection({
              type: "education",
              item: education,
              title: education.degree,
              subtitle: education.school,
              updateSchema: updateEducationInputSchema,
              endpoint: `/api/profiles/${profile.id}/educations/${education.id}`,
              deleteLabel: "Formation",
              fields: {
                buildPayload: formatEducationPayload,
                render: (data, onChange, errors) => (
                  <>
                    <input name="school" value={data.school} onChange={onChange} placeholder="Ecole" style={styles.input} />
                    {errors.school ? <span style={styles.error}>{errors.school[0]}</span> : null}
                    <input name="degree" value={data.degree} onChange={onChange} placeholder="Diplome" style={styles.input} />
                    {errors.degree ? <span style={styles.error}>{errors.degree[0]}</span> : null}
                    <input name="fieldOfStudy" value={data.fieldOfStudy} onChange={onChange} placeholder="Domaine" style={styles.input} />
                    <textarea name="description" value={data.description} onChange={onChange} placeholder="Description" style={styles.textarea} />
                    <div style={styles.dateGrid}>
                      <input name="startDate" type="date" value={data.startDate} onChange={onChange} style={styles.input} />
                      <input name="endDate" type="date" value={data.endDate} onChange={onChange} style={styles.input} />
                    </div>
                  </>
                ),
              },
            })
          )}
        </section>

        <section style={styles.sectionBox}>
          <h4 style={styles.sectionTitle}>Competences</h4>
          {profile.skills.length === 0 ? <p style={styles.sectionEmpty}>Aucune competence.</p> : profile.skills.map((skill) =>
            renderEditableSection({
              type: "skill",
              item: skill,
              title: skill.name,
              subtitle: skill.level || skill.category || "Niveau non renseigne",
              updateSchema: updateSkillInputSchema,
              endpoint: `/api/profiles/${profile.id}/skills/${skill.id}`,
              deleteLabel: "Competence",
              fields: {
                buildPayload: formatSkillPayload,
                render: (data, onChange, errors) => (
                  <>
                    <input name="name" value={data.name} onChange={onChange} placeholder="Nom" style={styles.input} />
                    {errors.name ? <span style={styles.error}>{errors.name[0]}</span> : null}
                    <input name="category" value={data.category} onChange={onChange} placeholder="Categorie" style={styles.input} />
                    <input name="level" value={data.level} onChange={onChange} placeholder="Niveau" style={styles.input} />
                  </>
                ),
              },
            })
          )}
        </section>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    marginTop: 18,
    paddingTop: 18,
    borderTop: "1px solid #ecdcc2",
  },
  header: {
    marginBottom: 14,
  },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#8b6f47",
  },
  description: {
    margin: "6px 0 0",
    color: "#6f5b43",
    lineHeight: 1.45,
    fontSize: 14,
  },
  feedback: {
    margin: "0 0 14px",
    padding: "10px 12px",
    borderRadius: 12,
    background: "#fff4e8",
    color: "#8a4b15",
  },
  grid: {
    display: "grid",
    gap: 12,
    marginBottom: 18,
  },
  formCard: {
    display: "grid",
    gap: 8,
    padding: 14,
    borderRadius: 18,
    background: "#fff7eb",
    border: "1px solid #ecdcc2",
  },
  cardTitle: {
    margin: 0,
    fontSize: 18,
    color: "#2f2417",
  },
  input: {
    border: "1px solid #ccb998",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    background: "#fff",
  },
  textarea: {
    minHeight: 72,
    border: "1px solid #ccb998",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    background: "#fff",
    resize: "vertical",
  },
  dateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
  },
  checkboxRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    color: "#5f4c36",
    fontSize: 14,
  },
  button: {
    border: 0,
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 700,
    color: "#fffaf1",
    background: "linear-gradient(135deg, #7f3914 0%, #b85b20 100%)",
    cursor: "pointer",
  },
  sectionColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  sectionBox: {
    padding: 14,
    borderRadius: 16,
    background: "#fffdf7",
    border: "1px solid #ecdcc2",
    display: "grid",
    gap: 10,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 16,
  },
  sectionItem: {
    display: "grid",
    gap: 8,
    paddingTop: 10,
    borderTop: "1px solid #f0e3cf",
  },
  sectionMeta: {
    color: "#6f5b43",
    marginTop: 4,
    fontSize: 14,
  },
  sectionEmpty: {
    margin: 0,
    color: "#8b6f47",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  secondaryButton: {
    border: "1px solid #c98d63",
    borderRadius: 999,
    padding: "8px 12px",
    background: "#fff",
    color: "#8a4b15",
    fontWeight: 700,
    cursor: "pointer",
  },
  ghostButton: {
    border: "1px solid #d7c5aa",
    borderRadius: 999,
    padding: "8px 12px",
    background: "#fffdf7",
    color: "#6f5b43",
    cursor: "pointer",
  },
  deleteButton: {
    border: "1px solid #e0a39c",
    borderRadius: 999,
    padding: "8px 12px",
    background: "#fff5f4",
    color: "#b42318",
    fontWeight: 700,
    cursor: "pointer",
  },
  editCard: {
    display: "grid",
    gap: 8,
    paddingTop: 10,
    borderTop: "1px solid #f0e3cf",
  },
  error: {
    color: "#b42318",
    fontSize: 13,
  },
};
