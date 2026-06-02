import StepRenderer from "./StepRenderer";

import type { PlanDay } from "../types";

type Props = {
  day: PlanDay;
  completedSteps: string[];
  onToggleStepComplete: (stepKey: string) => void;
};

function DaySection({
  day,
  completedSteps,
  onToggleStepComplete,
}: Props) {
  const completedCount = day.steps.filter((step) =>
    completedSteps.includes(step.step_key)
  ).length;

  const totalCount = day.steps.length;

  return (
    <section>
      <div className="day-header">
        <h2>
            Day {day.day_number}: {day.title}
        </h2>

        <p>
            {completedCount}/{totalCount} complete
        </p>
      </div>

      {day.steps.map((step) => (
        <StepRenderer
          key={step.step_key}
          step={step}
          isComplete={completedSteps.includes(step.step_key)}
          onToggleComplete={() => onToggleStepComplete(step.step_key)}
        />
      ))}
    </section>
  );
}

export default DaySection;