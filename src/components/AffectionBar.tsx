import { useStore } from '@/store/useStore'

export default function AffectionBar() {
  const affection = useStore((s) => s.affection)

  const hearts = 5
  const filledHearts = Math.ceil((affection / 100) * hearts)

  const getLevel = () => {
    if (affection >= 80) return { text: '超爱你！', color: '#FF4081' }
    if (affection >= 60) return { text: '很亲近', color: '#FF6B9D' }
    if (affection >= 40) return { text: '还不错', color: '#FFB74D' }
    if (affection >= 20) return { text: '有点冷', color: '#90A4AE' }
    return { text: '不理你', color: '#78909C' }
  }

  const level = getLevel()

  return (
    <div className="affection-bar">
      <div className="affection-hearts">
        {Array.from({ length: hearts }, (_, i) => (
          <span
            key={i}
            className={`heart ${i < filledHearts ? 'filled' : ''}`}
            style={{
              animationDelay: `${i * 0.1}s`,
              color: i < filledHearts ? '#FF4081' : 'rgba(255,255,255,0.2)',
            }}
          >
            ♥
          </span>
        ))}
      </div>
      <div className="affection-progress-container">
        <div
          className="affection-progress"
          style={{ width: `${affection}%`, backgroundColor: level.color }}
        />
      </div>
      <div className="affection-info">
        <span className="affection-value" style={{ color: level.color }}>
          {affection}
        </span>
        <span className="affection-level" style={{ color: level.color }}>
          {level.text}
        </span>
      </div>
    </div>
  )
}
