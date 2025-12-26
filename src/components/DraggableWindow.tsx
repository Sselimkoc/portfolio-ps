import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useResize } from '../hooks/useResize'

interface DraggableWindowProps {
  id: string
  title: string
  onClose: (id: string) => void
  onMinimize: (id: string) => void
  onBringToFront: (id: string) => void
  children: React.ReactNode
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
  dragConstraintsRef: React.RefObject<HTMLDivElement | null>
}

export default function DraggableWindow({
  id,
  title,
  onClose,
  onMinimize,
  onBringToFront,
  children,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 500, height: 400 },
  dragConstraintsRef,
}: DraggableWindowProps) {
  const { t } = useTranslation()
  const {
    size,
    position,
    isInteracting,
    onInteractionStart,
    setSize,
    setPosition,
  } = useResize({
    initialSize: defaultSize,
    initialPosition: defaultPosition,
    constraintsRef: dragConstraintsRef,
    minWidth: defaultSize.width,
    minHeight: defaultSize.height,
  })

  const windowRef = useRef<HTMLDivElement>(null)
  const [isMaximized, setIsMaximized] = useState(false)

  const previousState = useRef<{
    size: { width: number; height: number }
    position: { x: number; y: number }
  } | null>(null)

  const handleMaximize = () => {
    const el = dragConstraintsRef.current
    if (!el) return

    if (isMaximized) {
      if (!previousState.current) return
      setSize(previousState.current.size)
      setPosition(previousState.current.position)
      setIsMaximized(false)
      previousState.current = null
      return
    }

    previousState.current = { size, position }
    const bounds = el.getBoundingClientRect()
    setSize({ width: bounds.width, height: bounds.height })
    setPosition({ x: bounds.left, y: bounds.top })
    setIsMaximized(true)
  }

  const handleInteractionStart = (
    e: React.MouseEvent,
    action: 'drag' | 'resize',
    edge?: string,
  ) => {
    onBringToFront(id)
    onInteractionStart(e, action, edge)
  }

  const springTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  } as const

  return (
    <motion.div
      ref={windowRef}
      className="fixed glass-card glass-shadow flex flex-col rounded-xl overflow-hidden group"
      onMouseDown={() => onBringToFront(id)}
      style={{
        width: size.width,
        height: size.height,
        left: position.x,
        top: position.y,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={
        isInteracting ? { type: 'tween', duration: 0.01 } : springTransition
      }
    >
      {/* Title Bar */}
      <div className="bg-linear-to-r from-gray-700/40 to-gray-800/40 py-3 border-b border-white/5 relative select-none">
        {/* Left controls (NON-DRAG area) */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2.5 cursor-default"
          draggable={false}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onClose(id)}
            className="mac-traffic close"
            aria-label={t('topbar.close')}
            title={t('topbar.close')}
          />
          <button
            onClick={() => onMinimize(id)}
            className="mac-traffic minimize"
            aria-label={t('topbar.minimize')}
            title={t('topbar.minimize')}
          />
          <button
            onClick={handleMaximize}
            className="mac-traffic maximize"
            aria-label={t('topbar.maximize')}
            title={t('topbar.maximize')}
          />
        </div>

        {/* Drag handle (only this part is draggable) */}
        <div
          className="mx-auto w-fit px-6 cursor-move flex items-center justify-center gap-3"
          onMouseDown={(e) => handleInteractionStart(e, 'drag')}
          onDoubleClick={handleMaximize}
          title="Drag window"
        >
          <span className="text-white font-semibold text-sm pointer-events-none">
            {t(title)}
          </span>

          {/* drag dots */}
          <span className="text-white/50 text-sm tracking-[0.4em] leading-none select-none pointer-events-none">
            •••
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-900/20">
        {children}
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          {/* Edges */}
          <div
            className="absolute top-0 left-0 right-0 h-1 cursor-n-resize hover:bg-blue-500/20 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'n')}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize hover:bg-blue-500/20 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 's')}
          />
          <div
            className="absolute top-0 left-0 bottom-0 w-1 cursor-w-resize hover:bg-blue-500/20 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'w')}
          />
          <div
            className="absolute top-0 right-0 bottom-0 w-1 cursor-e-resize hover:bg-blue-500/20 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'e')}
          />

          {/* Corners */}
          <div
            className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize hover:bg-blue-500/40 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'nw')}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize hover:bg-blue-500/40 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'ne')}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize hover:bg-blue-500/40 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'sw')}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize hover:bg-blue-500/40 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'se')}
          />
        </>
      )}
    </motion.div>
  )
}
