type Props = {
  selectedDayNumber: number | null;
  totalDays: number;
  onSelectDay: (dayNumber: number) => void;
};

function DayNavControls({
  selectedDayNumber,
  totalDays,
  onSelectDay,
}: Props) {
  if (selectedDayNumber === null) {
    return null;
  }

  const hasPreviousDay = selectedDayNumber > 1;
  const hasNextDay = selectedDayNumber < totalDays;

  return (
    <div className="day-nav-controls">
      <button
        type="button"
        className="day-nav-button"
        disabled={!hasPreviousDay}
        onClick={() => onSelectDay(selectedDayNumber - 1)}
      >
        Previous day
      </button>

      <button
        type="button"
        className="day-nav-button"
        disabled={!hasNextDay}
        onClick={() => onSelectDay(selectedDayNumber + 1)}
      >
        Next day
      </button>
    </div>
  );
}

export default DayNavControls;