import { Link } from "react-router-dom";

import type { PlanSummary } from "../types";

type Props = {
  plan: PlanSummary;
};

function PlanCard({ plan }: Props) {
  return (
    <article>
      <h3>{plan.title}</h3>
      <p>{plan.description}</p>

      <Link to={`/plans/${plan.slug}`}>Open plan</Link>
    </article>
  );
}

export default PlanCard;