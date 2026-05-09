import { useStore } from '@/store/useStore'
import { isWorkTime } from '@/store/useStore'
import { usePomodoro, useNotification } from '@/hooks/useCatHooks'

export default function ActionButtons() {
  const phase = useStore((s) => s.phase)
  const isPaused = useStore((s) => s.isPaused)
  const startFocus = useStore((s) => s.startFocus)
  const startBreak = useStore((s) => s.startBreak)
  const skipPhase = useStore((s) => s.skipPhase)
  const togglePause = useStore((s) => s.togglePause)
  const settings = useStore((s) => s.settings)

  usePomodoro()
  const { requestPermission } = useNotification()

  const handleFeed = () => {
    if (settings.notificationEnabled) requestPermission()
    startFocus()
  }

  const handlePlay = () => {
    startBreak()
  }

  const isWork = isWorkTime()

  return (
    <div className="action-buttons">
      {phase === 'idle' && (
        <>
          <button
            className="action-btn feed-btn"
            onClick={handleFeed}
            disabled={!isWork}
            title={!isWork ? '非工作时段，猫咪在休息哦～' : '开始专注，给猫咪喂食'}
          >
            <span className="btn-icon">🐟</span>
            <span className="btn-text">喂食</span>
            {!isWork && <span className="btn-sub">非工作时段</span>}
          </button>
        </>
      )}

      {(phase === 'break' || phase === 'long-break') && (
        <button className="action-btn skip-btn" onClick={skipPhase}>
          <span className="btn-icon">⏭️</span>
          <span className="btn-text">跳过休息</span>
        </button>
      )}

      {phase === 'focus' && (
        <button className="action-btn skip-btn" onClick={skipPhase}>
          <span className="btn-icon">⏭️</span>
          <span className="btn-text">跳过专注</span>
        </button>
      )}

      {phase !== 'idle' && (
        <button className="action-btn pause-btn" onClick={togglePause}>
          <span className="btn-icon">{isPaused ? '▶️' : '⏸️'}</span>
          <span className="btn-text">{isPaused ? '继续' : '暂停'}</span>
        </button>
      )}

      {phase === 'idle' && isWork && (
        <button className="action-btn play-btn" onClick={handlePlay}>
          <span className="btn-icon">🧶</span>
          <span className="btn-text">逗猫</span>
        </button>
      )}
    </div>
  )
}
