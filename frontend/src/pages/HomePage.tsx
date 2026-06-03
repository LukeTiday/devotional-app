import { useEffect, useState } from "react";
import PlanCard from "../components/PlanCard";

import { fetchPlans } from "../api/plans";
import type { ActivePlanSummary, PlanSummary } from "../types";
import { fetchActivePlans } from "../api/progress";


function HomePage() {
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [activePlans, setActivePlans] = useState<ActivePlanSummary[]>([]);

  useEffect(() => {
    fetchPlans()
      .then((data) => setPlans(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetchActivePlans()
        .then((data) => setActivePlans(data))
        .catch((error) => console.error(error));
  }, []);

  return (
    <main>
      <h1>Devotional App</h1>
      <p>Minimal reading plans with progress tracking.</p>

      {activePlans.length > 0 && (
        <section>
            <h2>Active Plans</h2>

            {activePlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
            ))}
        </section>
      )}

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