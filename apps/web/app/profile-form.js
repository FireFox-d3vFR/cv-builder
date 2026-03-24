"use client";

import { useRouter } from "next/navigation";
import { useState, startTransition } from "react";
import schemas from "@cv-builder/schemas";

const { createProfileInputSchema } = schemas;

const initialFormState = {
  fullName: "",
  title: "",
};

export function ProfileForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormState);
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

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError("");

    const parsed = createProfileInputSchema.safeParse({
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
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const payload = await response.json();

      if (!response.ok) {
        setServerError(payload.error || "Une erreur est survenue pendant la creation du profil.");
        return;
      }

      setFormData(initialFormState);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Profile creation failed:", error);
      setServerError("Impossible de contacter l'application.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <p style={styles.eyebrow}>Sprint 2</p>
        <h2 style={styles.cardTitle}>Creer un profil</h2>
        <p style={styles.cardDescription}>
          La validation de ce formulaire reutilise le schema partage dans <code>@cv-builder/schemas</code>.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          <span>Nom complet</span>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Jean Dupont"
            style={styles.input}
          />
          {fieldErrors.fullName ? <span style={styles.errorText}>{fieldErrors.fullName[0]}</span> : null}
        </label>

        <label style={styles.label}>
          <span>Titre</span>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Dev Fullstack"
            style={styles.input}
          />
          {fieldErrors.title ? <span style={styles.errorText}>{fieldErrors.title[0]}</span> : null}
        </label>

        {serverError ? <p style={styles.errorPanel}>{serverError}</p> : null}

        <button type="submit" disabled={isSubmitting} style={styles.button}>
          {isSubmitting ? "Creation..." : "Ajouter le profil"}
        </button>
      </form>
    </section>
  );
}

const styles = {
  card: {
    background: "#fffdf7",
    border: "1px solid #dccfb8",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 14px 40px rgba(60, 41, 16, 0.08)",
  },
  cardHeader: {
    marginBottom: 20,
  },
  eyebrow: {
    margin: 0,
    fontSize: 12,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#8b6f47",
  },
  cardTitle: {
    margin: "8px 0 8px",
    fontSize: 28,
    color: "#2f2417",
  },
  cardDescription: {
    margin: 0,
    color: "#6f5b43",
    lineHeight: 1.5,
  },
  form: {
    display: "grid",
    gap: 16,
  },
  label: {
    display: "grid",
    gap: 8,
    color: "#2f2417",
    fontWeight: 600,
  },
  input: {
    border: "1px solid #ccb998",
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 16,
    background: "#fff",
  },
  button: {
    border: 0,
    borderRadius: 999,
    padding: "14px 18px",
    fontSize: 16,
    fontWeight: 700,
    color: "#fffaf1",
    background: "linear-gradient(135deg, #a14a18 0%, #d06e2b 100%)",
    cursor: "pointer",
  },
  errorText: {
    color: "#b42318",
    fontSize: 14,
    fontWeight: 500,
  },
  errorPanel: {
    margin: 0,
    padding: "12px 14px",
    borderRadius: 14,
    background: "#fff1ef",
    color: "#b42318",
  },
};
