export async function fetchProgress({
  token,
  planSlug,
}: {
  token: string | null;
  planSlug: string | undefined;
}) {
  if (!token) {
    throw new Error("Missing auth token");
  }

  if (!planSlug) {
    throw new Error("Missing plan slug");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/progress/${planSlug}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch progress");
  }

  return response.json();
}

export async function updateStepProgress({
  token,
  planSlug,
  stepKey,
  isComplete,
}: {
  token: string | null;
  planSlug: string | undefined;
  stepKey: string;
  isComplete: boolean;
}) {
  if (!token) {
    throw new Error("Missing auth token");
  }

  if (!planSlug) {
    throw new Error("Missing plan slug");
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/progress/step`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      plan_slug: planSlug,
      step_key: stepKey,
      is_complete: isComplete,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update progress");
  }

  return response.json();
}

export async function clearProgress({
  token,
  planSlug,
}: {
  token: string | null;
  planSlug: string | undefined;
}) {
  if (!token) {
    throw new Error("Missing auth token");
  }

  if (!planSlug) {
    throw new Error("Missing plan slug");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/progress/${planSlug}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to clear progress");
  }

  return response.json();
}

export async function fetchActivePlans(token: string | null) {
  if (!token) {
    return [];
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/progress/active`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch active plans");
  }

  return response.json();
}

export async function startPlan({
  token,
  planSlug,
}: {
  token: string | null;
  planSlug: string | undefined;
}) {
  if (!token) {
    throw new Error("Missing auth token");
  }

  if (!planSlug) {
    throw new Error("Missing plan slug");
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/progress/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      plan_slug: planSlug,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to start plan");
  }

  return response.json();
}

export async function deactivatePlan({
  token,
  planSlug,
}: {
  token: string | null;
  planSlug: string | undefined;
}) {
  if (!token) {
    throw new Error("Missing auth token");
  }

  if (!planSlug) {
    throw new Error("Missing plan slug");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/progress/deactivate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        plan_slug: planSlug,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to deactivate plan");
  }

  return response.json();
}