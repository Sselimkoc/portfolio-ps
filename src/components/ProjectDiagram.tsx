import {
  AppWindow,
  ArrowRight,
  AudioLines,
  BookMarked,
  ChefHat,
  CircleCheck,
  Clapperboard,
  Clock,
  Combine,
  Database,
  Download,
  FileText,
  Film,
  Filter,
  Image,
  Languages,
  Layers,
  LayoutGrid,
  Link,
  ListChecks,
  Lock,
  Mail,
  Mic,
  MonitorPlay,
  Newspaper,
  Palette,
  Play,
  RefreshCw,
  Rss,
  Scissors,
  Search,
  Send,
  Server,
  Sparkles,
  Upload,
  Users,
  Zap,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { LucideIcon } from 'lucide-react'

// Kodla çizilen proje şemaları. Metinler locales'teki `diagrams.<key>` altında,
// dile bağlı olmayan ikon, aşama ve teknoloji etiketleri burada tutulur.
type DiagramStepDef = {
  icon: LucideIcon
  phase: number
  chips: Array<string>
}

type DiagramDef = {
  key: string
  steps: Array<DiagramStepDef>
}

export const DIAGRAMS: Record<string, DiagramDef> = {
  'yt-shorts': {
    key: 'ytShorts',
    steps: [
      { icon: FileText, phase: 0, chips: ['Markdown', 'JSON'] },
      { icon: Mic, phase: 1, chips: ['ElevenLabs API', 'ASS'] },
      { icon: Clapperboard, phase: 1, chips: ['Pexels', 'Pixabay'] },
      { icon: Scissors, phase: 1, chips: ['MoneyPrinterTurbo', 'FFmpeg'] },
      { icon: Image, phase: 2, chips: ['Pillow'] },
      { icon: Upload, phase: 2, chips: ['YouTube Data API', 'ntfy'] },
    ],
  },
  'yt-long': {
    key: 'ytLong',
    steps: [
      { icon: AudioLines, phase: 0, chips: ['WAV'] },
      { icon: Users, phase: 0, chips: ['FFmpeg', 'NumPy'] },
      { icon: Clock, phase: 1, chips: ['faster-whisper', 'CUDA'] },
      { icon: Languages, phase: 1, chips: ['JSON'] },
      { icon: Film, phase: 2, chips: ['libass', 'HarfBuzz'] },
      { icon: Combine, phase: 2, chips: ['FFmpeg', 'loudnorm'] },
    ],
  },
  shoai: {
    key: 'shoai',
    steps: [
      { icon: ListChecks, phase: 0, chips: ['Radix UI'] },
      { icon: Palette, phase: 0, chips: ['localStorage'] },
      { icon: Sparkles, phase: 1, chips: ['Gemini', 'JSON'] },
      { icon: Image, phase: 1, chips: ['Gemini'] },
      { icon: Mic, phase: 2, chips: ['ElevenLabs API'] },
      { icon: MonitorPlay, phase: 2, chips: ['Next.js', 'Tailwind'] },
    ],
  },
  zestify: {
    key: 'zestify',
    steps: [
      { icon: Link, phase: 0, chips: ['React Native', 'Expo'] },
      { icon: Download, phase: 0, chips: ['Express', 'yt-dlp'] },
      { icon: AudioLines, phase: 0, chips: ['Whisper', 'FFmpeg'] },
      { icon: ChefHat, phase: 1, chips: ['Gemini', 'JSON'] },
      { icon: Languages, phase: 1, chips: ['Google Translate'] },
      { icon: BookMarked, phase: 2, chips: ['Supabase', 'AsyncStorage'] },
    ],
  },
  aiclipper: {
    key: 'aiclipper',
    steps: [
      { icon: Upload, phase: 0, chips: ['FastAPI', 'CLI'] },
      { icon: AudioLines, phase: 0, chips: ['Whisper', 'CUDA'] },
      { icon: Layers, phase: 1, chips: ['Python'] },
      { icon: Sparkles, phase: 1, chips: ['Gemini', 'JSON'] },
      { icon: Filter, phase: 1, chips: ['difflib'] },
      { icon: Scissors, phase: 2, chips: ['FFmpeg'] },
    ],
  },
  feedtune: {
    key: 'feedtune',
    steps: [
      { icon: Search, phase: 0, chips: ['Next.js', 'Zod'] },
      { icon: Rss, phase: 0, chips: ['rss-parser', 'YouTube Data API'] },
      { icon: RefreshCw, phase: 1, chips: ['rss-parser', 'YouTube Data API'] },
      { icon: Image, phase: 1, chips: ['Open Graph'] },
      { icon: Database, phase: 1, chips: ['Supabase', 'RLS'] },
      { icon: Newspaper, phase: 2, chips: ['TanStack Query', 'Zustand'] },
    ],
  },
  'portfolio-os': {
    key: 'portfolioOs',
    steps: [
      { icon: Server, phase: 0, chips: ['TanStack Start', 'SSR'] },
      { icon: Database, phase: 0, chips: ['Prisma', 'Neon'] },
      { icon: AppWindow, phase: 1, chips: ['React 19', 'Framer Motion'] },
      { icon: Palette, phase: 1, chips: ['Three.js', 'i18next'] },
      { icon: Mail, phase: 2, chips: ['EmailJS'] },
      { icon: Lock, phase: 2, chips: ['bcrypt', 'HMAC'] },
    ],
  },
  gabiflow: {
    key: 'gabiflow',
    steps: [
      { icon: LayoutGrid, phase: 0, chips: ['dnd-kit', 'react-grid-layout'] },
      { icon: ListChecks, phase: 0, chips: ['React', 'Ant Design'] },
      { icon: Zap, phase: 1, chips: ['Express'] },
      { icon: Database, phase: 1, chips: ['MySQL', 'SQL'] },
      { icon: Send, phase: 2, chips: ['MySQL'] },
      { icon: Users, phase: 2, chips: ['JWT', 'bcrypt'] },
    ],
  },
}

export const DIAGRAM_PREFIX = 'diagram:'

export function diagramId(item: string): string | null {
  if (!item.startsWith(DIAGRAM_PREFIX)) return null
  const id = item.slice(DIAGRAM_PREFIX.length).trim()
  return id in DIAGRAMS ? id : null
}

type StepText = { title: string; desc: string }

const asList = <T,>(value: unknown): Array<T> =>
  Array.isArray(value) ? (value as Array<T>) : []

export function useDiagramText(id: string) {
  const { t } = useTranslation()
  const base = `diagrams.${DIAGRAMS[id].key}`
  return {
    label: t(`${base}.label`),
    title: t(`${base}.title`),
    start: t(`${base}.start`, { defaultValue: '' }),
    end: t(`${base}.end`, { defaultValue: '' }),
    loop: t(`${base}.loop`, { defaultValue: '' }),
    loopLabel: t(`${base}.loopLabel`, { defaultValue: '' }),
    note: t(`${base}.note`, { defaultValue: '' }),
    summary: asList<string>(t(`${base}.summary`, { returnObjects: true })),
    phases: asList<string>(t(`${base}.phases`, { returnObjects: true })),
    steps: asList<StepText>(t(`${base}.steps`, { returnObjects: true })),
  }
}

type Step = StepText & DiagramStepDef & { index: number }

function StepNumber({ index }: { index: number }) {
  return (
    <span className="font-mono text-[11px] text-white/40">
      {String(index + 1).padStart(2, '0')}
    </span>
  )
}

function Chips({ chips }: { chips: Array<string> }) {
  if (chips.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {chips.map((chip) => (
        <span
          key={chip}
          className="text-[11px] text-white/65 border border-white/15 bg-white/8 rounded-md px-2 py-0.5"
        >
          {chip}
        </span>
      ))}
    </div>
  )
}

// Aşama etiketi numarasızdır; sırayı yalnızca adım numaraları taşır
function PhaseLabel({ name }: { name?: string }) {
  if (!name) return null
  return (
    <p className="font-mono text-[11px] text-white/55 uppercase tracking-widest">{name}</p>
  )
}

// Opak zemin, arkadan geçen akış çizgisini ikonun altında gizler
function StepIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-neutral-900">
      <Icon size={15} className="text-white/80" />
    </span>
  )
}

