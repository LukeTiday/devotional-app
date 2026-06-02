import StepRenderer from "./StepRenderer";

import type { PlanDay } from "../types";

type Props = {
  day: PlanDay;
};

function DaySection({ day }: Props) {
  return (
    <section>
      <h2>
        Day {day.day_number}: {day.title}
      </h2>

      {day.steps.map((step) => (
        <StepRenderer key={step.step_key} step={step} />
      ))}
    </section>
  );
}

export default DaySection;