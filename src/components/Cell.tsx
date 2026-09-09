import { memo, type MouseEvent, type ReactNode } from 'react'
import type { Cell as CellType } from '../engine'

interface CellProps {
  cell: CellType
  lost: boolean
  onReveal: (row: number, col: number) => void
  onFlag: (row: number, col: number) => void
  onChord: (row: number, col: number) => void
}

function CellComponent({ cell, lost, onReveal, onFlag, onChord }: CellProps) {
  const { row, col, state, isMine, adjacentMines } = cell
  const revealed = state === 'revealed'
  const flagged = state === 'flagged'

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    if (e.button === 0) onReveal(row, col)
  }

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    onFlag(row, col)
  }

  const handleAuxClick = (e: MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault()
      onChord(row, col)
    }
  }

  const handleDoubleClick = () => {
    onChord(row, col)
  }

  let content: ReactNode = null
  let className = 'cell'

  if (flagged) {
    className += ' cell--flagged'
    content = <span className="cell__icon cell__icon--flag">⚑</span>
  } else if (revealed) {
    className += ' cell--revealed'
    if (isMine) {
      className += ' cell--mine'
      content = <span className="cell__icon cell__icon--mine">✦</span>
    } else if (adjacentMines > 0) {
      className += ` cell--n${adjacentMines}`
      content = <span className="cell__num">{adjacentMines}</span>
    }
  } else {
    className += ' cell--hidden'
  }

  if (lost && isMine && revealed) {
    className += ' cell--exploded'
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={
        flagged
          ? `Flagged cell ${row},${col}`
          : revealed
            ? isMine
              ? 'Mine'
              : `Cell ${adjacentMines}`
            : `Hidden cell ${row},${col}`
      }
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onAuxClick={handleAuxClick}
      onDoubleClick={handleDoubleClick}
    >
      {content}
    </button>
  )
}

export default memo(CellComponent)
