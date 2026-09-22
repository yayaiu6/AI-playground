import { useEffect, useRef, useState, lazy, Suspense, useCallback } from 'react'
import { animate } from 'animejs'
import {
  Mail, Bot, Mic, PieChart, ImageIcon, Menu, X,
  GraduationCap, FileText, UserCheck,
  Store, Users, Building2, ArrowRight, Scale, ArrowUpRight,
} from 'lucide-react'
import HeroBlob from './HeroBlob'

const RatingsSection = lazy(() => import('./RatingsSection'))

/* ── Icons ─────────────────────────────────────────────────────────────── */
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/* ── Data ──────────────────────────────────────────────────────────────── */
const services = [
  { icon: Bot, title: 'Custom Chatbots', desc: 'Intelligent customer service bots trained on your company knowledge base.' },
  { icon: Mic, title: 'Voice & Audio AI', desc: 'Text-to-speech and audio transcription in multiple languages.' },
  { icon: PieChart, title: 'Data Analysis', desc: 'Find patterns, generate charts, and get actionable business insights.' },
  { icon: ImageIcon, title: 'AI Image Generation', desc: 'Create custom visuals, product mockups, and artistic assets from text.' },
]

const projects = [
  {
    icon: Store,
    title: 'Lahzi',
    desc: 'An Arabic-first restaurant assistant that answers from the restaurant’s menu, recommends dishes, and hands structured order details to the team across Meta messaging channels.',
    url: '/projects/lahzi/',
    tech: ['Conversational AI', 'Meta channels', 'Restaurant AI'],
    visual: 'lahzi' as const,
  },
  {
    icon: GraduationCap,
    title: 'AI English Tutor',
    desc: 'A real-time AI English teacher you speak with naturally. It listens, responds aloud, and teaches through spoken conversation.',
    url: '/projects/ai-english-tutor/',
    tech: ['React', 'Python', 'LLM'],
    visual: 'voice' as const,
  },
  {
    icon: FileText,
    title: 'Handwriting OCR',
    desc: 'A custom-built OCR model for extracting text from images and documents, including Arabic, English, French, and handwriting.',
    url: '/projects/handwriting-ocr/',
    tech: ['OCR', 'Python', 'API'],
    visual: 'scan' as const,
  },
  {
    icon: UserCheck,
    title: 'AI ATS System',
    desc: 'Automatically compare applicant CVs against the Job Description to screen the best candidates.',
    url: 'https://ats.yahya-mahroof.site/admin',
    tech: ['NLP', 'Python', 'Firebase'],
    visual: 'ats' as const,
  },
]

const industries = [
  { icon: Store, label: 'E-Commerce' },
  { icon: GraduationCap, label: 'Education' },
  { icon: Users, label: 'HR & Recruiting' },
  { icon: Building2, label: 'Healthcare' },
  { icon: PieChart, label: 'Accounting' },
  { icon: Scale, label: 'Law' },
]

