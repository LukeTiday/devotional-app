import ReactMarkdown from "react-markdown";

import type { PlanStep } from "../types";

type Props = {
  step: PlanStep;
};

function StepRenderer({ step }: Props) {
  return (
    <article>
      <small>{step.step_type}</small>

      {step.content_markdown && (
        <ReactMarkdown>{step.content_markdown}</ReactMarkdown>
      )}

      {step.scripture_reference && (
        <p>
          <strong>Scripture:</strong> {step.scripture_reference}
        </p>
      )}
    </article>
  );
}

export default StepRenderer;