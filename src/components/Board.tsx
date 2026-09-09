import type { GameState } from '../engine'
import Cell from './Cell'

interface BoardProps {
  game: GameState
  onReveal: (row: number, col: number) => void
  onFlag: (row: number, col: number) => void
  onChord: (row: number, col: number) => void
}

export default function Board({ game, onReveal, onFlag, onChord }: BoardProps) {
  const lost = game.status === 'lost'

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${game.cols}, var(--cell-size))`,
        gridTemplateRows: `repeat(${game.rows}, var(--cell-size))`,
      }}
      role="grid"
      aria-label="Minesweeper board"
    >
      {game.board.map((row) =>
        row.map((cell) => (
          <Cell
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            lost={lost}
            onReveal={onReveal}
            onFlag={onFlag}
            onChord={onChord}
          />
        ))
      )}
    </div>
  )
}