// Başlangıç ve sonuç uçları dolu daireyle ayrışır: şemanın girdisi ve çıktısı
function Endpoint({ kind, text }: { kind: 'start' | 'end'; text: string }) {
  const { t } = useTranslation()
  const Icon = kind === 'start' ? Play : CircleCheck
  return (
    <div className="flex items-center gap-3">
      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90">
        <Icon size={15} className="text-neutral-900" />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[11px] text-white/55 uppercase tracking-widest">
          {t(`diagrams.ui.${kind}`)}
        </p>
        <p className="text-sm font-medium text-white/90">{text}</p>
      </div>
    </div>
  )
}

function LoopRow({ loop, loopLabel }: { loop: string; loopLabel?: string }) {
  return (
    <div className="flex items-start gap-3 border border-dashed border-white/20 rounded-lg px-4 py-3">
      <RefreshCw size={15} className="mt-0.5 shrink-0 text-white/55" />
      <p className="text-[13px] leading-relaxed text-white/60">
        {loopLabel && <span className="font-semibold text-white/80">{loopLabel}: </span>}
        {loop}
      </p>
    </div>
  )
}

interface FlowProps {
  steps: Array<Step>
  phases: Array<string>
  start?: string
  end?: string
}

// Panel içi görünüm: projeler listesindeki nokta-çizgi motifiyle dikey akış
function Timeline({ steps, phases, start, end }: FlowProps) {
  return (
    <ol className="relative">
      <span className="absolute left-4 top-4 bottom-4 w-px bg-white/15" />
      {start && (
        <li className="pb-5">
          <Endpoint kind="start" text={start} />
        </li>
      )}
      {steps.map((step, i) => {
        const newPhase = i === 0 || steps[i - 1].phase !== step.phase
        return (
          <li key={step.index}>
            {newPhase && phases[step.phase] && (
              <div className="pl-11 pb-2.5">
                <PhaseLabel name={phases[step.phase]} />
              </div>
            )}
            <div className="grid grid-cols-[32px_1fr] gap-3 pb-5">
              <StepIcon icon={step.icon} />
              <div className="space-y-1 pt-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <StepNumber index={step.index} />
                  <p className="text-sm font-semibold text-white/90">{step.title}</p>
                </div>
                <p className="text-[13px] leading-relaxed text-white/60">{step.desc}</p>
              </div>
            </div>
          </li>
        )
      })}
      {end && (
        <li>
          <Endpoint kind="end" text={end} />
        </li>
      )}
    </ol>
  )
}

