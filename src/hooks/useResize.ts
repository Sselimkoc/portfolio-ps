import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

interface MovableOptions {
  initialSize: { width: number; height: number }
  initialPosition: { x: number; y: number }
  constraintsRef: RefObject<HTMLElement | null>
  minWidth?: number
  minHeight?: number
}

export function useResize({
  initialSize,
  initialPosition,
  constraintsRef,
  minWidth = 300,
  minHeight = 200,
}: MovableOptions) {
  const [size, setSize] = useState(initialSize)
  const [position, setPosition] = useState(initialPosition)
  const [isInteracting, setIsInteracting] = useState(false)

  // Keep latest values
  const sizeRef = useRef(size)
  const posRef = useRef(position)

  useEffect(() => {
    sizeRef.current = size
  }, [size])

  useEffect(() => {
    posRef.current = position
  }, [position])

  // rAF throttling state
  const rafIdRef = useRef<number | null>(null)
  const lastMouseEventRef = useRef<MouseEvent | null>(null)

  const onInteractionStart = useCallback(
    (e: React.MouseEvent, action: 'drag' | 'resize', edge?: string) => {
      e.preventDefault()

      const el = constraintsRef.current
      if (!el) return

      setIsInteracting(true)

      const startX = e.clientX
      const startY = e.clientY

      const startSize = { ...sizeRef.current }
      const startPos = { ...posRef.current }

      const getConstraints = () => el.getBoundingClientRect()

      const applyMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        const deltaY = moveEvent.clientY - startY
        const constraints = getConstraints()

        if (action === 'drag') {
          let newX = startPos.x + deltaX
          let newY = startPos.y + deltaY

          newX = Math.max(
            constraints.left,
            Math.min(newX, constraints.right - startSize.width),
          )
          newY = Math.max(
            constraints.top,
            Math.min(newY, constraints.bottom - startSize.height),
          )

          setPosition({ x: newX, y: newY })
          return
        }

        if (!edge) return

        const nextPos = { ...startPos }
        const nextSize = { ...startSize }

        // East (right)
        if (edge.includes('e')) {
          const maxWidth = constraints.right - startPos.x
          const proposed = startSize.width + deltaX
          nextSize.width = Math.max(minWidth, Math.min(proposed, maxWidth))
        }

        // South (bottom)
        if (edge.includes('s')) {
          const maxHeight = constraints.bottom - startPos.y
          const proposed = startSize.height + deltaY
          nextSize.height = Math.max(minHeight, Math.min(proposed, maxHeight))
        }

        // West (left)
        if (edge.includes('w')) {
          const minLeft = constraints.left
          const proposedLeft = startPos.x + deltaX
          const maxLeftByMinWidth = startPos.x + (startSize.width - minWidth)
          const clampedLeft = Math.min(
            maxLeftByMinWidth,
            Math.max(proposedLeft, minLeft),
          )

          const proposedWidth = startSize.width + (startPos.x - clampedLeft)
          nextPos.x = clampedLeft
          nextSize.width = Math.max(minWidth, proposedWidth)
        }

        // North (top)
        if (edge.includes('n')) {
          const minTop = constraints.top
          const proposedTop = startPos.y + deltaY
          const maxTopByMinHeight = startPos.y + (startSize.height - minHeight)
          const clampedTop = Math.min(
            maxTopByMinHeight,
            Math.max(proposedTop, minTop),
          )

          const proposedHeight = startSize.height + (startPos.y - clampedTop)
          nextPos.y = clampedTop
          nextSize.height = Math.max(minHeight, proposedHeight)
        }

        // Safety clamp: keep within constraints
        nextPos.x = Math.max(
          constraints.left,
          Math.min(nextPos.x, constraints.right - nextSize.width),
        )
        nextPos.y = Math.max(
          constraints.top,
          Math.min(nextPos.y, constraints.bottom - nextSize.height),
        )

        setSize(nextSize)
        setPosition(nextPos)
      }

      const tick = () => {
        rafIdRef.current = null
        const evt = lastMouseEventRef.current
        if (evt) applyMove(evt)
      }

      const onMouseMove = (moveEvent: MouseEvent) => {
        lastMouseEventRef.current = moveEvent
        if (rafIdRef.current != null) return
        rafIdRef.current = requestAnimationFrame(tick)
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)

        if (rafIdRef.current != null) {
          cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = null
        }
        lastMouseEventRef.current = null
        setIsInteracting(false)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [constraintsRef, minWidth, minHeight],
  )

  return { size, position, isInteracting, onInteractionStart, setSize, setPosition }
}
