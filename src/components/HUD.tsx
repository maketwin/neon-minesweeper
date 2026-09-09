import type { Difficulty, GameStatus } from '../engine'
import { DIFFICULTIES } from '../engine'

interface HUDProps {
  difficulty: Difficulty
  remaining: number
  seconds: number
  status: GameStatus
  onDifficultyChange: (d: Difficulty) => void
  onRestart: () => void
}

function faceForStatus(status: GameStatus): string {
  switch (status) {
    case 'won':
      return '◆'
    case 'lost':
      return '✕'
    case 'playing':
      return '◉'
    default:
      return '◎'
  }
}

export default function HUD({
  difficulty,
  remaining,
  seconds,
  status,
  onDifficultyChange,
  onRestart,
}: HUDProps) {
  const timeDisplay = String(Math.min(seconds, 999)).padStart(3, '0')
  const mineDisplay = String(Math.min(remaining, 999)).padStart(3, '0')

  return (
    <header className="hud">
      <div className="hud__difficulty">
        {(Object.keys(DIFFICULTIES) as Difficulty[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`hud__diff-btn${difficulty === key ? ' hud__diff-btn--active' : ''}`}
            onClick={() => onDifficultyChange(key)}
          >
            {DIFFICULTIES[key].label}
          </button>
        ))}
      </div>

      <div className="hud__stats">
        <div className="hud__counter hud__counter--mines" title="Mines remaining">
          <span className="hud__counter-label">MINES</span>
          <span className="hud__counter-value">{mineDisplay}</span>
        </div>

        <button
          type="button"
          className="hud__restart"
          onClick={onRestart}
          title="Restart"
          aria-label="Restart game"
        >
          {faceForStatus(status)}
        </button>

        <div className="hud__counter hud__counter--time" title="Elapsed time">
          <span className="hud__counter-label">TIME</span>
          <span className="hud__counter-value">{timeDisplay}</span>
        </div>
      </div>
    </header>
  )
}
