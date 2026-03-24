export default async function Page() {
    let status = "API non joignable";
    const apiBaseUrl = (process.env.NEXT_PUBLIC_PROFILE_API_URL || "http://profile-service:4001").replace(/\/$/, "");

    try {
        const res = await fetch(`${apiBaseUrl}/health`, { cache: "no-store" });

        if (!res.ok) {
            throw new Error(`health check failed with status ${res.status}`);
        }

        const data = await res.json();
        status = `${data.service}:${data.status}`;
    } catch (error) {
        console.error("Failed to reach profile-service:", error);
    }

    return (
        <main style={{ fontFamily: "Arial", padding: 24 }}>
            <h1>CV Builder</h1>
            <p>Etat profile-service: {status}</p>
        </main>
    );
}
