import { useStore, isWorkTime } from '@/store/useStore'
import { useEffect, useState } from 'react'

export default function TimeStatus() {
  const phase = useStore((s) => s.phase)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const isWork = isWorkTime()
  const day = currentTime.getDay()
  const isWeekend = day === 0 || day === 6
  const hour = currentTime.getHours()
  const minute = currentTime.getMinutes()
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

  const getStatusText = () => {
    if (isWeekend) return '周末休息中'
    if (hour < 9) return '还没到上班时间'
    if (hour >= 18) return '下班啦～'
    if (phase === 'focus') return '专注工作中'
    if (phase === 'break' || phase === 'long-break') return '休息一下'
    return '等待互动'
  }

  const getStatusEmoji = () => {
    if (isWeekend) return '🌙'
    if (!isWork) return '🏠'
    if (phase === 'focus') return '💪'
    if (phase === 'break' || phase === 'long-break') return '☕'
    return '🐱'
  }

  return (
    <div className="time-status">
      <span className="time-clock">{timeStr}</span>
      <span className="time-divider">·</span>
      <span className="time-emoji">{getStatusEmoji()}</span>
      <span className="time-label">{getStatusText()}</span>
    </div>
  )
}
