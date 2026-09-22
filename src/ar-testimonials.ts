type FirestoreValue = { stringValue?: string; integerValue?: string; doubleValue?: number; timestampValue?: string }
type FirestoreDocument = { fields?: Record<string, FirestoreValue> }
type Rating = { name?: string; stars?: number; comment?: string; email?: string; timestamp?: number }
const projectId = 'ai-playground-ratings'
const apiKey = 'AIzaSyAXofkSy3vfz7GuTgj6-S-rK2rsnUQp_J0'

async function getRatings() {
  const documents: FirestoreDocument[] = []
  let pageToken = ''
  do {
    const params = new URLSearchParams({ key: apiKey, pageSize: '1000' })
    if (pageToken) params.set('pageToken', pageToken)
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/ratings?${params}`)
    if (!response.ok) throw new Error(`Ratings request failed (${response.status})`)
    const page = await response.json() as { documents?: FirestoreDocument[]; nextPageToken?: string }
    documents.push(...(page.documents ?? []))
    pageToken = page.nextPageToken ?? ''
  } while (pageToken)

  return documents.map(({ fields = {} }) => ({
    name: fields.name?.stringValue,
    stars: Number(fields.stars?.integerValue ?? fields.stars?.doubleValue ?? 5),
    comment: fields.comment?.stringValue,
    email: fields.email?.stringValue,
    timestamp: fields.timestamp?.timestampValue ? Date.parse(fields.timestamp.timestampValue) : 0,
  })).sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
}

const element = <K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string) => {
  const node = document.createElement(tag)
  node.className = className
  if (text) node.textContent = text
  return node
}

const icon = (paths: string, className: string) => {
  const wrapper = document.createElement('span')
  wrapper.className = className
  wrapper.setAttribute('aria-hidden', 'true')
  wrapper.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
  return wrapper
}

function createRatingCard(rating: Rating) {
  const card = element('article', 'feedback-card')
  const starsCount = Math.min(Math.max(Number(rating.stars) || 5, 1), 5)
  const stars = element('div', 'stars', `${'★'.repeat(starsCount)}${'☆'.repeat(5 - starsCount)}`)
  stars.setAttribute('aria-label', `${starsCount} من 5 نجوم`)
  card.append(stars)

  if (rating.comment?.trim()) {
    const quote = element('p', 'feedback-quote', `«${rating.comment.trim()}»`)
    quote.dir = 'auto'
    card.append(quote)
  }

  const footer = element('footer', 'feedback-author')
  footer.append(icon('<circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>', 'feedback-author__avatar'))
  const name = element('span', 'feedback-author__name', rating.name?.trim() || 'بدون اسم')
  name.dir = 'auto'
  footer.append(name)

  const email = rating.email?.trim()
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const link = element('a', 'feedback-email')
    link.href = `mailto:${email}`
    link.dir = 'ltr'
    link.append(icon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', 'feedback-email__icon'))
    link.append(element('span', '', email))
    footer.append(link)
  }
  card.append(footer)
  return card
}

export async function renderArabicTestimonials() {
  const grid = document.querySelector<HTMLElement>('[data-testimonials]')
  if (!grid) return

  try {
    const ratings = await getRatings()
    if (ratings.length === 0) {
      grid.setAttribute('aria-busy', 'false')
      return
    }
    const fragment = document.createDocumentFragment()
    ratings.forEach((rating) => fragment.append(createRatingCard(rating)))
    grid.replaceChildren(fragment)
    grid.setAttribute('aria-busy', 'false')
  } catch (error) {
    console.error('تعذّر تحميل آراء العملاء:', error)
    const status = document.querySelector<HTMLElement>('[data-testimonials-status]')
    if (status) status.hidden = false
    grid.setAttribute('aria-busy', 'false')
  }
}
