import { useEffect, useState } from "react";
import StepRenderer from "../components/StepRenderer";
import DaySection from "../components/DaySection";
import { useParams } from "react-router-dom";

import { fetchPlanBySlug } from "../api/plans";
import type { Plan } from "../types";

function PlanPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const { slug } = useParams();

  useEffect(() => {
    fetchPlanBySlug(slug)
        .then((data) => setPlan(data))
        .catch((error) => console.error(error));
  }, []);

  if (!plan) {
    return <main>Loading...</main>;
  }

  return (
    <main>
      <h1>{plan.title}</h1>
      <p>{plan.description}</p>

      {plan.days.map((day) => (
        <DaySection key={day.id} day={day} />
      ))}
    </main>
  );
}

export default PlanPage;