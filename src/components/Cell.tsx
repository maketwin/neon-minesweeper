import { memo, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import type { Cell as CellType } from '../engine'

interface CellProps {
  cell: CellType
  lost: boolean
  won: boolean
  isDeath: boolean
  /** Stagger index for win cascade / mine ripple (manhattan distance) */
  staggerIndex: number
  onReveal: (row: number, col: number) => void
  onFlag: (row: number, col: number) => void
  onChord: (row: number, col: number) => void
}

function CellComponent({
  cell,
  lost,
  won,
  isDeath,
  staggerIndex,
  onReveal,
  onFlag,
  onChord,
}: CellProps) {
  const { row, col, state, isMine, adjacentMines } = cell
  const revealed = state === 'revealed'
  const flagged = state === 'flagged'
  const prevState = useRef(state)
  const [fxClass, setFxClass] = useState('')

  // Trigger one-shot CSS classes for flip / flag pop without remounting
  useEffect(() => {
    const prev = prevState.current
    prevState.current = state
    if (prev === state) return

    let nextFx = ''
    if (prev !== 'revealed' && state === 'revealed' && !isMine) {
      nextFx = 'cell--flip'
    } else if (prev !== 'flagged' && state === 'flagged') {
      nextFx = 'cell--flag-pop'
    } else if (prev === 'flagged' && state === 'hidden') {
      nextFx = 'cell--flag-pop'
    }

    if (!nextFx) return
    setFxClass(nextFx)
    const t = window.setTimeout(() => setFxClass(''), 220)
    return () => window.clearTimeout(t)
  }, [state, isMine])

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

  if (fxClass) {
    className += ` ${fxClass}`
  }

  if (lost && isMine && revealed) {
    if (isDeath) {
      className += ' cell--exploded cell--death'
    } else {
      className += ' cell--mine-ripple'
    }
  }

  if (won) {
    className += ' cell--win-cascade'
  }

  const style = {
    '--stagger': staggerIndex,
  } as CSSProperties

  return (
    <button
      type="button"
      className={className}
      style={style}
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
      {lost && isDeath && <span className="cell__ripple" aria-hidden />}
    </button>
  )
}

export default memo(CellComponent)
