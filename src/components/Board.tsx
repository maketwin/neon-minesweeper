import type { GameState } from '../engine'
import Cell from './Cell'

interface BoardProps {
  game: GameState
  onReveal: (row: number, col: number) => void
  onFlag: (row: number, col: number) => void
  onChord: (row: number, col: number) => void
}

function manhattan(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2)
}

export default function Board({ game, onReveal, onFlag, onChord }: BoardProps) {
  const lost = game.status === 'lost'
  const won = game.status === 'won'
  const death = game.deathCell
  const originRow = death?.row ?? Math.floor(game.rows / 2)
  const originCol = death?.col ?? Math.floor(game.cols / 2)

  let boardClass = 'board'
  if (won) boardClass += ' board--won'
  if (lost) boardClass += ' board--lost'

  return (
    <div
      className={boardClass}
      style={{
        gridTemplateColumns: `repeat(${game.cols}, var(--cell-size))`,
        gridTemplateRows: `repeat(${game.rows}, var(--cell-size))`,
      }}
      role="grid"
      aria-label="Minesweeper board"
    >
      {game.board.map((row) =>
        row.map((cell) => {
          const isDeath = !!(death && cell.row === death.row && cell.col === death.col)
          const staggerIndex = manhattan(cell.row, cell.col, originRow, originCol)
          return (
            <Cell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              lost={lost}
              won={won}
              isDeath={isDeath}
              staggerIndex={staggerIndex}
              onReveal={onReveal}
              onFlag={onFlag}
              onChord={onChord}
            />
          )
        })
      )}
    </div>
  )
}
