import type { GameStatus } from '../engine'

interface OverlayProps {
  status: GameStatus
  seconds: number
  onRestart: () => void
}

export default function Overlay({ status, seconds, onRestart }: OverlayProps) {
  if (status !== 'won' && status !== 'lost') return null

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
