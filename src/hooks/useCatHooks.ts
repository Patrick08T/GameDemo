import { useEffect, useRef, useCallback } from 'react'
import { useStore, type CatMood } from '@/store/useStore'

export function usePomodoro() {
  const tick = useStore((s) => s.tick)
  const phase = useStore((s) => s.phase)
  const isPaused = useStore((s) => s.isPaused)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (phase === 'idle') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(tick, 1000)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [phase, tick])

  return { isPaused }
}

export function useCatMoodManager() {
  const phase = useStore((s) => s.phase)
  const affection = useStore((s) => s.affection)
  const setCatMood = useStore((s) => s.setCatMood)
  const isDragging = useStore((s) => s.isDragging)
  const prevPhaseRef = useRef(phase)

  useEffect(() => {
    if (isDragging) return

    let mood: CatMood = 'waiting'

    if (phase === 'focus') {
      mood = 'eating'
    } else if (phase === 'break' || phase === 'long-break') {
      mood = 'playing'
    } else {
      if (affection >= 60) {
        mood = 'cuddly'
      } else if (affection < 30) {
        mood = 'unhappy'
      } else {
        mood = 'waiting'
      }
    }

    setCatMood(mood)
    prevPhaseRef.current = phase
  }, [phase, affection, setCatMood, isDragging])
}

export function useDrag(containerRef: React.RefObject<HTMLDivElement | null>) {
  const setCatPosition = useStore((s) => s.setCatPosition)
  const setIsDragging = useStore((s) => s.setIsDragging)
  const setCatMood = useStore((s) => s.setCatMood)
  const isDragging = useStore((s) => s.isDragging)
  const isDraggingRef = useRef(false)
  const startPosRef = useRef({ x: 0, y: 0 })
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    startPosRef.current = { x: e.clientX, y: e.clientY }

    longPressTimerRef.current = setTimeout(() => {
      isDraggingRef.current = true
      setIsDragging(true)
      setCatMood('grabbed')
    }, 300)
  }, [setIsDragging, setCatMood])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) {
      const dx = e.clientX - startPosRef.current.x
      const dy = e.clientY - startPosRef.current.y
      if (Math.sqrt(dx * dx + dy * dy) > 5 && longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }
      return
    }

    if (!containerRef.current) return
    const rect = containerRef.current.parentElement?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left - containerRef.current.offsetWidth / 2
    const y = e.clientY - rect.top - containerRef.current.offsetHeight / 2

    setCatPosition({
      x: Math.max(0, Math.min(rect.width - containerRef.current.offsetWidth, x)),
      y: Math.max(0, Math.min(rect.height - containerRef.current.offsetHeight, y)),
    })
  }, [setCatPosition, containerRef])

  const handlePointerUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    if (isDraggingRef.current) {
      isDraggingRef.current = false
      setIsDragging(false)
      setCatMood('landing')
      setTimeout(() => {
        const phase = useStore.getState().phase
        const affection = useStore.getState().affection
        if (phase === 'focus') {
          setCatMood('eating')
        } else if (phase === 'break' || phase === 'long-break') {
          setCatMood('playing')
        } else if (affection >= 60) {
          setCatMood('cuddly')
        } else if (affection < 30) {
          setCatMood('unhappy')
        } else {
          setCatMood('waiting')
        }
      }, 600)
    }
  }, [setIsDragging, setCatMood])

  return {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}

export function useEncounterTrigger() {
  const triggerEncounter = useStore((s) => s.triggerEncounter)
  const phase = useStore((s) => s.phase)
  const affection = useStore((s) => s.affection)

  useEffect(() => {
    if (phase === 'idle' && affection >= 60) {
      const interval = setInterval(() => {
        triggerEncounter()
      }, 45000)
      return () => clearInterval(interval)
    }
  }, [phase, affection, triggerEncounter])
}

export function useAffectionDecay() {
  const checkAffectionDecay = useStore((s) => s.checkAffectionDecay)

  useEffect(() => {
    const interval = setInterval(checkAffectionDecay, 60000)
    return () => clearInterval(interval)
  }, [checkAffectionDecay])
}

export function useDailyLogin() {
  const checkDailyLogin = useStore((s) => s.checkDailyLogin)

  useEffect(() => {
    checkDailyLogin()
  }, [checkDailyLogin])
}

export function useNotification() {
  const settings = useStore((s) => s.settings)
  const phase = useStore((s) => s.phase)
  const prevPhaseRef = useRef(phase)

  const breakMessages = [
    { title: '🐱 专注结束！', body: '喵～ 终于可以休息一下啦！' },
    { title: '🐱 喵！', body: '工作完成！本喵有点累了，想玩会儿～' },
    { title: '🐱 咕噜咕噜～', body: '累死啦！快来逗逗本喵吧！' },
    { title: '🐱 喵呜～', body: '好辛苦的说...该休息一下了！' },
    { title: '🐱 喵！', body: '本喵等你好久啦，快来陪我玩！' },
  ]

  const workMessages = [
    { title: '🐱 喵～', body: '休息够啦！本喵又饿了，想吃鱼！' },
    { title: '🐱 喵呜～', body: '有点无聊了呢...喂我吃饭吧！' },
    { title: '🐱 咕噜～', body: '能量满满！该开始新一轮工作啦！' },
    { title: '🐱 喵！', body: '睡醒啦～本喵准备好继续监督你工作了！' },
    { title: '🐱 喵～', body: '想本喵了吗？快开始专注吧！' },
  ]

  const getRandomMessage = (messages: typeof breakMessages) => {
    return messages[Math.floor(Math.random() * messages.length)]
  }

  useEffect(() => {
    if (prevPhaseRef.current !== phase && prevPhaseRef.current !== 'idle') {
      if (phase === 'break' || phase === 'long-break') {
        const msg = getRandomMessage(breakMessages)
        if (settings.notificationEnabled && Notification.permission === 'granted') {
          new Notification(msg.title, { body: msg.body })
        }
        if (settings.soundEnabled) {
          playNotificationSound()
        }
      } else if (phase === 'idle') {
        if (prevPhaseRef.current === 'break' || prevPhaseRef.current === 'long-break') {
          const msg = getRandomMessage(workMessages)
          if (settings.notificationEnabled && Notification.permission === 'granted') {
            new Notification(msg.title, { body: msg.body })
          }
          if (settings.soundEnabled) {
            playNotificationSound()
          }
        }
      }
    }
    prevPhaseRef.current = phase
  }, [phase, settings.notificationEnabled, settings.soundEnabled])

  const requestPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return { requestPermission }
}

function playNotificationSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.setValueAtTime(1000, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch {
    // silently fail
  }
}
