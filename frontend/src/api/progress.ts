const DEV_USER_KEY = "dev-user";

export async function fetchProgress(planSlug: string | undefined) {
  if (!planSlug) {
    throw new Error("Missing plan slug");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/progress/${DEV_USER_KEY}/${planSlug}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch progress");
  }

  return response.json();
}

export async function updateStepProgress({
  planSlug,
  stepKey,
  isComplete,
}: {
  planSlug: string | undefined;
  stepKey: string;
  isComplete: boolean;
}) {
  if (!planSlug) {
    throw new Error("Missing plan slug");
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/progress/step`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_key: DEV_USER_KEY,
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

export async function clearProgress(planSlug: string | undefined) {
  if (!planSlug) {
    throw new Error("Missing plan slug");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/progress/${DEV_USER_KEY}/${planSlug}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to clear progress");
  }

  return response.json();
}

export async function fetchActivePlans() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/progress/active/${DEV_USER_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch active plans");
  }

  return response.json();
}

export async function startPlan(planSlug: string | undefined) {
  if (!planSlug) {
    throw new Error("Missing plan slug");
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/progress/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_key: DEV_USER_KEY,
      plan_slug: planSlug,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to start plan");
  }

  return response.json();
}

export async function deactivatePlan(planSlug: string | undefined) {
  if (!planSlug) {
    throw new Error("Missing plan slug");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/progress/deactivate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_key: DEV_USER_KEY,
        plan_slug: planSlug,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to deactivate plan");
  }

  return response.json();
}