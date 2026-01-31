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
  isMinimized?: boolean
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
  isMinimized = false,
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

  // Removed unused springTransition

  return (
    <motion.div
      ref={windowRef}
      className="fixed glass-window glass-window-shadow flex flex-col rounded-2xl overflow-hidden group"
      onMouseDown={() => onBringToFront(id)}
      style={
        {
          width: size.width,
          height: size.height,
          left: position.x,
          top: position.y,
        } as React.CSSProperties
      }
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={
        isMinimized
          ? { opacity: 0, scale: 0.3, y: 100 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={
        isInteracting
          ? { duration: 0 }
          : { type: 'spring', stiffness: 300, damping: 30 }
      }
    >
      {/* Title Bar */}
      <div
        className="py-3.5 px-4 border-b border-white/6 relative select-none backdrop-blur-[28px]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(30, 30, 34, 0.85), rgba(22, 22, 25, 0.75))',
        }}
      >
        {/* Left controls (NON-DRAG area) */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 cursor-default"
          draggable={false}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onClose(id)}
            className="mac-traffic close hover:shadow-md transition-all"
            aria-label={t('window.close')}
            title={t('window.close')}
          />
          <button
            onClick={() => onMinimize(id)}
            className="mac-traffic minimize hover:shadow-md transition-all"
            aria-label={t('window.minimize')}
            title={t('window.minimize')}
          />
          <button
            onClick={handleMaximize}
            className="mac-traffic maximize hover:shadow-md transition-all"
            aria-label={t('window.maximize')}
            title={t('window.maximize')}
          />
        </div>

        {/* Drag handle (only this part is draggable) */}
        <div
          className="mx-auto w-fit px-6 cursor-move flex items-center justify-center gap-2"
          onMouseDown={(e) => handleInteractionStart(e, 'drag')}
          onDoubleClick={handleMaximize}
          title="Drag window"
        >
          <span className="text-white font-semibold text-sm pointer-events-none tracking-[-0.3px]">
            {t(title)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto p-6 backdrop-blur-[28px]"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 35%, rgba(10, 10, 12, 0.55) 100%)',
        }}
      >
        {children}
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          {/* Edges */}
          <div
            className="absolute top-0 left-0 right-0 h-1 cursor-n-resize hover:bg-white/10 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'n')}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize hover:bg-white/10 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 's')}
          />
          <div
            className="absolute top-0 left-0 bottom-0 w-1 cursor-w-resize hover:bg-white/10 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'w')}
          />
          <div
            className="absolute top-0 right-0 bottom-0 w-1 cursor-e-resize hover:bg-white/10 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'e')}
          />

          {/* Corners */}
          <div
            className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize hover:bg-white/20 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'nw')}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize hover:bg-white/20 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'ne')}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize hover:bg-white/20 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'sw')}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize hover:bg-white/20 group-hover:opacity-100 opacity-0 transition"
            onMouseDown={(e) => handleInteractionStart(e, 'resize', 'se')}
          />
        </>
      )}
    </motion.div>
  )
}
