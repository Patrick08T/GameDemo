import { useStore } from '@/store/useStore'

export default function EncounterModal() {
  const activeEncounter = useStore((s) => s.activeEncounter)
  const dismissEncounter = useStore((s) => s.dismissEncounter)

  if (!activeEncounter) return null

  return (
    <div className="encounter-overlay" onClick={dismissEncounter}>
      <div className="encounter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="encounter-stars">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="star"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${8 + Math.random() * 12}px`,
              }}
            >
              ✦
            </span>
          ))}
        </div>
        <div className="encounter-emoji">{activeEncounter.emoji}</div>
        <h3 className="encounter-title">{activeEncounter.title}</h3>
        <p className="encounter-description">{activeEncounter.description}</p>
        <div className="encounter-bonus">
          好感度 +{activeEncounter.affectionBonus} 💕
        </div>
        <button className="encounter-close" onClick={dismissEncounter}>
          抱抱小猫 ❤️
        </button>
      </div>
    </div>
  )
}
