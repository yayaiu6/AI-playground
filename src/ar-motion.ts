import { animate, createAnimatable, spring } from 'animejs'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

const hero = document.querySelector<HTMLElement>('.hero')
const artwork = document.querySelector<HTMLElement>('.hero-art__motion')
const core = document.querySelector<HTMLElement>('.hero-art__core-depth')

if (hero && artwork && core) {
  let heroVisible = false
  const springEase = spring({ bounce: 0.08, duration: 260 })
  const artworkMotion = createAnimatable(artwork, {
    x: { duration: 260, ease: springEase },
    y: { duration: 260, ease: springEase },
    rotateX: { unit: 'deg', duration: 260, ease: springEase },
    rotateY: { unit: 'deg', duration: 260, ease: springEase },
  })
  const coreMotion = createAnimatable(core, {
    z: { duration: 360, ease: 'out(3)' },
    scale: { duration: 360, ease: 'out(3)' },
  })

  const reset = (immediate = false) => {
    const duration = immediate ? 0 : undefined
    artworkMotion.x(0, duration).y(0, duration).rotateX(0, duration).rotateY(0, duration)
    coreMotion.z(0, duration).scale(1, duration)
  }
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting
    if (!heroVisible) reset()
  }, { threshold: 0.01 })
  visibilityObserver.observe(hero)

  const onPointerMove = (event: PointerEvent) => {
    if (!heroVisible) return
    const x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth - 0.5) * 2))
    const y = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight - 0.5) * 2))
    const center = 1 - Math.min(1, Math.hypot(x, y) / Math.SQRT2)
    artworkMotion.x(x * 32).y(y * 24).rotateX(-y * 10).rotateY(x * 14)
    coreMotion.z(8 + center * 12).scale(1 + center * 0.025)
  }
  const resetOnLeave = () => reset()
  const syncPointerMotion = () => {
    window.removeEventListener('pointermove', onPointerMove)
    document.documentElement.removeEventListener('pointerleave', resetOnLeave)
    window.removeEventListener('blur', resetOnLeave)

    if (finePointer.matches && !reducedMotion.matches) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', resetOnLeave, { passive: true })
      window.addEventListener('blur', resetOnLeave)
    } else {
      reset(true)
    }
  }
  syncPointerMotion()
  finePointer.addEventListener('change', syncPointerMotion)
  reducedMotion.addEventListener('change', syncPointerMotion)
}

const counters = [...document.querySelectorAll<HTMLElement>('[data-counter]')]
const counterAnimations = new Map<HTMLElement, ReturnType<typeof animate>>()
const animatedCounters = new WeakSet<HTMLElement>()
const arabicDigits = '٠١٢٣٤٥٦٧٨٩'
const toArabicDigits = (value: number) => String(value).replace(/\d/g, (digit) => arabicDigits[Number(digit)])

const showFinalCounter = (counter: HTMLElement) => {
  counterAnimations.get(counter)?.cancel()
  const value = counter.querySelector<HTMLElement>('.counter-value')
  if (value) value.textContent = toArabicDigits(Number(counter.dataset.counter))
}

const startCounter = (counter: HTMLElement) => {
  if (animatedCounters.has(counter)) return
  animatedCounters.add(counter)
  const valueElement = counter.querySelector<HTMLElement>('.counter-value')
  const value = Number(counter.dataset.counter)
  if (!valueElement || !Number.isFinite(value)) return
  if (reducedMotion.matches) {
    showFinalCounter(counter)
    return
  }

  const current = { value: 0 }
  valueElement.textContent = '٠'
  const animation = animate(current, {
    value,
    duration: 1600,
    ease: 'outExpo',
    onUpdate: () => { valueElement.textContent = toArabicDigits(Math.floor(current.value)) },
    onComplete: () => { valueElement.textContent = toArabicDigits(value) },
  })
  counterAnimations.set(counter, animation)
}

if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      counterObserver.unobserve(entry.target)
      startCounter(entry.target as HTMLElement)
    }
  }, { threshold: 0.35 })
  counters.forEach((counter) => counterObserver.observe(counter))
} else {
  counters.forEach(startCounter)
}

reducedMotion.addEventListener('change', () => {
  if (!reducedMotion.matches) return
  counters.forEach((counter) => {
    animatedCounters.add(counter)
    showFinalCounter(counter)
  })
})

const projectVisuals = [...document.querySelectorAll<HTMLElement>('.project-visual')]
if ('IntersectionObserver' in window) {
  const previewObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.classList.toggle('is-visible', isIntersecting)
    })
  }, { threshold: 0.1 })
  projectVisuals.forEach((preview) => previewObserver.observe(preview))
} else {
  projectVisuals.forEach((preview) => preview.classList.add('is-visible'))
}

const feedbackSection = document.querySelector<HTMLElement>('#feedback')
const loadArabicTestimonials = async () => {
  try {
    const { renderArabicTestimonials } = await import('./ar-testimonials')
    await renderArabicTestimonials()
  } catch (error) {
    console.error('تعذّر تحميل آراء العملاء:', error)
    const status = document.querySelector<HTMLElement>('[data-testimonials-status]')
    if (status) status.hidden = false
    const grid = document.querySelector<HTMLElement>('[data-testimonials]')
    grid?.setAttribute('aria-busy', 'false')
  }
}
if (feedbackSection && 'IntersectionObserver' in window) {
  const feedbackObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    feedbackObserver.disconnect()
    void loadArabicTestimonials()
  }, { rootMargin: '320px 0px' })
  feedbackObserver.observe(feedbackSection)
} else if (feedbackSection) {
  void loadArabicTestimonials()
}
