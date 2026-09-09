import {
  Cell,
  Difficulty,
  DIFFICULTIES,
  GameState,
} from './types'

function createEmptyBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      isMine: false,
      adjacentMines: 0,
      state: 'hidden' as const,
    }))
  )
}

export function createGame(difficulty: Difficulty = 'beginner'): GameState {
  const { rows, cols, mines } = DIFFICULTIES[difficulty]
  return {
    board: createEmptyBoard(rows, cols),
    rows,
    cols,
    mines,
    status: 'ready',
    flagsUsed: 0,
    revealedCount: 0,
    difficulty,
    minesPlaced: false,
  }
}

function inBounds(state: GameState, row: number, col: number): boolean {
  return row >= 0 && row < state.rows && col >= 0 && col < state.cols
}

function neighbors(state: GameState, row: number, col: number): Cell[] {
  const result: Cell[] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const r = row + dr
      const c = col + dc
      if (inBounds(state, r, c)) {
        result.push(state.board[r][c])
      }
    }
  }
  return result
}

/** Place mines avoiding the first-click cell and its neighbors. */
function placeMines(state: GameState, safeRow: number, safeCol: number): void {
  const forbidden = new Set<string>()
  forbidden.add(`${safeRow},${safeCol}`)
  for (const n of neighbors(state, safeRow, safeCol)) {
    forbidden.add(`${n.row},${n.col}`)
  }

  const candidates: [number, number][] = []
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      if (!forbidden.has(`${r},${c}`)) {
        candidates.push([r, c])
      }
    }
  }

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  const mineCount = Math.min(state.mines, candidates.length)
  for (let i = 0; i < mineCount; i++) {
    const [r, c] = candidates[i]
    state.board[r][c].isMine = true
  }

  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const cell = state.board[r][c]
      if (cell.isMine) {
        cell.adjacentMines = 0
        continue
      }
      cell.adjacentMines = neighbors(state, r, c).filter((n) => n.isMine).length
    }
  }

  state.minesPlaced = true
}

function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    board: cloneBoard(state.board),
  }
}

function checkWin(state: GameState): boolean {
  const totalSafe = state.rows * state.cols - state.mines
  return state.revealedCount >= totalSafe
}

export function revealCell(state: GameState, row: number, col: number): GameState {
  if (state.status === 'won' || state.status === 'lost') return state
  if (!inBounds(state, row, col)) return state

  let next = cloneState(state)
  const cell = next.board[row][col]

  if (cell.state === 'revealed' || cell.state === 'flagged') return state

  if (!next.minesPlaced) {
    placeMines(next, row, col)
    next.status = 'playing'
  }

  if (cell.isMine) {
    cell.state = 'revealed'
    for (let r = 0; r < next.rows; r++) {
      for (let c = 0; c < next.cols; c++) {
        if (next.board[r][c].isMine) {
          next.board[r][c].state = 'revealed'
        }
      }
    }
    next.status = 'lost'
    return next
  }

  const queue: [number, number][] = [[row, col]]
  const visited = new Set<string>()

  while (queue.length > 0) {
    const [r, c] = queue.shift()!
    const key = `${r},${c}`
    if (visited.has(key)) continue
    visited.add(key)

    const current = next.board[r][c]
    if (current.state === 'flagged' || current.state === 'revealed') continue
    if (current.isMine) continue

    current.state = 'revealed'
    next.revealedCount++

    if (current.adjacentMines === 0) {
      for (const n of neighbors(next, r, c)) {
        if (n.state === 'hidden' && !n.isMine) {
          queue.push([n.row, n.col])
        }
      }
    }
  }

  if (checkWin(next)) {
    next.status = 'won'
    for (let r = 0; r < next.rows; r++) {
      for (let c = 0; c < next.cols; c++) {
        const m = next.board[r][c]
        if (m.isMine && m.state !== 'flagged') {
          m.state = 'flagged'
          next.flagsUsed++
        }
      }
    }
  }

  return next
}

export function toggleFlag(state: GameState, row: number, col: number): GameState {
  if (state.status === 'won' || state.status === 'lost') return state
  if (!inBounds(state, row, col)) return state

  const cell = state.board[row][col]
  if (cell.state === 'revealed') return state

  const next = cloneState(state)
  const target = next.board[row][col]

  if (target.state === 'flagged') {
    target.state = 'hidden'
    next.flagsUsed--
  } else {
    target.state = 'flagged'
    next.flagsUsed++
  }

  return next
}

export function chordCell(state: GameState, row: number, col: number): GameState {
  if (state.status !== 'playing') return state
  if (!inBounds(state, row, col)) return state

  const cell = state.board[row][col]
  if (cell.state !== 'revealed' || cell.adjacentMines === 0) return state

  const adjacent = neighbors(state, row, col)
  const flagCount = adjacent.filter((n) => n.state === 'flagged').length
  if (flagCount !== cell.adjacentMines) return state

  let next = state
  for (const n of adjacent) {
    if (n.state === 'hidden') {
      next = revealCell(next, n.row, n.col)
      if (next.status === 'lost' || next.status === 'won') break
    }
  }
  return next
}

export function remainingMines(state: GameState): number {
  return Math.max(0, state.mines - state.flagsUsed)
}
