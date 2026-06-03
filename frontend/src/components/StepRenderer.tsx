import ReactMarkdown from "react-markdown";

import type { PlanStep } from "../types";
import ScriptureBlock from "./ScriptureBlock";

type Props = {
  step: PlanStep;
  isComplete: boolean;
  canTrackProgress: boolean;
  onToggleComplete: () => void;
};

function StepRenderer({
  step,
  isComplete,
  canTrackProgress,
  onToggleComplete,
}: Props) {

  return (
    <article className={isComplete ? "step step-complete" : "step"}>
      <div className="step-header">
        <small>{step.step_type}</small>

        <button
          type="button"
          className={isComplete ? "complete-button complete-button-active" : "complete-button"}
          disabled={!canTrackProgress}
          title={!canTrackProgress ? "Sign in to track progress." : undefined}
          onClick={onToggleComplete}
        >
          <span className="checkmark">{isComplete ? "✓" : ""}</span>
          <span>{isComplete ? " Completed" : "Mark complete"}</span>
        </button>
      </div>

      {step.content_markdown && (
        <ReactMarkdown>{step.content_markdown}</ReactMarkdown>
      )}

      {step.scripture_reference && (
        <ScriptureBlock reference={step.scripture_reference} />
      )}
    </article>
  );
}

export default StepRenderer;