import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { RotateCcw } from 'lucide-react'

interface Tile {
  id: number
  position: number
  isEmpty: boolean
}

interface SlidingPuzzleProps {
  imageUrl?: string
  gridSize?: number
}

export default function SlidingPuzzle({
  imageUrl = 'https://images.unsplash.com/photo-1533356270239-f10d5d9e4c1e?w=600&h=600',
  gridSize = 3,
}: SlidingPuzzleProps) {
  const { t } = useTranslation()
  const [tiles, setTiles] = useState<Array<Tile>>([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)

  // Initialize puzzle
  useEffect(() => {
    initializePuzzle()
  }, [gridSize])

  const initializePuzzle = () => {
    const totalTiles = gridSize * gridSize
    const newTiles: Array<Tile> = []

    // Create tiles in solved state
    for (let i = 0; i < totalTiles - 1; i++) {
      newTiles.push({
        id: i,
        position: i,
        isEmpty: false,
      })
    }
    // Add empty tile
    newTiles.push({
      id: totalTiles - 1,
      position: totalTiles - 1,
      isEmpty: true,
    })

    // Shuffle
    shuffleTiles(newTiles)
    setTiles(newTiles)
    setMoves(0)
    setIsWon(false)
  }

  const shuffleTiles = (tilesToShuffle: Array<Tile>) => {
    // Make at least 200 random valid moves
    const currentTiles = [...tilesToShuffle]
    let emptyPos = currentTiles.findIndex((tile) => tile.isEmpty)

    for (let i = 0; i < 200; i++) {
      const validMoves = getValidMoves(emptyPos)
      const randomMove =
        validMoves[Math.floor(Math.random() * validMoves.length)]

      // Swap
      const temp = currentTiles[emptyPos]
      currentTiles[emptyPos] = currentTiles[randomMove]
      currentTiles[randomMove] = temp

      // Swap positions
      currentTiles[emptyPos].position = emptyPos
      currentTiles[randomMove].position = randomMove

      emptyPos = randomMove
    }

    Object.assign(tilesToShuffle, currentTiles)
  }

  const getValidMoves = (emptyPos: number) => {
    const validMoves: Array<number> = []
    const row = Math.floor(emptyPos / gridSize)
    const col = emptyPos % gridSize

    // Up
    if (row > 0) validMoves.push(emptyPos - gridSize)
    // Down
    if (row < gridSize - 1) validMoves.push(emptyPos + gridSize)
    // Left
    if (col > 0) validMoves.push(emptyPos - 1)
    // Right
    if (col < gridSize - 1) validMoves.push(emptyPos + 1)

    return validMoves
  }

  const handleTileClick = (position: number) => {
    if (isWon) return

    const emptyTile = tiles.find((tile) => tile.isEmpty)
    if (!emptyTile) return

    const validMoves = getValidMoves(emptyTile.position)

    if (!validMoves.includes(position)) return

    // Swap tiles
    const newTiles = [...tiles]
    const temp = newTiles[emptyTile.position]
    newTiles[emptyTile.position] = newTiles[position]
    newTiles[position] = temp

    newTiles[emptyTile.position].position = emptyTile.position
    newTiles[position].position = position

    setTiles(newTiles)
    setMoves((m) => m + 1)

    // Check if won
    checkWin(newTiles)
  }

  const checkWin = (currentTiles: Array<Tile>) => {
    const isSolved = currentTiles.every((tile) => tile.position === tile.id)
    if (isSolved) {
      setIsWon(true)
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-linear-to-b from-white/5 to-white/10 backdrop-blur-sm p-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-white text-sm font-medium">
            {t('apps.puzzle.moves')}:{' '}
          </span>
          <span className="text-white text-2xl font-bold">{moves}</span>
        </div>
        <button
          onClick={initializePuzzle}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm"
        >
          <RotateCcw size={14} />
          {t('apps.puzzle.reset')}
        </button>
      </div>

      {/* Puzzle Grid */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="relative bg-white/5 rounded-lg overflow-hidden ring-2 ring-white/20"
          style={{
            width: '400px',
            height: '400px',
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '2px',
            padding: '2px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          {tiles.map((tile) => {
            const row = Math.floor(tile.position / gridSize)
            const col = tile.position % gridSize

            if (tile.isEmpty) {
              return (
                <div
                  key={tile.id}
                  className="bg-white/5"
                  style={{
                    gridRow: row + 1,
                    gridColumn: col + 1,
                  }}
                />
              )
            }

            const tileRow = Math.floor(tile.id / gridSize)
            const tileCol = tile.id % gridSize

            return (
              <motion.button
                key={tile.id}
                onClick={() => handleTileClick(tile.position)}
                className="relative bg-cover bg-center rounded cursor-pointer hover:brightness-110 transition-all overflow-hidden ring-1 ring-white/20 shadow-lg active:scale-95"
                style={{
                  gridRow: row + 1,
                  gridColumn: col + 1,
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: `${tileCol * (100 / (gridSize - 1))}% ${tileRow * (100 / (gridSize - 1))}%`,
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs font-bold pointer-events-none">
                  {tile.id + 1}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Completion Message */}
      {isWon && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="mt-4 text-center"
        >
          <p className="text-emerald-400 font-bold">{t('apps.puzzle.won')}</p>
        </motion.div>
      )}
    </div>
  )
}
