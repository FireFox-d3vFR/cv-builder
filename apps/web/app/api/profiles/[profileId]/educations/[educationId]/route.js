function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_PROFILE_API_URL || "http://profile-service:4001").replace(/\/$/, "");
}

export async function PATCH(request, { params }) {
  const { profileId, educationId } = await params;
  const payload = await request.json();
  const response = await fetch(`${getApiBaseUrl()}/profiles/${profileId}/educations/${educationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json();

  return Response.json(data, { status: response.status });
}

export async function DELETE(_request, { params }) {
  const { profileId, educationId } = await params;
  const response = await fetch(`${getApiBaseUrl()}/profiles/${profileId}/educations/${educationId}`, {
    method: "DELETE",
    cache: "no-store",
  });

  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
