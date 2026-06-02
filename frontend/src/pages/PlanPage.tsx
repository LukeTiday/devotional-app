import { useEffect, useState } from "react";
import StepRenderer from "../components/StepRenderer";
import DaySection from "../components/DaySection";
import { useParams } from "react-router-dom";
import DaySelector from "../components/DaySelector";
import DayNavControls from "../components/DayNavControls";

import { fetchPlanBySlug } from "../api/plans";
import type { Plan } from "../types";

function PlanPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);
  const { slug } = useParams();

  useEffect(() => {
    fetchPlanBySlug(slug)
        .then((data) => setPlan(data))
        .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!plan || selectedDayNumber !== null) {
        return;
    }

    const firstIncompleteDay = plan.days.find((day) =>
        day.steps.some((step) => !completedSteps.includes(step.step_key))
    );

    setSelectedDayNumber(firstIncompleteDay?.day_number ?? plan.days[0]?.day_number ?? null);
  }, [plan, selectedDayNumber, completedSteps]);

  function toggleStepComplete(stepKey: string) {
    setCompletedSteps((current) =>
        current.includes(stepKey)
        ? current.filter((key) => key !== stepKey)
        : [...current, stepKey]
    );
  }

  if (!plan) {
    return <main>Loading...</main>;
  }

  return (
    <main>
      <h1>{plan.title}</h1>
      <p>{plan.description}</p>
      <DaySelector
        days={plan.days}
        selectedDayNumber={selectedDayNumber}
        completedSteps={completedSteps}
        onSelectDay={setSelectedDayNumber}
      />

      {plan.days
        .filter((day) => day.day_number === selectedDayNumber)
        .map((day) => (
            <DaySection
            key={day.id}
            day={day}
            completedSteps={completedSteps}
            onToggleStepComplete={toggleStepComplete}
            />
      ))}
      <DayNavControls
        selectedDayNumber={selectedDayNumber}
        totalDays={plan.days.length}
        onSelectDay={setSelectedDayNumber}
      />
    </main>
  );
}

export default PlanPage;