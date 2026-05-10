import { useRef } from 'react'
import { useStore, type CatMood } from '@/store/useStore'
import { useDrag, useCatMoodManager, useEncounterTrigger, useAffectionDecay, useDailyLogin } from '@/hooks/useCatHooks'

export default function CatPet() {
  useCatMoodManager()
  useEncounterTrigger()
  useAffectionDecay()
  useDailyLogin()

  const catRef = useRef<HTMLDivElement>(null)
  const { isDragging, handlePointerDown, handlePointerMove, handlePointerUp } = useDrag(catRef)
  const catMood = useStore((s) => s.catMood)
  const catPosition = useStore((s) => s.catPosition)

  return (
    <div
      ref={catRef}
      className={`cat-pet cat-mood-${catMood} ${isDragging ? 'cat-dragging' : ''}`}
      style={{
        transform: isDragging
          ? `translate(${catPosition.x}px, ${catPosition.y}px) scale(1.1)`
          : `translate(${catPosition.x}px, ${catPosition.y}px)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="cat-body">
        <div className="cat-tail" />
        <div className="cat-torso">
          <div className="cat-stripe cat-stripe-1" />
          <div className="cat-stripe cat-stripe-2" />
          <div className="cat-stripe cat-stripe-3" />
        </div>
        <div className="cat-head">
          <div className="cat-ear cat-ear-left">
            <div className="cat-ear-inner" />
          </div>
          <div className="cat-ear cat-ear-right">
            <div className="cat-ear-inner" />
          </div>
          <div className="cat-face">
            <div className="cat-eye cat-eye-left">
              <div className="cat-pupil" />
              <div className="cat-eye-shine" />
            </div>
            <div className="cat-eye cat-eye-right">
              <div className="cat-pupil" />
              <div className="cat-eye-shine" />
            </div>
            <div className="cat-nose" />
            <div className="cat-mouth" />
            <div className="cat-whisker cat-whisker-left-1" />
            <div className="cat-whisker cat-whisker-left-2" />
            <div className="cat-whisker cat-whisker-right-1" />
            <div className="cat-whisker cat-whisker-right-2" />
            <div className="cat-blush cat-blush-left" />
            <div className="cat-blush cat-blush-right" />
          </div>
        </div>
        <div className="cat-paw cat-paw-left" />
        <div className="cat-paw cat-paw-right" />
        <div className="cat-paw cat-paw-back-left" />
        <div className="cat-paw cat-paw-back-right" />
      </div>
      <CatEffects mood={catMood} />
    </div>
  )
}

function CatEffects({ mood }: { mood: CatMood }) {
  if (mood === 'sleeping') {
    return (
      <div className="cat-effects">
        <span className="zzz zzz-1">Z</span>
        <span className="zzz zzz-2">Z</span>
        <span className="zzz zzz-3">Z</span>
      </div>
    )
  }

  if (mood === 'eating') {
    return (
      <div className="cat-effects">
        <span className="food-bowl">🐟</span>
      </div>
    )
  }

  if (mood === 'playing') {
    return (
      <div className="cat-effects">
        <span className="yarn-ball">🧶</span>
      </div>
    )
  }

  if (mood === 'cuddly') {
    return (
      <div className="cat-effects">
        <span className="heart-float heart-1">💕</span>
        <span className="heart-float heart-2">💖</span>
        <span className="purr-bubble">咕噜～</span>
      </div>
    )
  }

  if (mood === 'unhappy') {
    return (
      <div className="cat-effects">
        <span className="sad-bubble">...</span>
      </div>
    )
  }

  if (mood === 'grabbed') {
    return (
      <div className="cat-effects">
        <span className="surprise-bubble">!?!</span>
      </div>
    )
  }

  if (mood === 'landing') {
    return (
      <div className="cat-effects">
        <span className="dust-particle dust-1">✧</span>
        <span className="dust-particle dust-2">✧</span>
        <span className="dust-particle dust-3">✧</span>
      </div>
    )
  }

  return null
}
