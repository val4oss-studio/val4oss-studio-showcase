type Status = 'success' | 'warning' | 'error';

interface PulsePointProps {
  status: Status;
}

export function PulsePoint({ status }: PulsePointProps) {
  return (
    <span className={`pulse-point pulse-point-${status}`} aria-hidden="true">
      <span className="pulse-point-ring" />
    </span>
  );
}
