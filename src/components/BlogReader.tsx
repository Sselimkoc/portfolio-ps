import { BookOpen, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type BlogPost = {
  id: number
  title: string
  excerpt: string
  tags: Array<string>
  href: string
  publishedAt?: string | null
}

interface BlogReaderProps {
  posts: Array<BlogPost>
  onExternalLink?: (url: string) => void
}

export default function BlogReader({ posts, onExternalLink }: BlogReaderProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<BlogPost | null>(posts[0] || null)

  useEffect(() => {
    setSelected(posts[0] || null)
  }, [posts])

  const handleOpen = (href: string) => {
    if (onExternalLink) {
      onExternalLink(href)
    } else {
      window.open(href, '_blank')
    }
  }

  if (posts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-white/30">
        <BookOpen size={36} strokeWidth={1.2} />
        <p className="text-sm">{t('blog.empty')}</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-hidden flex">
      {/* Left — article list */}
      <div className="w-72 border-r border-white/10 overflow-y-auto">
        <div className="p-4 space-y-2">
          {posts.map((post, index) => (
            <button
              key={post.id}
              onClick={() => setSelected(post)}
              className={`
                w-full text-left py-3 px-3 rounded-lg transition-all duration-200
                ${
                  selected?.id === post.id
                    ? 'bg-white/12 border border-white/20 text-white'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/6'
                }
              `}
            >
              <div className="flex items-start gap-2">
                <div className="relative pt-1">
                  <div
                    className={`
                      w-2.5 h-2.5 rounded-full transition-all
                      ${selected?.id === post.id ? 'bg-white ring-2 ring-white/30' : 'bg-white/30'}
                    `}
                  />
                  {index < posts.length - 1 && (
                    <div className="absolute top-2.5 left-1 w-0.5 h-10 bg-linear-to-b from-white/20 to-transparent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs leading-snug line-clamp-2">{post.title}</p>
                  {post.publishedAt && (
                    <p className="text-[11px] text-white/40 truncate mt-0.5">{post.publishedAt}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right — detail */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <div className="p-7 pb-12 space-y-6">
            {/* Title */}
            <div className="space-y-1">
              <h3
                className="text-2xl font-bold text-white"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
              >
                {selected.title}
              </h3>
              {selected.publishedAt && (
                <p className="text-white/50 text-sm">{selected.publishedAt}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <h4
                className="text-xs font-semibold text-white/45 uppercase tracking-widest"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
              >
                {t('blog.excerpt')}
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">{selected.excerpt}</p>
            </div>

            {/* Tags */}
            {selected.tags.length > 0 && (
              <div className="space-y-2">
                <h4
                  className="text-xs font-semibold text-white/45 uppercase tracking-widest"
                  style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
                >
                  {t('blog.tags')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-white/70 border border-white/15 bg-white/8 rounded-lg px-3 py-1.5 hover:bg-white/12 transition cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => handleOpen(selected.href)}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ExternalLink size={18} />
                <span className="text-sm font-medium">{t('blog.readOnMedium')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/40 text-sm">{t('blog.selectPost')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
