import { useEffect, useState } from 'react'
import type { GameStatus } from '../engine'

interface OverlayProps {
  status: GameStatus
  seconds: number
  onRestart: () => void
  /** Delay before showing so board FX can play (ms) */
  appearDelayMs?: number
}

export default function Overlay({
  status,
  seconds,
  onRestart,
  appearDelayMs = 0,
}: OverlayProps) {
  const terminal = status === 'won' || status === 'lost'
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!terminal) {
      setVisible(false)
      return
    }
    if (appearDelayMs <= 0) {
      setVisible(true)
      return
    }
    setVisible(false)
    const t = window.setTimeout(() => setVisible(true), appearDelayMs)
    return () => window.clearTimeout(t)
  }, [status, terminal, appearDelayMs])

  if (!terminal || !visible) return null

  const won = status === 'won'

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="overlay__card">
        <h2 className={`overlay__title${won ? ' overlay__title--win' : ' overlay__title--lose'}`}>
          {won ? 'CLEAR' : 'BOOM'}
        </h2>
        <p className="overlay__subtitle">
          {won ? `Cleared in ${seconds}s` : 'You hit a mine'}
        </p>
        <button type="button" className="overlay__btn" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  )
}
