"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import schemas from "@cv-builder/schemas";
import { ProfileSectionsForm } from "./profile-sections-form";

const { updateProfileInputSchema } = schemas;

export function ProfileCard({ profile }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile.fullName || "",
    title: profile.title || "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));

    setFieldErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setServerError("");

    const parsed = updateProfileInputSchema.safeParse({
      fullName: formData.fullName,
      title: formData.title || null,
    });

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const payload = await response.json();

      if (!response.ok) {
        setServerError(payload.error || "Mise a jour impossible.");
        return;
      }

      setIsEditing(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      setServerError("Impossible de contacter l'application.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setServerError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json();
        setServerError(payload.error || "Suppression impossible.");
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Profile deletion failed:", error);
      setServerError("Impossible de contacter l'application.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function cancelEdit() {
    setIsEditing(false);
    setServerError("");
    setFieldErrors({});
    setFormData({
      fullName: profile.fullName || "",
      title: profile.title || "",
    });
  }

  return (
    <article style={styles.profileItem}>
      <div style={styles.profileHeader}>
        <div>
          {isEditing ? (
            <form onSubmit={handleUpdate} style={styles.editForm}>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nom complet"
                style={styles.input}
              />
              {fieldErrors.fullName ? <span style={styles.error}>{fieldErrors.fullName[0]}</span> : null}
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Titre"
                style={styles.input}
              />
              {fieldErrors.title ? <span style={styles.error}>{fieldErrors.title[0]}</span> : null}
              <div style={styles.actions}>
                <button type="submit" style={styles.secondaryButton} disabled={isSubmitting}>
                  Enregistrer
                </button>
                <button type="button" onClick={cancelEdit} style={styles.ghostButton}>
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 style={styles.profileName}>{profile.fullName}</h3>
              <p style={styles.profileTitle}>{profile.title || "Titre non renseigne"}</p>
              <div style={styles.sectionSummary}>
                <span>{profile.experiences.length} experiences</span>
                <span>{profile.educations.length} formations</span>
                <span>{profile.skills.length} competences</span>
              </div>
            </>
          )}
        </div>

        <div style={styles.metaColumn}>
          <span style={styles.profileMeta}>
            {new Date(profile.createdAt).toLocaleDateString("fr-FR")}
          </span>
          {!isEditing ? (
            <div style={styles.actions}>
              <button type="button" onClick={() => setIsEditing(true)} style={styles.secondaryButton}>
                Modifier le profil
              </button>
              <button type="button" onClick={handleDelete} style={styles.deleteButton} disabled={isSubmitting}>
                Supprimer le profil
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {serverError ? <p style={styles.errorPanel}>{serverError}</p> : null}

      <div style={styles.profileSections}>
        <ProfileSectionsForm profile={profile} />
      </div>
    </article>
  );
}

const styles = {
  profileItem: {
    display: "grid",
    gap: 16,
    padding: "16px 18px",
    borderRadius: 18,
    background: "#fff7eb",
    border: "1px solid #ecdcc2",
  },
  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "start",
  },
  profileName: {
    margin: 0,
    fontSize: 20,
  },
  profileTitle: {
    margin: "6px 0 0",
    color: "#6f5b43",
  },
  sectionSummary: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
    color: "#8b6f47",
    fontSize: 13,
  },
  profileMeta: {
    whiteSpace: "nowrap",
    color: "#8b6f47",
    fontSize: 14,
  },
  metaColumn: {
    display: "grid",
    gap: 10,
    justifyItems: "end",
  },
  profileSections: {
    display: "grid",
    gap: 18,
  },
  editForm: {
    display: "grid",
    gap: 8,
    minWidth: 280,
  },
  input: {
    border: "1px solid #ccb998",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    background: "#fff",
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
  error: {
    color: "#b42318",
    fontSize: 13,
  },
  errorPanel: {
    margin: 0,
    padding: "12px 14px",
    borderRadius: 14,
    background: "#fff1ef",
    color: "#b42318",
  },
};