/* Keep the shared section wrappers visual-only; interaction motion lives on controls. */
export function FadeUp({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return <div className={className}>{children}</div>
}

function ScaleIn({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return <div className={className}>{children}</div>
}

/* ── Project Visual Previews ───────────────────────────────────────────── */
function ProjectVisual({ type }: { type: 'voice' | 'scan' | 'doc' | 'ats' | 'lahzi' }) {
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const preview = previewRef.current
    if (!preview || (type !== 'scan' && type !== 'voice')) return

    if (!('IntersectionObserver' in window)) {
      preview.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      preview.classList.toggle('is-visible', entry.isIntersecting)
    }, { threshold: 0.1 })
    observer.observe(preview)
    return () => observer.disconnect()
  }, [type])

  if (type === 'lahzi') {
    return (
      <div className="project-preview project-preview--lahzi" aria-hidden="true">
        <div className="lahzi-preview__topline">
          <span><i /> Lahzi · RESTAURANT INBOX</span>
          <span>WHATSAPP · SAMPLE</span>
        </div>
        <div className="lahzi-preview__conversation" lang="ar" dir="rtl">
          <p className="lahzi-preview__customer">ممكن وجبة خفيفة بالخضار؟ ترشّح لي إيه؟</p>
          <p className="lahzi-preview__assistant">أرشّح لك سلطة خضار طازجة. تحب أضيفها لطلبك؟</p>
        </div>
        <div className="lahzi-preview__order">
          <span>ORDER READY FOR TEAM</span>
          <strong dir="rtl" lang="ar">سلطة خضار × ١ <i>·</i> استلام من الفرع</strong>
        </div>
      </div>
    )
  }

  if (type === 'voice') {
    return (
      <div ref={previewRef} className="project-preview project-preview--voice" aria-hidden="true">
        <div className="voice-preview__topline">
          <span className="voice-preview__live"><span /> Live voice lesson</span>
          <span className="voice-preview__mode">EN · REAL TIME</span>
        </div>
        <div className="voice-preview__conversation">
          <div className="voice-preview__participant">
            <span className="voice-preview__icon"><Mic size={15} /></span>
            <span>You</span>
          </div>
          <div className="voice-preview__wave" aria-hidden="true">
            {Array.from({ length: 21 }).map((_, i) => (
              <span
                key={i}
                className="preview-wave-bar"
                style={{ height: `${10 + Math.sin(i * 0.78) * 13}px`, animationDelay: `${i * 0.045}s` }}
              />
            ))}
          </div>
          <div className="voice-preview__participant voice-preview__participant--tutor">
            <span className="voice-preview__icon"><GraduationCap size={15} /></span>
            <span>AI tutor</span>
          </div>
        </div>
        <div className="voice-preview__caption">
          <span>Listen</span><i /><span>Speak</span><i /><span>Learn</span>
        </div>
      </div>
    )
  }

  if (type === 'scan') {
    return (
      <div ref={previewRef} className="project-preview project-preview--scan" aria-hidden="true">
        <div className="ocr-card-preview__source">
          <span className="ocr-card-preview__label">HANDWRITTEN</span>
          <div className="ocr-card-preview__lines" lang="ar" dir="rtl">
            <span className="ocr-card-preview__sample">استمارة تسجيل</span>
            <span className="ocr-card-preview__sample ocr-card-preview__sample--faint">يرجى مراجعة البيانات</span>
            <span className="ocr-card-preview__sample ocr-card-preview__sample--faint">رقم الطلب: ١٢٤٨</span>
            <span className="ocr-card-preview__sample ocr-card-preview__sample--faint">الاسم: يحيى معروف</span>
            <i className="ocr-card-preview__scan" />
          </div>
        </div>
        <span className="ocr-card-preview__arrow">→</span>
        <div className="ocr-card-preview__result">
          <span className="ocr-card-preview__label">EXTRACTED TEXT</span>
          <div className="ocr-card-preview__lines ocr-card-preview__lines--result" lang="ar" dir="rtl">
            <span className="ocr-card-preview__clean">استمارة تسجيل</span>
            <span className="ocr-card-preview__clean">يرجى مراجعة البيانات</span>
            <span className="ocr-card-preview__clean">رقم الطلب: ١٢٤٨</span>
            <span className="ocr-card-preview__clean">الاسم: يحيى معروف</span>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'ats') {
    return (
      <div ref={previewRef} className="project-preview project-preview--ats" aria-hidden="true">
        <span className="ats-preview__label">CANDIDATE MATCHING</span>
        {[92, 86, 74].map((score) => (
          <div className="ats-preview__row" key={score}>
            <span className="ats-preview__avatar" />
            <span className="ats-preview__track"><i style={{ width: `${score}%` }} /></span>
            <b>{score}%</b>
          </div>
        ))}
      </div>
    )
  }

  // doc
  return (
    <div ref={previewRef} className="project-preview project-preview--doc">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary/20" />
          <div className="h-2 bg-[var(--text-subtle)]/25 rounded w-1/2" />
        </div>
        <div className="h-1.5 bg-emerald-400/30 rounded w-full" />
        <div className="h-1.5 bg-emerald-400/20 rounded w-4/5" />
        <div className="h-1.5 bg-[var(--text-subtle)]/15 rounded w-3/4" />
        <div className="mt-1 h-1.5 bg-amber-400/25 rounded w-2/3" />
        <div className="h-1.5 bg-[var(--text-subtle)]/15 rounded w-5/6" />
      </div>
    </div>
  )
}

