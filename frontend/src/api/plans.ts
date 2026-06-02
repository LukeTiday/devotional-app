export async function fetchPlanBySlug(slug: string | undefined) {
  if (!slug) {
    throw new Error("Missing plan slug");
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/plans/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch plan");
  }

  return response.json();
}
export async function fetchPlans() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/plans`);

  if (!response.ok) {
    throw new Error("Failed to fetch plans");
  }

  return response.json();
}