import type { PlanDay } from "../types";

type Props = {
  days: PlanDay[];
  selectedDayNumber: number | null;
  completedSteps: string[];
  onSelectDay: (dayNumber: number) => void;
};

function DaySelector({
  days,
  selectedDayNumber,
  completedSteps,
  onSelectDay,
}: Props) {
  return (
    <nav className="day-selector" aria-label="Select devotional day">
      {days.map((day) => {
        const isSelected = day.day_number === selectedDayNumber;

        const isComplete = day.steps.every((step) =>
          completedSteps.includes(step.step_key)
        );

        return (
          <button
            key={day.id}
            type="button"
            className={
              isSelected
                ? "day-selector-button day-selector-button-active"
                : "day-selector-button"
            }
            onClick={() => onSelectDay(day.day_number)}
          >
            <span>Day</span>
            <strong>{day.day_number}</strong>
            {isComplete && <span className="day-selector-check">✓</span>}
          </button>
        );
      })}
    </nav>
  );
}

export default DaySelector;