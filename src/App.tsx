import { useRef, useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import {
  Mail,
  Bot,
  Mic,
  PieChart,
  ImageIcon,
  Settings,
  RefreshCw,
  GraduationCap,
  FileText,
  BookOpen,
  UserCheck,
  Store,
  Users,
  Building2,
  ArrowRight,
  ExternalLink,
  Scale,
  User,
} from 'lucide-react'

/* ─── Firebase Config ───────────────────────────────────────────────────── */
const firebaseConfig = {
  apiKey: 'AIzaSyAXofkSy3vfz7GuTgj6-S-rK2rsnUQp_J0',
  authDomain: 'ai-playground-ratings.firebaseapp.com',
  projectId: 'ai-playground-ratings',
  storageBucket: 'ai-playground-ratings.firebasestorage.app',
  messagingSenderId: '112573912701',
  appId: '1:112573912701:web:b381d9c41871025f49c314',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

/* ─── Brand Icons (not in lucide-react) ─────────────────────────────────── */
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const services = [
  {
    icon: Bot,
    title: 'Custom Chatbots',
    desc: 'Intelligent customer service bots trained on your company\'s knowledge base.',
    color: 'blue',
  },
  {
    icon: Mic,
    title: 'Voice & Audio AI',
    desc: 'Text-to-speech,  and audio transcription in multiple languages.',
    color: 'emerald',
  },
  {
    icon: PieChart,
    title: 'Data Analysis',
    desc: 'Find patterns, generate charts, and get actionable business insights from data.',
    color: 'violet',
  },
  {
    icon: ImageIcon,
    title: 'AI Image Generation',
    desc: 'Create stunning custom visuals, product mockups, and artistic assets simply by describing them.',
    color: 'amber',
  },
]

const projects = [
  {
    icon: GraduationCap,
    title: 'AI English Tutor',
    desc: 'Interactive AI English teacher that chats with you, corrects mistakes, and explains lessons in real-time.',
    url: 'https://english-tutor.yahya-mahroof.site/',
    color: 'blue',
    accent: 'primary',
  },
  {
    icon: FileText,
    title: 'Handwriting OCR',
    desc: 'Turn handwritten text into digital data instantly with high accuracy for easier documentation.',
    url: 'https://yayaiu6.github.io/AI-playground/OCR-Demo',
    color: 'cyan',
    accent: 'cyan-600',
  },
  {
    icon: BookOpen,
    title: 'Quran Recitation AI',
    desc: 'Test your memorization using AI voice recognition to detect and correct reading mistakes.',
    url: 'https://aitarteel.frp.cybertopia.xyz',
    color: 'emerald',
    accent: 'emerald-600',
  },
  {
    icon: UserCheck,
    title: 'AI ATS System',
    desc: 'Automatically compare applicant CVs against the Job Description to screen the best candidates.',
    url: 'https://ai-smart-recruitment.yahya-mahroof.site/admin',
    color: 'amber',
    accent: 'amber-600',
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

const colorMap: Record<string, { bg: string; text: string; hoverBg: string; hoverText: string }> = {
  blue: { bg: 'bg-blue-500/15', text: 'text-blue-400', hoverBg: 'group-hover:bg-blue-500', hoverText: 'group-hover:text-white' },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', hoverBg: 'group-hover:bg-emerald-500', hoverText: 'group-hover:text-white' },
  violet: { bg: 'bg-violet-500/15', text: 'text-violet-400', hoverBg: 'group-hover:bg-violet-500', hoverText: 'group-hover:text-white' },
  amber: { bg: 'bg-amber-500/15', text: 'text-amber-400', hoverBg: 'group-hover:bg-amber-500', hoverText: 'group-hover:text-white' },
  cyan: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', hoverBg: 'group-hover:bg-cyan-500', hoverText: 'group-hover:text-white' },
}

const projectColorMap: Record<string, { bg: string; text: string; hoverBg: string; hoverText: string; ring: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-primary', hoverBg: 'group-hover:bg-primary', hoverText: 'group-hover:text-white', ring: 'hover:border-primary' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', hoverBg: 'group-hover:bg-cyan-600', hoverText: 'group-hover:text-white', ring: 'hover:border-cyan-400' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hoverBg: 'group-hover:bg-emerald-600', hoverText: 'group-hover:text-white', ring: 'hover:border-emerald-400' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', hoverBg: 'group-hover:bg-amber-600', hoverText: 'group-hover:text-white', ring: 'hover:border-amber-400' },
}

/* ─── FadeUp hook ───────────────────────────────────────────────────────────── */
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

function FadeUp({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ─── App ───────────────────────────────────────────────────────────────────── */
interface Rating {
  id: string
  name: string
  stars: number
  comment: string
  email?: string
  phone?: string
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [ratingsLoading, setRatingsLoading] = useState(true)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.playbackRate = 2

    const onReady = () => setVideoReady(true)
    el.addEventListener('canplaythrough', onReady)
    if (el.readyState >= 4) setVideoReady(true)
    return () => el.removeEventListener('canplaythrough', onReady)
  }, [])

  useEffect(() => {
    async function fetchRatings() {
      try {
        const q = query(collection(db, 'ratings'), orderBy('timestamp', 'desc'), limit(6))
        const snapshot = await getDocs(q)
        const items: Rating[] = []
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Rating)
        })
        setRatings(items)
      } catch (err) {
        console.error('Failed to load ratings:', err)
      } finally {
        setRatingsLoading(false)
      }
    }
    fetchRatings()
  }, [])

  return (
    <div className="bg-white text-slate-600 antialiased selection:bg-primary selection:text-white scroll-smooth">
      {/* ── Skip Link ──────────────────────────────────────────────── */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ── Floating Sidebar ───────────────────────────────────────── */}
      <aside
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 hidden lg:flex"
        aria-label="Social contact links"
      >
        <a
          href="mailto:yahyamahroof35@gmail.com"
          className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all border border-slate-200/80"
          aria-label="Send email"
        >
          <Mail className="w-4 h-4" />
        </a>
        <a
          href="https://wa.me/+201001866276"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-500 hover:bg-emerald-500 hover:text-white transition-all border border-slate-200/80"
          aria-label="WhatsApp"
        >
          <WhatsappIcon className="w-4 h-4" />
        </a>
        <a
          href="https://www.linkedin.com/in/yahya-mahrouf"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all border border-slate-200/80"
          aria-label="LinkedIn"
        >
          <LinkedinIcon className="w-4 h-4" />
        </a>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────── */}
      <main id="main-content">
        {/* ── Hero with Video Background ───────────────────────────── */}
        <section id="home" className="relative min-h-screen overflow-hidden bg-[#f0f0ee]">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
          />

          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Hero Nav (pill style over video) */}
            <nav className="flex items-center justify-center pt-4 sm:pt-6 px-4 sm:px-8 gap-2 sm:gap-3">
              <a
                href="https://github.com/yayaiu6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-full w-14 h-14 sm:w-16 sm:h-16 shrink-0 overflow-hidden"
                style={{ backgroundColor: '#EDEDED' }}
              >
                <img
                  src="/yayaiu6_logo.png"
                  alt="Yahya Mahroof"
                  className="w-full h-full object-contain p-2"
                  width="64"
                  height="64"
                  loading="eager"
                  fetchPriority="high"
                />
              </a>
              <div
                className="flex items-center gap-4 sm:gap-10 rounded-xl px-4 sm:px-8 py-2.5 sm:py-3"
                style={{ backgroundColor: '#EDEDED' }}
              >
                {[
                  { label: 'Story', href: '#about' },
                  { label: 'Products', href: '#projects' },
                  { label: 'Help', href: '#contact' },
                  { label: 'Support', href: '#contact' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[12px] sm:text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>

            {/* Hero Content (bottom-left) */}
            <div className="flex-1 flex items-end pb-10 sm:pb-16 lg:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
              <div className="max-w-xs">
                <a
                  href="#expertise"
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-500 hover:text-blue-600 transition-colors mb-3 group"
                >
                  Yahya Mahroof & MLOps Specialist
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </a>

                <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-[1.15] font-medium text-gray-900 tracking-tight mb-3">
                  Building smart systems that change the way companies operate
                </h1>

                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group"
                >
                  View Live Demos
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Expertise ────────────────────────────────────────────── */}
        <section id="expertise" className="py-24 bg-dark text-white relative overflow-hidden grid-bg">
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/20">
                What We Do
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive AI Capabilities</h2>
              <div className="w-12 h-1 bg-accent mx-auto rounded-full mb-6" />
              <p className="text-slate-400 text-lg">
                We build, train, and integrate AI tools tailored to your exact organizational needs.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {services.map((svc, i) => {
                const c = colorMap[svc.color]
                return (
                  <FadeUp key={svc.title} delay={i * 80}>
                    <article className="group bg-white/[0.04] border border-white/[0.08] p-6 rounded-2xl hover:bg-white/[0.07] transition-colors">
                      <div className={`w-11 h-11 flex items-center justify-center ${c.bg} ${c.text} rounded-xl mb-4`}>
                        <svc.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-white">{svc.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{svc.desc}</p>
                    </article>
                  </FadeUp>
                )
              })}
            </div>

            <FadeUp>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.03] rounded-2xl p-8 border border-white/[0.08]">
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0 text-accent">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Seamless Integration</h4>
                    <p className="text-slate-400 text-sm">
                      We make AI solutions work flawlessly with your existing infrastructure.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0 text-accent">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Workflow Automation</h4>
                    <p className="text-slate-400 text-sm">
                      Automate repetitive tasks to significantly reduce time and operational costs.
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Projects ─────────────────────────────────────────────── */}
        <section id="projects" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp className="text-center mb-16">
              <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
                Our Work
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Projects</h2>
              <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
              <p className="mt-4 text-slate-500">Live interactive demos ready for you to test.</p>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {projects.map((proj, i) => {
                const c = projectColorMap[proj.color]
                return (
                  <FadeUp key={proj.title} delay={i * 80}>
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex flex-col bg-white rounded-2xl p-6 border border-slate-200 card-hover ${c.ring}`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div
                          className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center ${c.text} text-lg ${c.hoverBg} ${c.hoverText} transition-colors`}
                        >
                          <proj.icon className="w-5 h-5" />
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Live
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{proj.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{proj.desc}</p>
                      <span className={`${c.text} font-semibold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all`}>
                        Try Now <ArrowRight className="w-3 h-3" />
                      </span>
                    </a>
                  </FadeUp>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Industries ───────────────────────────────────────────── */}
        <section id="industries" className="py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-10">
                Industries We Serve
              </h2>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {industries.map((ind, i) => (
                <FadeUp key={ind.label} delay={i * 60}>
                  <div className="bg-white p-6 rounded-xl border border-slate-100 text-center shadow-sm hover:shadow-md transition-shadow">
                    <ind.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-700 text-sm">{ind.label}</h3>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ────────────────────────────────────────────────── */}
        <section id="about" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp className="text-center">
              <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Driven by Innovation, Built for Impact
              </h2>
              <div className="w-12 h-1 bg-primary mx-auto rounded-full mb-8" />
              <p className="text-base text-slate-500 leading-relaxed max-w-3xl mx-auto">
Results driven Machine Learning Operations Engineer with experience in designing, deploying, and improving AI systems and web applications. Skilled in building AI agents and integrating AI into real world solutions

Proficient in Python, Flask, Django, and FastAPI, with experience deploying applications on Ubuntu virtual machines. Experienced in backend development, including REST APIs, WebSockets, and real-time systems, with basic frontend integration skills.

Interested in workflow automation, deploying AI models on high-VRAM GPUs, and building scalable solutions that deliver real business value.
              </p>

              <div className="flex flex-wrap justify-center gap-8 mt-12">
                {[
                  { num: '14+', label: 'AI Projects Deployed' },
                  { num: '3+', label: 'Years Experience' },
                  { num: '100%', label: 'Client Satisfaction' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-extrabold text-primary">{stat.num}</div>
                    <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Ratings ──────────────────────────────────────────────── */}
        <section id="ratings" className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp className="text-center mb-16">
              <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Client Feedback</h2>
              <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[160px]">
              {ratingsLoading ? (
                <>
                  <div className="animate-pulse bg-white p-6 rounded-2xl border border-slate-100 h-40">
                    <div className="flex justify-between mb-4"><div className="h-4 bg-slate-200 rounded w-1/3"></div><div className="h-4 bg-slate-200 rounded w-1/4"></div></div>
                    <div className="h-3 bg-slate-200 rounded w-full mb-2"></div><div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  </div>
                  <div className="animate-pulse bg-white p-6 rounded-2xl border border-slate-100 h-40 hidden md:block">
                    <div className="flex justify-between mb-4"><div className="h-4 bg-slate-200 rounded w-1/3"></div><div className="h-4 bg-slate-200 rounded w-1/4"></div></div>
                    <div className="h-3 bg-slate-200 rounded w-full mb-2"></div><div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </>
              ) : ratings.length === 0 ? (
                <p className="col-span-full text-center text-slate-400 py-8">No ratings yet.</p>
              ) : (
                ratings.map((r) => (
                  <FadeUp key={r.id}>
                    <article className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-50">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                          <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <User className="w-3.5 h-3.5" />
                          </span>
                          {r.name || 'Anonymous'}
                        </h3>
                        <span className="text-yellow-400 text-xs tracking-widest">
                          {'⭐'.repeat(Math.min(Math.max(r.stars || 5, 1), 5))}
                        </span>
                      </div>
                      {(r.email || r.phone) && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-slate-400">
                          {r.email && <span className="flex items-center gap-1.5"><Mail className="w-2.5 h-2.5 text-slate-300" />{r.email}</span>}
                          {r.phone && <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 text-slate-300 flex items-center justify-center">📞</span><span dir="ltr">{r.phone}</span></span>}
                        </div>
                      )}
                      {r.comment && <p className="text-slate-500 text-sm leading-relaxed italic">"{r.comment}"</p>}
                    </article>
                  </FadeUp>
                ))
              )}
            </div>

            <FadeUp className="text-center mt-10">
              <a
                href="/rate-us"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary rounded-full px-6 py-3 hover:bg-primary hover:text-white transition-all duration-200 group"
              >
                Rate Us?
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </FadeUp>
          </div>
        </section>

        {/* ── CTA Banner ──────────────────────────────────────────── */}
        <section className="py-20 bg-dark text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                Let's discuss how AI can streamline your operations, reduce costs, and unlock new opportunities.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Get in Touch <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 px-8 py-3.5 rounded-full font-semibold transition-colors"
                >
                  View Demos <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────── */}
        <section id="contact" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp className="text-center mb-12">
              <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
                Get in Touch
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Connect With Us</h2>
              <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
            </FadeUp>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Mail, label: 'Email', href: 'mailto:yahyamahroof35@gmail.com', hover: 'hover:border-primary hover:bg-blue-50/50', iconHover: 'group-hover:text-primary' },
                { icon: WhatsappIcon, label: 'WhatsApp', href: 'https://wa.me/+201001866276', hover: 'hover:border-emerald-400 hover:bg-emerald-50/50', iconHover: 'group-hover:text-emerald-500', external: true },
                { icon: LinkedinIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/yahya-mahrouf', hover: 'hover:border-blue-500 hover:bg-blue-50/50', iconHover: 'group-hover:text-blue-600', external: true },
                { icon: GithubIcon, label: 'GitHub', href: 'https://github.com/yayaiu6', hover: 'hover:border-slate-700 hover:bg-slate-100/50', iconHover: 'group-hover:text-slate-800', external: true },
              ].map((item, i) => (
                <FadeUp key={item.label} delay={i * 80}>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={`flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-xl transition-all group ${item.hover}`}
                  >
                    <item.icon className={`w-5 h-5 text-slate-400 mb-3 transition-colors ${item.iconHover}`} />
                    <span className="font-medium text-slate-600 text-sm">{item.label}</span>
                  </a>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-dark text-slate-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-white/[0.06] pb-8">
            <div>
              <p className="text-white font-bold mb-3 text-base">Make The future</p>
              <p className="text-sm leading-relaxed text-slate-400">
                Empowering businesses with practical, scalable, and intelligent AI integrations.
              </p>
            </div>
            <nav aria-label="Footer navigation">
              <p className="text-white font-bold mb-3 text-base">Quick Links</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#projects" className="text-slate-400 hover:text-white transition-colors">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#expertise" className="text-slate-400 hover:text-white transition-colors">
                    Our Expertise
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-slate-400 hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/rate-us" className="text-slate-400 hover:text-white transition-colors">
                    Rate Us
                  </a>
                </li>
              </ul>
            </nav>
            <div>
              <p className="text-white font-bold mb-3 text-base">Connect</p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/yayaiu6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                   <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/yahya-mahrouf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href="mailto:yahyamahroof35@gmail.com"
                  className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
