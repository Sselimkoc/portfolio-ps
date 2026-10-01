import { ChevronLeft, ChevronRight, Maximize2, Workflow, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import ProjectDiagram, { diagramId, useDiagramText } from './ProjectDiagram'

// Galeri öğesi: "diagram:<id>" → kodla çizilen şema, diğer her şey → görsel yolu/URL
interface ProjectMediaProps {
  items: Array<string>
  projectName: string
}

function MediaView({
  item,
  alt,
  large = false,
}: {
  item: string
  alt: string
  large?: boolean
}) {
  const id = diagramId(item)
  if (id) return <ProjectDiagram id={id} large={large} />
  return (
    <img
      src={item}
      alt={alt}
      loading="lazy"
      className={`w-full object-contain ${large ? 'max-h-[85vh]' : 'max-h-80'}`}
    />
  )
}

function DiagramThumb({ id }: { id: string }) {
  const text = useDiagramText(id)
  return (
    <div className="h-full w-full flex flex-col items-start justify-between p-2">
      <Workflow size={13} className="text-white/50" />
      <span className="font-mono text-[9px] leading-tight text-white/55 uppercase tracking-wider text-left line-clamp-2">
        {text.label}
      </span>
    </div>
  )
}

export default function ProjectMedia({ items, projectName }: ProjectMediaProps) {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setIndex(0)
    setOpen(false)
  }, [items])

  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + items.length) % items.length),
    [items.length],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  if (items.length === 0) return null
  const current = items[index]
  const diagramCount = items.filter((item) => diagramId(item)).length
  const headingKey =
    diagramCount === items.length
      ? 'projects.galleryDiagrams'
      : diagramCount > 0
        ? 'projects.galleryMixed'
        : 'projects.gallery'

  return (
    <div className="space-y-2">
      <h4
        className="text-xs font-semibold text-white/45 uppercase tracking-widest"
        style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
      >
        {t(headingKey)}
      </h4>

      <div className="group relative rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <MediaView key={current} item={current} alt={projectName} />
        <button
          onClick={() => setOpen(true)}
          aria-label={t('projects.expand')}
          className="absolute top-2 right-2 p-1.5 rounded-lg border border-white/15 bg-black/40 text-white/70 hover:text-white hover:bg-black/60 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => {
            const id = diagramId(item)
            return (
              <button
                key={item}
                onClick={() => setIndex(i)}
                aria-label={id ? t('projects.diagram') : `${projectName} ${i + 1}`}
                className={`shrink-0 w-24 h-14 rounded-lg overflow-hidden border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                  i === index
                    ? 'border-white/40 bg-white/12'
                    : 'border-white/10 bg-white/5 hover:bg-white/8 opacity-70 hover:opacity-100'
                }`}
              >
                {id ? (
                  <DiagramThumb id={id} />
                ) : (
                  <img src={item} alt="" loading="lazy" className="h-full w-full object-cover" />
                )}
              </button>
            )
          })}
        </div>
      )}

      {typeof document !== 'undefined' &&
        createPortal(
          open && (
              // Animasyonsuz: arkadaki backdrop-blur katmanları, opaklık animasyonu
              // sırasında bu katmanın üstüne taşıp titreme yapıyordu
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-6"
                onClick={() => setOpen(false)}
              >
                <div
                  className="relative w-full max-w-5xl max-h-[90vh] overflow-auto rounded-2xl border border-white/15 bg-neutral-900 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MediaView item={current} alt={projectName} large />
                  <button
                    onClick={() => setOpen(false)}
                    aria-label={t('projects.close')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg border border-white/15 bg-black/40 text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <X size={16} />
                  </button>
                </div>
                {items.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        go(-1)
                      }}
                      aria-label={t('projects.prev')}
                      className="absolute left-4 p-2 rounded-full border border-white/15 bg-black/40 text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        go(1)
                      }}
                      aria-label={t('projects.next')}
                      className="absolute right-4 p-2 rounded-full border border-white/15 bg-black/40 text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <span className="absolute bottom-4 font-mono text-xs text-white/50">
                      {index + 1} / {items.length}
                    </span>
                  </>
                )}
              </div>
            ),
          document.body,
        )}
    </div>
  )
}
