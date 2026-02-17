export default async function Page() {
    let status = "API non joignable";
    try {
        const res = await fetch("http://profile-service:4001/health", { cache: "no-store" });
        const data = await res.json();
        status = `${data.service}:${data.status}`;
    } catch {}

    return (
        <main style={{ fontFamily: "Arial", padding: 24 }}>
            <h1>CV Builder</h1>
            <p>Etat profile-service: {status}</p>
        </main>
    );
}