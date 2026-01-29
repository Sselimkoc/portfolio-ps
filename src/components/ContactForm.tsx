import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, Mail, User, MessageSquare } from 'lucide-react'
import emailjs from '@emailjs/browser'

const RATE_LIMIT_KEY = 'contact_last_send'
const RATE_LIMIT_SECONDS = 30
const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 100
const MAX_SUBJECT_LENGTH = 200
const MAX_MESSAGE_LENGTH = 2000

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
}

export default function ContactForm() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error' | 'ratelimit'
  >('idle')
  const [rateLimitRemaining, setRateLimitRemaining] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Rate limiting check
    const lastSend = localStorage.getItem(RATE_LIMIT_KEY)
    if (lastSend) {
      const elapsed = (Date.now() - parseInt(lastSend)) / 1000
      if (elapsed < RATE_LIMIT_SECONDS) {
        setStatus('ratelimit')
        setRateLimitRemaining(Math.ceil(RATE_LIMIT_SECONDS - elapsed))
        setTimeout(() => setStatus('idle'), 3000)
        return
      }
    }

    // Validate email format
    if (!EMAIL_REGEX.test(formData.email)) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message),
    }

    setStatus('sending')

    try {
      // EmailJS ile mail gönder
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: sanitizedData.name,
          from_email: sanitizedData.email,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )

      if (import.meta.env.DEV) {
        console.log('Email sent successfully:', result)
      }
      
      // Save timestamp for rate limiting
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString())
      
      setStatus('success')

      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' })
        setStatus('idle')
      }, 3000)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Email sending failed:', error)
      }
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="h-full w-full overflow-hidden flex">
      {/* Left Side - Form Fields */}
      <div className="w-96 border-r border-white/10 overflow-y-auto">
        <div className="p-6 space-y-4">
          {/* Description */}
          <p className="text-white/60 text-xs leading-relaxed pb-3 border-b border-white/10">
            {t('apps.contact.description')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs font-semibold text-white/45 uppercase tracking-widest flex items-center gap-2"
              >
                <User size={12} />
                {t('apps.contact.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={MAX_NAME_LENGTH}
                className="w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
                placeholder={t('apps.contact.namePlaceholder')}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-white/45 uppercase tracking-widest flex items-center gap-2"
              >
                <Mail size={12} />
                {t('apps.contact.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={MAX_EMAIL_LENGTH}
                className="w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
                placeholder={t('apps.contact.emailPlaceholder')}
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="text-xs font-semibold text-white/45 uppercase tracking-widest flex items-center gap-2"
              >
                <MessageSquare size={12} />
                {t('apps.contact.subject')}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                maxLength={MAX_SUBJECT_LENGTH}
                className="w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
                placeholder={t('apps.contact.subjectPlaceholder')}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Message & Send */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-7 space-y-4">
          {/* Message */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="message"
              className="text-xs font-semibold text-white/45 uppercase tracking-widest"
            >
              {t('apps.contact.message')}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={10}
              maxLength={MAX_MESSAGE_LENGTH}
              className="px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all resize-none"
              placeholder={t('apps.contact.messagePlaceholder')}
            />
          </div>

          {/* Submit Button */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <button
                type="submit"
                disabled={status === 'sending' || status === 'ratelimit'}
                className="w-full py-3 px-6 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('apps.contact.sending')}
                  </>
                ) : status === 'success' ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {t('apps.contact.success')}
                  </>
                ) : status === 'ratelimit' ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {t('apps.contact.ratelimit', { seconds: rateLimitRemaining })}
                  </>
                ) : status === 'error' ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {t('apps.contact.error')}
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    {t('apps.contact.send')}
                  </>
                )}
              </button>

              {/* Footer */}
              <p className="text-white/40 text-xs text-center">
                {t('apps.contact.footer')}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
