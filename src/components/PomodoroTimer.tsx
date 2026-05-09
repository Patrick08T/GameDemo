import { useStore, formatTime } from '@/store/useStore'

export default function PomodoroTimer() {
  const phase = useStore((s) => s.phase)
  const timeRemaining = useStore((s) => s.timeRemaining)
  const totalTime = useStore((s) => s.totalTime)
  const currentRound = useStore((s) => s.currentRound)
  const isPaused = useStore((s) => s.isPaused)
  const settings = useStore((s) => s.settings)

  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const phaseLabel =
    phase === 'focus'
      ? '专注中'
      : phase === 'break'
        ? '休息中'
        : phase === 'long-break'
          ? '长休息'
          : '准备开始'

  const phaseColor =
    phase === 'focus'
      ? '#FF8A80'
      : phase === 'break' || phase === 'long-break'
        ? '#A5D6A7'
        : '#FFD54F'

  return (
    <div className="pomodoro-timer">
      <div className="timer-ring-container">
        <svg className="timer-ring" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="8"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={phaseColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="timer-progress"
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="timer-display">
          <div className="timer-time">{formatTime(timeRemaining)}</div>
          <div className="timer-phase" style={{ color: phaseColor }}>
            {phaseLabel}
          </div>
        </div>
      </div>
      <div className="timer-rounds">
        {Array.from({ length: settings.longBreakInterval }, (_, i) => (
          <span
            key={i}
            className={`round-dot ${i < currentRound % settings.longBreakInterval ? 'completed' : ''} ${phase === 'focus' && i === currentRound % settings.longBreakInterval ? 'active' : ''}`}
          />
        ))}
      </div>
      {isPaused && <div className="paused-indicator">已暂停</div>}
    </div>
  )
}
