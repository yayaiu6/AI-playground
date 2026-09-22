import { useEffect, useRef } from 'react'
import { createAnimatable, spring } from 'animejs'

export default function HeroBlob() {
  const stageRef = useRef<HTMLDivElement>(null)
  const motionRef = useRef<HTMLDivElement>(null)
  const coreMotionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    const interactionZone = stage?.closest<HTMLElement>('.hero-section')
    const movingArtwork = motionRef.current
    const core = coreMotionRef.current
    if (!stage || !interactionZone || !movingArtwork || !core) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let heroVisible = false
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting
      if (!heroVisible) resetPosition()
    }, { threshold: 0.01 })
    visibilityObserver.observe(interactionZone)

    const springEase = spring({ bounce: 0.08, duration: 260 })
    const artworkMotion = createAnimatable(movingArtwork, {
      x: { duration: 260, ease: springEase },
      y: { duration: 260, ease: springEase },
      rotateX: { unit: 'deg', duration: 260, ease: springEase },
      rotateY: { unit: 'deg', duration: 260, ease: springEase },
    })
    const coreMotion = createAnimatable(core, {
      z: { duration: 360, ease: 'out(3)' },
      scale: { duration: 360, ease: 'out(3)' },
    })

    const updatePosition = (event: PointerEvent) => {
      if (!heroVisible) return
      const x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth - 0.5) * 2))
      const y = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight - 0.5) * 2))
      const center = 1 - Math.min(1, Math.hypot(x, y) / Math.SQRT2)

      artworkMotion.x(x * 32).y(y * 24).rotateX(-y * 10).rotateY(x * 14)
      coreMotion.z(8 + center * 12).scale(1 + center * 0.025)
    }

    const resetPosition = (immediate = false) => {
      const duration = immediate ? 0 : undefined
      artworkMotion.x(0, duration).y(0, duration).rotateX(0, duration).rotateY(0, duration)
      coreMotion.z(0, duration).scale(1, duration)
    }
    const handlePointerLeave = () => resetPosition()

    const syncPointerMotion = () => {
      if (finePointer.matches && !reducedMotion.matches) {
        window.addEventListener('pointermove', updatePosition, { passive: true })
        document.documentElement.addEventListener('pointerleave', handlePointerLeave, { passive: true })
        window.addEventListener('blur', handlePointerLeave)
      } else {
        window.removeEventListener('pointermove', updatePosition)
        document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
        window.removeEventListener('blur', handlePointerLeave)
        resetPosition(true)
      }
    }

    syncPointerMotion()
    finePointer.addEventListener('change', syncPointerMotion)
    reducedMotion.addEventListener('change', syncPointerMotion)
    return () => {
      finePointer.removeEventListener('change', syncPointerMotion)
      reducedMotion.removeEventListener('change', syncPointerMotion)
      visibilityObserver.disconnect()
      window.removeEventListener('pointermove', updatePosition)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('blur', handlePointerLeave)
      artworkMotion.revert()
      coreMotion.revert()
    }
  }, [])

  return (
      <div ref={stageRef} className="hero-art" aria-hidden="true">
      <div className="hero-art__halo" />
      <div ref={motionRef} className="hero-art__motion">
        <div className="hero-art__orbit hero-art__orbit--one" />
        <div className="hero-art__orbit hero-art__orbit--two" />
        <div ref={coreMotionRef} className="hero-art__core-depth">
          <div className="hero-art__core">
            <img className="hero-art__logo" src="/yayaiu6_logo.png" alt="" width="294" height="190" decoding="async" />
          </div>
        </div>
        <span className="hero-art__node hero-art__node--one" />
        <span className="hero-art__node hero-art__node--two" />
        <span className="hero-art__node hero-art__node--three" />
      </div>
    </div>
  )
}
