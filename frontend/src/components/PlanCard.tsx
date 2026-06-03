import { Link } from "react-router-dom";

import type { ActivePlanSummary, PlanSummary } from "../types";

type Props = {
  plan: PlanSummary | ActivePlanSummary;
};

function hasProgress(plan: PlanSummary | ActivePlanSummary): plan is ActivePlanSummary {
  return "progress_percent" in plan;
}

function PlanCard({ plan }: Props) {
  return (
    <article>
      <h3>{plan.title}</h3>
      <p>{plan.description}</p>

      {hasProgress(plan) && (
        <div className="plan-progress">
          <div className="plan-progress-header">
            <span>{plan.progress_percent}% complete</span>
            <span>
              {plan.completed_steps}/{plan.total_steps} steps
            </span>
          </div>

          <div className="plan-progress-track">
            <div
              className="plan-progress-fill"
              style={{ width: `${plan.progress_percent}%` }}
            />
          </div>
        </div>
      )}

      <Link className="plan-card-link" to={`/plans/${plan.slug}`}>
        Open plan
      </Link>
    </article>
  );
}

export default PlanCard;