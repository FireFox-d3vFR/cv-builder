import { ProfileForm } from "./profile-form";
import { ProfileCard } from "./profile-card";

function getApiBaseUrl() {
    return (process.env.NEXT_PUBLIC_PROFILE_API_URL || "http://profile-service:4001").replace(/\/$/, "");
}

async function getHealthStatus(apiBaseUrl) {
    try {
        const res = await fetch(`${apiBaseUrl}/health`, { cache: "no-store" });

        if (!res.ok) {
            throw new Error(`health check failed with status ${res.status}`);
        }

        const data = await res.json();
        return `${data.service}:${data.status}`;
    } catch (error) {
        console.error("Failed to reach profile-service:", error);
        return "API non joignable";
    }
}

async function getProfiles(apiBaseUrl) {
    try {
        const res = await fetch(`${apiBaseUrl}/profiles`, { cache: "no-store" });

        if (!res.ok) {
            throw new Error(`profiles fetch failed with status ${res.status}`);
        }

        const profiles = await res.json();
        const detailedProfiles = await Promise.all(
            profiles.map(async (profile) => {
                const detailRes = await fetch(`${apiBaseUrl}/profiles/${profile.id}`, { cache: "no-store" });

                if (!detailRes.ok) {
                    return {
                        ...profile,
                        experiences: [],
                        educations: [],
                        skills: [],
                    };
                }

                return detailRes.json();
            })
        );

        return detailedProfiles;
    } catch (error) {
        console.error("Failed to load profiles:", error);
        return [];
    }
}

export default async function Page() {
    const apiBaseUrl = getApiBaseUrl();
    const [status, profiles] = await Promise.all([
        getHealthStatus(apiBaseUrl),
        getProfiles(apiBaseUrl),
    ]);

    return (
        <main style={styles.page}>
            <section style={styles.hero}>
                <p style={styles.kicker}>CV Builder</p>
                <h1 style={styles.title}>Un socle web connecte a la meme validation que l'API.</h1>
                <p style={styles.description}>
                    Cette premiere interface consomme le backend Docker et reutilise deja <code>@cv-builder/schemas</code> pour valider le formulaire de creation.
                </p>
                <div style={styles.statusPill}>Etat profile-service: {status}</div>
            </section>

            <section style={styles.grid}>
                <ProfileForm />

                <section style={styles.card}>
                    <div style={styles.cardHeader}>
                        <p style={styles.eyebrow}>Profils</p>
                        <h2 style={styles.cardTitle}>Profils existants</h2>
                        <p style={styles.cardDescription}>
                            Les donnees viennent de <code>GET /profiles</code>.
                        </p>
                    </div>

                    <div style={styles.list}>
                        {profiles.length === 0 ? (
                            <p style={styles.emptyState}>Aucun profil pour le moment.</p>
                        ) : (
                            profiles.map((profile) => <ProfileCard key={profile.id} profile={profile} />)
                        )}
                    </div>
                </section>
            </section>
        </main>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        padding: "48px 24px 64px",
        background:
            "radial-gradient(circle at top, rgba(255, 209, 163, 0.45), transparent 38%), linear-gradient(180deg, #f7efe1 0%, #efe4d4 100%)",
        color: "#2f2417",
        fontFamily: "Georgia, 'Times New Roman', serif",
    },
    hero: {
        maxWidth: 900,
        margin: "0 auto 32px",
    },
    kicker: {
        margin: 0,
        fontSize: 13,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#8b6f47",
    },
    title: {
        margin: "12px 0 16px",
        fontSize: "clamp(2.4rem, 5vw, 4.4rem)",
        lineHeight: 1,
        maxWidth: 760,
    },
    description: {
        maxWidth: 760,
        fontSize: 18,
        lineHeight: 1.6,
        color: "#5f4c36",
    },
    statusPill: {
        display: "inline-flex",
        marginTop: 18,
        padding: "10px 16px",
        borderRadius: 999,
        background: "#fff8ed",
        border: "1px solid #dccfb8",
        color: "#6f5b43",
        fontSize: 15,
    },
    grid: {
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 24,
        alignItems: "start",
    },
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
    list: {
        display: "grid",
        gap: 14,
    },
    emptyState: {
        margin: 0,
        padding: "18px 20px",
        borderRadius: 18,
        background: "#fff7eb",
        border: "1px dashed #dccfb8",
        color: "#6f5b43",
    },
};