function RecitationContributionVisual() {
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const visual = visualRef.current
    if (!visual) return

    if (!('IntersectionObserver' in window)) {
      visual.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      visual.classList.toggle('is-visible', entry.isIntersecting)
    }, { threshold: 0.1 })
    observer.observe(visual)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={visualRef} className="contribution-recitation" aria-hidden="true">
      <span className="contribution-recitation__label">RECITATION TRACKING</span>
      <p lang="ar" dir="rtl">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</p>
      <div className="contribution-recitation__wave">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="preview-wave-bar"
            style={{ height: `${14 + Math.sin(i * 0.5) * 10}px`, animationDelay: `${i * 0.04}s` }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Main App ──────────────────────────────────────────────────────────── */
function App() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [mobileMenuOpen])

  return (
    <div className="grain">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav
              className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]'
            : 'bg-[var(--bg)]/65 backdrop-blur-sm border-b border-[var(--border)]/60'
        }`}
      >
        <div className="section-wrap site-nav__inner">
          <a href="#home" className="site-brand" aria-label="Yahya Mahroof — home">
            <img className="site-brand__wordmark" src="/yayaiu6-wordmark.png" alt="YAYAIU6" />
          </a>

          <div id="primary-navigation" className={`site-nav__links${mobileMenuOpen ? ' is-open' : ''}`}>
            <div className="site-nav__primary">
              {[
              { label: 'About', href: '#about' },
              { label: 'Work', href: '#projects' },
              { label: 'Contributions', href: '#contributions' },
              { label: 'Expertise', href: '#expertise' },
              { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="site-nav__link text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-white/[0.06]"
                >
                  {link.label}
                </a>
              ))}
              <a href="/ar/" lang="ar" className="site-nav__link text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-white/[0.06]">العربية</a>
            </div>

            <div className="site-nav__divider w-px h-4 bg-[var(--border)] mx-1.5 hidden sm:block" />

            <div className="site-nav__socials">
              <a
                href="https://github.com/yayaiu6"
                target="_blank"
                rel="noopener noreferrer"
                className="site-nav__social w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-white/[0.06] transition-all"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/yahya-mahrouf"
                target="_blank"
                rel="noopener noreferrer"
                className="site-nav__social w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-white/[0.06] transition-all"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
          <button
            type="button"
            className="site-nav__toggle"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      <main id="main-content">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section id="home" className="hero-section relative min-h-[min(860px,100svh)] flex items-center overflow-hidden pt-14">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[110px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-[90px]" />
          </div>

          <div className="relative z-10 section-wrap py-28 sm:py-32 w-full">
            <div className="hero-layout">
              <div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/[0.09] border border-primary/20 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-xs font-semibold text-primary tracking-wide">
                      AI / MLOps Engineer
                    </span>
                  </div>
                </div>

                <div>
                  <h1 className="text-[2.55rem] sm:text-5xl lg:text-[3.55rem] leading-[1.08] font-semibold text-[var(--text)] tracking-[-0.045em] mb-5 max-w-[15ch]">
                    I build intelligent systems that solve{' '}
                    <span className="text-primary">real problems</span>
                  </h1>
                </div>

                <div>
                  <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-lg mb-8 leading-relaxed">
                    AI/MLOps Engineer crafting production ready AI solutions from
                    AI applications to computer vision systems
                  </p>
                </div>

                <div>
                  <div className="hero-actions">
                    <a
                      href="#projects"
                      className="hero-action bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/25"
                    >
                      View Work
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                      href="#contact"
                      className="hero-action bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text)] rounded-xl font-semibold text-sm transition-all hover:bg-[var(--bg-alt)] hover:border-primary/35"
                    >
                      Get in Touch
                    </a>
                  </div>
                </div>
              </div>

              <div className="hero-art-column" aria-hidden="true">
                <HeroBlob />
              </div>
            </div>
          </div>
        </section>

        {/* ── About ─────────────────────────────────────────────────────── */}
        <section id="about" className="section border-y border-[var(--border)] bg-[var(--bg-alt)]">
          <div className="section-wrap">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-16 items-start">

              {/* Left Content */}
              <div className="md:col-span-7">
                <FadeUp>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/[0.07] text-primary text-xs font-semibold tracking-wide mb-5">
                    About
                  </span>
                </FadeUp>

                <FadeUp delay={80}>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight mb-6 leading-[1.2]">
                    Engineering intelligence
                    <br className="hidden sm:block" />
                    into production systems
                  </h2>
                </FadeUp>

                <FadeUp delay={160}>
                  <p className="text-[var(--text-muted)] leading-relaxed text-[15px] max-w-2xl">
                    Yahya Mahroof is an AI and Machine Learning Operations Engineer with experience in
                    designing, deploying, and improving AI systems and web applications. Skilled
                    in building AI agents and integrating AI into real-world solutions. Proficient
                    in Python, Flask, Django, and FastAPI, with experience deploying applications
                    on Ubuntu virtual machines. Experienced in backend development, including REST
                    APIs, WebSockets, and real-time systems.
                  </p>
                </FadeUp>
              </div>

              {/* Right Stats */}
              <div className="md:col-span-5">
                <div className="flex flex-col gap-5">
                  {[
                    { value: 14, suffix: '+', label: 'AI Projects Deployed' },
                    { value: 3, suffix: '+', label: 'Years Experience' },
                    { value: 99, suffix: '%', label: 'Client Satisfaction' },
                  ].map((stat, i) => (
                    <FadeUp key={stat.label} delay={200 + i * 90}>
                      <div className="stat-card flex items-center gap-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-primary/30 transition-colors">
                        <div className="text-3xl sm:text-4xl font-bold text-primary tracking-tight tabular-nums min-w-[70px]">
                          <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="text-sm text-[var(--text-muted)] leading-snug font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Expertise ─────────────────────────────────────────────────── */}
        <section id="expertise" className="section">
          <div className="section-wrap">
            <FadeUp>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/[0.07] text-primary text-xs font-semibold tracking-wide mb-5">
                Expertise
              </span>
            </FadeUp>
            <FadeUp delay={80}>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight mb-10">
                What I build
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((svc, i) => (
                <ScaleIn key={svc.title} delay={i * 70}>
                <div className="service-card group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-primary/30 hover:bg-[#191a24] transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-primary/[0.07] rounded-xl shrink-0">
                        <svc.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-[var(--text)] mb-1">
                          {svc.title}
                        </h3>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                          {svc.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScaleIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Projects ──────────────────────────────────────────────────── */}
        <section id="projects" className="section border-y border-[var(--border)] bg-[var(--bg-alt)]">
          <div className="section-wrap">
            <FadeUp>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/[0.07] text-primary text-xs font-semibold tracking-wide mb-5">
                Selected Work
              </span>
            </FadeUp>
            <FadeUp delay={80}>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight mb-10">
                Featured projects
              </h2>
            </FadeUp>

            <div className="projects-grid">
              {projects.map((proj, i) => (
                <ScaleIn key={proj.title} delay={i * 90}>
                  <a
                    href={proj.url}
                    className="project-card group block rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-primary/35 hover:shadow-[0_18px_48px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="project-card-art">
                      <ProjectVisual type={proj.visual} />
                    </div>

                    <div className="project-card__content">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <proj.icon className="w-4 h-4 text-primary" />
                          <h3 className="project-card__title font-bold text-[var(--text)] text-[15px]">
                            {proj.title}{proj.title === 'Lahzi' && <span className="project-card__localized-name" lang="ar" dir="rtl">لحظي</span>}
                          </h3>
                        </div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-300">
                          {proj.title.startsWith('Lahzi') ? 'Product' : 'Live'}
                        </span>
                      </div>

                      <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-3.5">
                        {proj.desc}
                      </p>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {proj.tech.map((t) => (
                            <span
                              key={t}
                              className="px-2.5 py-1 text-xs font-medium rounded-md bg-[var(--bg-alt)] text-[var(--text-muted)] border border-[var(--border-light)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="text-primary text-sm font-medium flex items-center gap-1 shrink-0 group-hover:gap-2 transition-all">
                          {proj.title.startsWith('Lahzi')
                            ? 'Explore project'
                            : proj.title === 'AI English Tutor' || proj.title === 'Handwriting OCR'
                            ? 'Try Demo'
                            : proj.title === 'AI ATS System'
                              ? 'Try System'
                              : 'Explore Project'}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </a>
                </ScaleIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contributions ─────────────────────────────────────────────── */}
        <section id="contributions" className="section border-y border-[var(--border)] bg-[var(--bg-alt)]">
          <div className="section-wrap">
            <FadeUp>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/[0.07] text-primary text-xs font-semibold tracking-wide mb-5">
                Contributions
              </span>
            </FadeUp>
            <FadeUp delay={80}>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight mb-3">
                Built, documented, and shared
              </h2>
              <p className="text-[var(--text-muted)] max-w-2xl mb-10 leading-relaxed">
                A closer look at the engineering behind selected AI projects, including my role and the work delivered.
              </p>
            </FadeUp>

            <div className="contributions-layout">
              <article className="contribution-feature">
                <div className="contribution-main">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                    <span className="contribution-kicker">Open source</span>
                    <span className="contribution-separator" aria-hidden="true">/</span>
                    <span className="contribution-meta">Creator &amp; maintainer</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text)] mb-3">
                    Real-time Quran recitation tracker
                  </h3>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--text-muted)] max-w-2xl mb-6">
                    Built an open-source system that follows recitation word by word, aligns speech with Quranic text, and detects skipped verses or page mismatches.
                  </p>
                  <ul className="contribution-capabilities" aria-label="Project capabilities">
                    <li>Speech recognition pipeline</li>
                    <li>Word-level alignment</li>
                    <li>Sequence detection and feedback</li>
                    <li>Technical documentation</li>
                  </ul>
                  <RecitationContributionVisual />
                  <div className="flex flex-wrap gap-3 mt-7">
                    <a className="contribution-link" href="/projects/quran-recitation-ai/">
                      Read case study <ArrowRight className="w-4 h-4" />
                    </a>
                    <a className="contribution-link contribution-link--quiet" href="https://github.com/yayaiu6/Real-Time-Quran-recitation-tracker-System" target="_blank" rel="noopener noreferrer">
                      View repository <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="contribution-evidence" aria-label="GitHub repository activity">
                  <div className="contribution-stat">
                    <strong>42</strong><span>Commits</span>
                  </div>
                  <div className="contribution-stat">
                    <strong>137</strong><span>GitHub stars</span>
                  </div>
                  <div className="contribution-stat">
                    <strong>15</strong><span>Forks</span>
                  </div>
                  <p className="contribution-note">Public repository signals; see GitHub for current totals.</p>
                </div>
              </article>

              <article className="contribution-secondary">
                <div className="contribution-secondary__icon">
                  <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="contribution-kicker mb-2">Arabic OCR · Model training pipeline</div>
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] mb-2">
                    TrOCR with synthetic Arabic data
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    Built a data-generation, preprocessing, and training workflow for Arabic text recognition, including 50,000 synthetic text images.
                  </p>
                </div>
                <a className="contribution-secondary__link" href="https://github.com/yayaiu6/Text-Vision-Advanced-Arabic-OCR-Model-Using-TrOCR" target="_blank" rel="noopener noreferrer" aria-label="View Arabic OCR training pipeline repository">
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* ── Industries ────────────────────────────────────────────────── */}
        <section id="industries" className="section">
          <div className="section-wrap">
            <FadeUp>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/[0.07] text-primary text-xs font-semibold tracking-wide mb-5">
                Industries
              </span>
            </FadeUp>
            <FadeUp delay={80}>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight mb-10">
                Industries I have worked with
              </h2>
            </FadeUp>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {industries.map((ind, i) => (
                <FadeUp key={ind.label} delay={i * 50}>
                  <div className="industry-card flex flex-col items-center gap-2.5 rounded-xl border border-[var(--border)] hover:border-primary/30 hover:bg-[var(--bg-card)] transition-all duration-300 text-center">
                    <ind.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-[var(--text)]">{ind.label}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ratings ───────────────────────────────────────────────────── */}
        <Suspense
          fallback={
            <section id="ratings" className="section" aria-label="Loading testimonials">
              <div className="section-wrap text-center py-12">
                <div className="h-6 w-28 bg-[var(--border)] rounded-full mx-auto mb-4 animate-pulse" />
              </div>
            </section>
          }
        >
          <RatingsSection />
        </Suspense>

        {/* ── Contact ───────────────────────────────────────────────────── */}
        <section id="contact" className="section contact-block">
          <div className="section-wrap text-center">
            <FadeUp>
              <span className="contact-eyebrow">
                Contact
              </span>
            </FadeUp>
            <FadeUp delay={80}>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
                Let us build something together
              </h2>
            </FadeUp>
            <FadeUp delay={160}>
              <p className="contact-block__copy">
                Have a project in mind? I would love to hear about it.
              </p>
            </FadeUp>

            <div className="contact-actions">
              {[
                { icon: Mail, label: 'Email', href: 'mailto:yahyamahroof35@gmail.com' },
                { icon: WhatsappIcon, label: 'WhatsApp', href: 'https://wa.me/+201001866276' },
                {
                  icon: LinkedinIcon,
                  label: 'LinkedIn',
                  href: 'https://www.linkedin.com/in/yahya-mahrouf',
                },
                { icon: GithubIcon, label: 'GitHub', href: 'https://github.com/yayaiu6' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`contact-action${item.label === 'Email' ? ' contact-action--primary' : ''}`}
                >
                  <item.icon className="contact-action__icon" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="site-footer__inner section-wrap">
          <a className="site-footer__brand" href="#home" aria-label="Yahya Mahroof — home">
            <img className="site-brand__wordmark site-brand__wordmark--small" src="/yayaiu6-wordmark.png" alt="YAYAIU6" />
          </a>
          <span className="site-footer__copyright">
            &copy; {new Date().getFullYear()} Yahya Mahroof. All rights reserved.
          </span>
          <div className="site-footer__links">
            <a className="site-footer__email" href="mailto:yahyamahroof35@gmail.com">Email</a>
            <a
              href="https://github.com/yayaiu6"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__social"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/yahya-mahrouf"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__social"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:yahyamahroof35@gmail.com"
              className="site-footer__social"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const numberRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = numberRef.current
    if (!element) return

    const finalValue = `${value}${suffix}`
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animation: ReturnType<typeof animate> | null = null
    let observer: IntersectionObserver | null = null
    let started = false

    const showFinalValue = () => {
      animation?.cancel()
      element.textContent = finalValue
    }

    const startAnimation = () => {
      if (started) return
      started = true
      observer?.disconnect()
      if (reducedMotion.matches) {
        showFinalValue()
        return
      }

      const counter = { current: 0 }
      element.textContent = `0${suffix}`
      animation = animate(counter, {
        current: value,
        duration: 1600,
        ease: 'outExpo',
        onUpdate: () => {
          element.textContent = `${Math.floor(counter.current)}${suffix}`
        },
        onComplete: () => {
          element.textContent = finalValue
        },
      })
    }

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        observer?.disconnect()
        started = true
        showFinalValue()
      }
    }
    reducedMotion.addEventListener('change', handleMotionPreference)

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) startAnimation()
      }, { threshold: 0.35 })
      observer.observe(element)
    } else {
      startAnimation()
    }

    return () => {
      observer?.disconnect()
      reducedMotion.removeEventListener('change', handleMotionPreference)
      animation?.cancel()
    }
  }, [suffix, value])

  return <span ref={numberRef} aria-label={`${value}${suffix}`}>{value}{suffix}</span>
}

export default App
