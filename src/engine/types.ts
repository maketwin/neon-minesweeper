export type Difficulty = 'beginner' | 'intermediate' | 'expert'

export type CellState = 'hidden' | 'revealed' | 'flagged'

export interface Cell {
  row: number
  col: number
  isMine: boolean
  adjacentMines: number
  state: CellState
}

export type GameStatus = 'ready' | 'playing' | 'won' | 'lost'

export interface DifficultyConfig {
  rows: number
  cols: number
  mines: number
  label: string
}

export interface GameState {
  board: Cell[][]
  rows: number
  cols: number
  mines: number
  status: GameStatus
  flagsUsed: number
  revealedCount: number
  difficulty: Difficulty
  /** True after mines have been placed (after first click) */
  minesPlaced: boolean
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10, label: 'Beginner' },
  intermediate: { rows: 16, cols: 16, mines: 40, label: 'Intermediate' },
  expert: { rows: 16, cols: 30, mines: 99, label: 'Expert' },
}
