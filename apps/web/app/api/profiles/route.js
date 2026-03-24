function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_PROFILE_API_URL || "http://profile-service:4001").replace(/\/$/, "");
}

export async function POST(request) {
  const payload = await request.json();
  const response = await fetch(`${getApiBaseUrl()}/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json();

  return Response.json(data, { status: response.status });
}
