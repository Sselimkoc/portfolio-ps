import { Copy } from 'lucide-react'

type LinkRowProps = {
  icon: React.ElementType
  label: string
  value: string
  href: string
  onCopy: () => void
  onExternalLink?: (url: string) => void
}

export default function LinkRow({
  icon: Icon,
  label,
  value,
  href,
  onCopy,
  onExternalLink,
}: LinkRowProps) {
  // Translation not used here; simple labels

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noreferrer"
        onClick={(e) => {
          if ((label === 'GitHub' || label === 'LinkedIn') && onExternalLink) {
            e.preventDefault()
            onExternalLink(href)
          }
        }}
        className="flex items-center gap-2 min-w-0 hover:opacity-90 transition"
      >
        <Icon size={18} className="text-white/70" />
        <div className="min-w-0">
          <p className="text-white/60 text-xs">{label}</p>
          <p className="text-white/85 text-sm truncate">{value}</p>
        </div>
      </a>

      <button
        onClick={onCopy}
        className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
        aria-label={`Copy ${label}`}
      >
        <Copy size={16} className="text-white/70" />
      </button>
    </div>
  )
}
