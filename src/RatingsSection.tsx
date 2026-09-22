import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { User, Star, Mail } from 'lucide-react'
import { FadeUp } from './App'

/* ─── Firebase Config ───────────────────────────────────────────────────── */
const firebaseConfig = {
  apiKey: 'AIzaSyAXofkSy3vfz7GuTgj6-S-rK2rsnUQp_J0',
  authDomain: 'ai-playground-ratings.firebaseapp.com',
  projectId: 'ai-playground-ratings',
  storageBucket: 'ai-playground-ratings.firebasestorage.app',
  messagingSenderId: '112573912701',
  appId: '1:112573912701:web:b381d9c41871025f49c314',
}

let db: ReturnType<typeof getFirestore> | null = null

function getDb() {
  if (!db) {
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  }
  return db
}

/* ─── Rating type ───────────────────────────────────────────────────────── */
interface Rating {
  id: string
  name: string
  stars: number
  comment: string
  email?: string
  phone?: string
  timestamp?: { seconds?: number }
}

/* ─── Ratings Section ───────────────────────────────────────────────────── */
export default function RatingsSection() {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [ratingsLoading, setRatingsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function fetchRatings() {
      setRatingsLoading(true)
      setLoadError(false)
      try {
        const snapshot = await getDocs(collection(getDb(), 'ratings'))
        const items: Rating[] = []
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Rating)
        })
        items.sort((a, b) => (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0))
        if (!cancelled) setRatings(items)
      } catch (err) {
        console.error('Failed to load ratings:', err)
        if (!cancelled) setLoadError(true)
      } finally {
        if (!cancelled) setRatingsLoading(false)
      }
    }
    fetchRatings()
    return () => { cancelled = true }
  }, [retryCount])

  return (
    <section id="ratings" className="section border-y border-[var(--border)] bg-[var(--bg-alt)]">
      <div className="section-wrap">
        <FadeUp className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/[0.06] text-primary text-xs font-semibold tracking-wide mb-5">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight mb-3">Client Feedback</h2>
        </FadeUp>

        <div className="ratings-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 min-h-[140px]">
          {ratingsLoading ? (
            <>
              <div className="animate-pulse bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] h-36">
                <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i => <div key={i} className="w-3 h-3 bg-[var(--border)] rounded-sm" />)}</div>
                <div className="h-3 bg-[var(--border)] rounded w-full mb-2" /><div className="h-3 bg-[var(--border)] rounded w-3/4" />
              </div>
              <div className="animate-pulse bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] h-36 hidden md:block">
                <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i => <div key={i} className="w-3 h-3 bg-[var(--border)] rounded-sm" />)}</div>
                <div className="h-3 bg-[var(--border)] rounded w-full mb-2" /><div className="h-3 bg-[var(--border)] rounded w-3/4" />
              </div>
            </>
          ) : loadError ? (
            <div className="col-span-full flex flex-col items-center gap-3 py-8 text-center" role="alert">
              <p className="text-sm text-[var(--text-muted)]">Client feedback couldn’t be loaded right now.</p>
              <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-alt)]">
                Try again
              </button>
            </div>
          ) : ratings.length === 0 ? (
            <p className="col-span-full text-center text-[var(--text-subtle)] py-8">No ratings yet.</p>
          ) : (
            ratings.map((r) => {
              const email = r.email?.trim()
              const validEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

              return (
              <FadeUp key={r.id}>
                <article className="testimonial-card bg-[var(--bg)] rounded-xl border border-[var(--border-light)] h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.min(Math.max(r.stars || 5, 1), 5) ? 'text-amber-400 fill-amber-400' : 'text-[var(--border)]'}`} />
                    ))}
                  </div>
                  {/* Quote */}
                  {r.comment && (
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed italic flex-1">"{r.comment}"</p>
                  )}
                  <div className="mt-4 pt-3 border-t border-[var(--border-light)]">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-[var(--border-light)] flex items-center justify-center text-[var(--text-subtle)]">
                        <User className="w-3 h-3" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 text-xs font-medium text-[var(--text-subtle)]">{r.name || 'Anonymous'}</span>
                    </div>
                    {validEmail && (
                      <div className="mt-2 grid min-w-0 gap-1 pl-8 text-xs text-[var(--text-muted)]">
                        <a href={`mailto:${email}`} className="flex min-w-0 items-start gap-1.5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span className="min-w-0 break-all">{email}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              </FadeUp>
              )
            })
          )}
        </div>

        <FadeUp className="text-center mt-8">
          <a href="/rate-us.html"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/20 rounded-xl px-5 py-2.5 hover:bg-primary hover:text-white transition-all duration-300">
            Rate Us?
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </FadeUp>
      </div>
    </section>
  )
}
