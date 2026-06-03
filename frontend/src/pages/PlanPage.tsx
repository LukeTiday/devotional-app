import { useEffect, useState } from "react";
import DaySection from "../components/DaySection";
import { useParams } from "react-router-dom";
import DaySelector from "../components/DaySelector";
import DayNavControls from "../components/DayNavControls";

import { fetchPlanBySlug } from "../api/plans";
import {
  clearProgress,
  deactivatePlan,
  fetchProgress,
  startPlan,
  updateStepProgress,
} from "../api/progress";
import type { Plan } from "../types";


function PlanPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [hasLoadedCompletedSteps, setHasLoadedCompletedSteps] = useState(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);
  const [hasStartedPlan, setHasStartedPlan] = useState(false);
  const [isPlanComplete, setIsPlanComplete] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    fetchPlanBySlug(slug)
        .then((data) => setPlan(data))
        .catch((error) => console.error(error));
  }, [slug]);

  useEffect(() => {
    fetchProgress(slug)
        .then((data) => {
        setCompletedSteps(data.completed_steps);
        setHasStartedPlan(data.is_active);
        setIsPlanComplete(data.is_complete);
        setHasLoadedCompletedSteps(true);
        })
        .catch((error) => {
        console.error(error);
        setHasLoadedCompletedSteps(true);
        });
  }, [slug]);

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
    setCompletedSteps((current) => {
        const isCurrentlyComplete = current.includes(stepKey);
        const nextIsComplete = !isCurrentlyComplete;

        const nextCompletedSteps = isCurrentlyComplete
        ? current.filter((key) => key !== stepKey)
        : [...current, stepKey];

        updateStepProgress({
        planSlug: slug,
        stepKey,
        isComplete: nextIsComplete,
        })
        .then(() => fetchProgress(slug))
        .then((data) => {
            setHasStartedPlan(data.is_active);
            setIsPlanComplete(data.is_complete);
        })
        .catch((error) => console.error(error));

        return nextCompletedSteps;
    });
  }

  if (!plan) {
    return <main>Loading...</main>;
  }

  return (
    <main>
      <h1>{plan.title}</h1>
      <p>{plan.description}</p>

      {isPlanComplete && (
        <div className="plan-complete-banner">
            Plan complete ✓
        </div>
      )}

      <button
        type="button"
        className={
            hasStartedPlan
            ? "start-plan-button start-plan-button-active"
            : "start-plan-button"
        }
        onClick={() => {
            if (hasStartedPlan) {
            deactivatePlan(slug)
                .then(() => setHasStartedPlan(false))
                .catch((error) => console.error(error));

            return;
            }

            startPlan(slug)
            .then(() => setHasStartedPlan(true))
            .catch((error) => console.error(error));
        }}
        >
        {hasStartedPlan ? "Active ✓" : "Set active"}
      </button>

      <DaySelector
        days={plan.days}
        selectedDayNumber={selectedDayNumber}
        completedSteps={completedSteps}
        onSelectDay={setSelectedDayNumber}
      />
      <button
        type="button"
        className="clear-progress-button"
        onClick={() => {
            clearProgress(slug)
                .then(() => {
                    setCompletedSteps([]);
                    setSelectedDayNumber(null);
                    setIsPlanComplete(false);
                })
                .catch((error) => console.error(error));
        }}
        >
        Clear progress
      </button>

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