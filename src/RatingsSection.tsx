import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { Mail, User } from 'lucide-react'
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
}

/* ─── Ratings Section ───────────────────────────────────────────────────── */
export default function RatingsSection() {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [ratingsLoading, setRatingsLoading] = useState(true)

  useEffect(() => {
    async function fetchRatings() {
      try {
        const q = query(collection(getDb(), 'ratings'), orderBy('timestamp', 'desc'), limit(6))
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
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </FadeUp>
      </div>
    </section>
  )
}
