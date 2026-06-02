import { useEffect, useState } from "react";
import PlanCard from "../components/PlanCard";

import { fetchPlans } from "../api/plans";
import type { PlanSummary } from "../types";

function HomePage() {
  const [plans, setPlans] = useState<PlanSummary[]>([]);

  useEffect(() => {
    fetchPlans()
      .then((data) => setPlans(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <main>
      <h1>Devotional App</h1>
      <p>Minimal reading plans with progress tracking.</p>

      <section>
        <h2>Available Plans</h2>

        {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
        ))}
      </section>
    </main>
  );
}

export default HomePage;