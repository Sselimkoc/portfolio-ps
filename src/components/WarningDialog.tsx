import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

interface WarningDialogProps {
  isOpen: boolean
  title: string
  message: string
  url?: string
  onConfirm: () => void
  onCancel: () => void
  onDontAskAgain?: () => void
}

export default function WarningDialog({
  isOpen,
  title,
  message,
  url,
  onConfirm,
  onCancel,
  onDontAskAgain,
}: WarningDialogProps) {
  const { t } = useTranslation()
  const [dontAsk, setDontAsk] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop: Daha koyu ve yumuşak blur */}
          <motion.div
            className="fixed inset-0 z-200 bg-black/60 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Dialog Container */}
          <div className="fixed inset-0 z-201 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="warning-dialog-title"
              className="w-full max-w-md pointer-events-auto"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(32, 32, 35, 0.85) 0%, rgba(15, 15, 18, 0.95) 100%)',
                  backdropFilter: 'blur(24px)',
                  boxShadow:
                    '0 0 0 1px rgba(255,255,255,0.05) inset, 0 20px 40px -10px rgba(0,0,0,0.5)',
                }}
              >
                {/* Header */}
                <div className="px-6 pt-6 pb-2">
                  <h2 id="warning-dialog-title" className="text-lg font-semibold text-white tracking-wide">
                    {title}
                  </h2>
                </div>

                {/* Content */}
                <div className="px-6 py-4 space-y-4">
                  <p className="text-[15px] text-zinc-300 leading-relaxed font-normal">
                    {message}
                  </p>

                  {url && (
                    <div className="group relative overflow-hidden rounded-lg border border-white/10 p-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                          {t('dialog.targetLink')}
                        </span>
                        <code className="text-xs text-white/80 font-mono break-all selection:bg-white/30">
                          {url}
                        </code>
                      </div>
                    </div>
                  )}
                </div>

                {/* Don't Ask Again */}
                {onDontAskAgain && (
                  <div className="px-6 pb-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={dontAsk}
                        onChange={(e) => setDontAsk(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-white focus:ring-2 focus:ring-white/30 cursor-pointer"
                      />
                      <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        {t('dialog.dontAskAgain')}
                      </span>
                    </label>
                  </div>
                )}

                {/* Actions: Apple-style buttons */}
                <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
                  <motion.button
                    onClick={onCancel}
                    className="px-5 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('dialog.cancel')}
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      if (dontAsk && onDontAskAgain) {
                        onDontAskAgain()
                      }
                      onConfirm()
                    }}
                    className="relative overflow-hidden px-6 py-2 rounded-lg bg-white text-black text-sm font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-zinc-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">
                      {t('dialog.continue')}
                    </span>
                    {/* Parlama efekti */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-500" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