// Tam ekran görünüm: aşamalar soldan sağa sütunlar halinde akar
function PhaseFlow({ steps, phases, start, end }: FlowProps) {
  const phaseCount = Math.max(phases.length, ...steps.map((s) => s.phase + 1))
  const groups = Array.from({ length: phaseCount }, (_, p) =>
    steps.filter((s) => s.phase === p),
  )
  return (
    <div className="space-y-4">
      {start && <Endpoint kind="start" text={start} />}
      <div className="flex items-stretch gap-2">
        {groups.map((group, p) => (
          <div key={p} className="contents">
            {p > 0 && (
              <div className="flex items-center">
                <ArrowRight size={18} className="text-white/30" />
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-2.5">
              <PhaseLabel name={phases[p]} />
              {group.map((step) => (
                <div
                  key={step.index}
                  className="bg-white/5 border border-white/10 rounded-lg p-3.5 space-y-1.5"
                >
                  <div className="flex items-center gap-3">
                    <StepIcon icon={step.icon} />
                    <div className="flex items-baseline gap-2 min-w-0">
                      <StepNumber index={step.index} />
                      <p className="text-sm font-semibold text-white/90">{step.title}</p>
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-white/60">{step.desc}</p>
                  <Chips chips={step.chips} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {end && <Endpoint kind="end" text={end} />}
    </div>
  )
}

interface ProjectDiagramProps {
  id: string
  large?: boolean
}

export default function ProjectDiagram({ id, large = false }: ProjectDiagramProps) {
  const def = DIAGRAMS[id]
  const text = useDiagramText(id)

  const steps: Array<Step> = def.steps.map((stepDef, index) => ({
    ...stepDef,
    index,
    title: text.steps[index]?.title ?? '',
    desc: text.steps[index]?.desc ?? '',
  }))

  const Flow = large ? PhaseFlow : Timeline

  return (
    <div className={`w-full ${large ? 'p-6 space-y-4' : 'p-5 space-y-5'}`}>
      <div className="space-y-2">
        <p className="font-mono text-[11px] text-white/55 uppercase tracking-widest">
          {text.label}
        </p>
        <p
          className={`font-semibold text-white leading-snug ${large ? 'text-xl' : 'text-base'}`}
        >
          {text.title}
        </p>
        {text.summary.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/55">
            {text.summary.map((item, i) => (
              <span key={item} className="inline-flex items-center gap-2">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-white/30" />}
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      <Flow steps={steps} phases={text.phases} start={text.start} end={text.end} />

      {text.loop && <LoopRow loop={text.loop} loopLabel={text.loopLabel} />}

      {text.note && (
        <p className="text-xs text-white/45 border-t border-white/10 pt-3">{text.note}</p>
      )}
    </div>
  )
}
