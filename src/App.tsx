import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  chordCell,
  createGame,
  remainingMines,
  revealCell,
  toggleFlag,
  type Difficulty,
  type GameState,
} from './engine'
import Board from './components/Board'
import HUD, { type EffectsMode } from './components/HUD'
import Overlay from './components/Overlay'

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [game, setGame] = useState<GameState>(() => createGame('beginner'))
  const [seconds, setSeconds] = useState(0)
  const [effects, setEffects] = useState<EffectsMode>('full')
  const timerRef = useRef<number | null>(null)
  const startedRef = useRef(false)

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
  }, [])

  const resetGame = useCallback((d: Difficulty = difficulty) => {
    stopTimer()
    startedRef.current = false
    setSeconds(0)
    setGame(createGame(d))
  }, [difficulty, stopTimer])

  const handleDifficultyChange = useCallback(
    (d: Difficulty) => {
      setDifficulty(d)
      resetGame(d)
    },
    [resetGame]
  )

  const handleReveal = useCallback(
    (row: number, col: number) => {
      setGame((prev) => {
        if (prev.status === 'won' || prev.status === 'lost') return prev
        const cell = prev.board[row][col]
        if (cell.state === 'revealed' || cell.state === 'flagged') return prev

        // Timer starts on first reveal
        if (!prev.minesPlaced || prev.status === 'ready') {
          startTimer()
        }

        return revealCell(prev, row, col)
      })
    },
    [startTimer]
  )

  const handleFlag = useCallback((row: number, col: number) => {
    setGame((prev) => {
      if (prev.status === 'won' || prev.status === 'lost') return prev
      return toggleFlag(prev, row, col)
    })
  }, [])

  const handleChord = useCallback(
    (row: number, col: number) => {
      setGame((prev) => {
        if (prev.status !== 'playing') return prev
        const next = chordCell(prev, row, col)
        if (next !== prev && next.status === 'playing') {
          startTimer()
        }
        return next
      })
    },
    [startTimer]
  )

  // Stop timer on win/lose
  useEffect(() => {
    if (game.status === 'won' || game.status === 'lost') {
      stopTimer()
    }
  }, [game.status, stopTimer])

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), [stopTimer])

  // Cell size based on difficulty
  const cellSize =
    difficulty === 'expert' ? '22px' : difficulty === 'intermediate' ? '28px' : '36px'

  // Let board FX play before overlay: lose ripple ~450ms; win cascade scales with board
  const overlayDelayMs = useMemo(() => {
    if (game.status === 'lost') return 480
    if (game.status === 'won') {
      const maxDist = Math.floor(game.rows / 2) + Math.floor(game.cols / 2)
      return Math.min(1200, 200 + maxDist * 40)
    }
    return 0
  }, [game.status, game.rows, game.cols])

  return (
    <div
      className="app"
      data-effects={effects}
      style={{ '--cell-size': cellSize } as React.CSSProperties}
    >
      <div className="app__glow" aria-hidden />
      <main className="app__panel">
        <h1 className="app__title">
          <span className="app__title-neon">NEON</span> MINESWEEPER
        </h1>
        <HUD
          difficulty={difficulty}
          remaining={remainingMines(game)}
          seconds={seconds}
          status={game.status}
          effects={effects}
          onDifficultyChange={handleDifficultyChange}
          onRestart={() => resetGame()}
          onEffectsChange={setEffects}
        />
        <div className="app__board-wrap">
          <Board
            game={game}
            onReveal={handleReveal}
            onFlag={handleFlag}
            onChord={handleChord}
          />
          <Overlay
            status={game.status}
            seconds={seconds}
            onRestart={() => resetGame()}
            appearDelayMs={overlayDelayMs}
          />
        </div>
        <p className="app__hint">
          Left click reveal · Right click flag · Middle / double-click chord
        </p>
      </main>
    </div>
  )
}
