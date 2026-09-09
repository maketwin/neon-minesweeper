import type { Difficulty, GameStatus } from '../engine'
import { DIFFICULTIES } from '../engine'

export type EffectsMode = 'full' | 'reduced' | 'off'

interface HUDProps {
  difficulty: Difficulty
  remaining: number
  seconds: number
  status: GameStatus
  effects: EffectsMode
  onDifficultyChange: (d: Difficulty) => void
  onRestart: () => void
  onEffectsChange: (e: EffectsMode) => void
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

const EFFECTS_LABELS: Record<EffectsMode, string> = {
  full: 'FX Full',
  reduced: 'FX Low',
  off: 'FX Off',
}

export default function HUD({
  difficulty,
  remaining,
  seconds,
  status,
  effects,
  onDifficultyChange,
  onRestart,
  onEffectsChange,
}: HUDProps) {
  const timeDisplay = String(Math.min(seconds, 999)).padStart(3, '0')
  const mineDisplay = String(Math.min(remaining, 999)).padStart(3, '0')

  const cycleEffects = () => {
    const order: EffectsMode[] = ['full', 'reduced', 'off']
    const i = order.indexOf(effects)
    onEffectsChange(order[(i + 1) % order.length])
  }

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
        <button
          type="button"
          className="hud__diff-btn hud__fx-btn"
          onClick={cycleEffects}
          title="Toggle effects (full / low / off) for weaker devices"
          aria-label={`Effects mode: ${effects}`}
        >
          {EFFECTS_LABELS[effects]}
        </button>
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
