"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Luxury easing curve
const luxuryEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

// RevealOnScroll component for scroll-triggered animations
function RevealOnScroll({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 1.2, ease: luxuryEase, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Typewriter component
function Typewriter({ text, className = "" }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let i = 0
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(timer)
        }
      }, 50)
      return () => clearInterval(timer)
    }
  }, [isInView, text])

  return (
    <span ref={ref} className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Immersive Section with parallax background
function ImmersiveSection({
  title,
  description,
  bgImage,
  bgColor = "bg-dark-navy",
  textColor = "text-white",
  index = 0,
}: {
  title: string
  description: string
  bgImage?: string
  bgColor?: string
  textColor?: string
  index?: number
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section ref={ref} className={`relative min-h-screen overflow-hidden ${bgColor}`}>
      {bgImage && (
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src={bgImage}
            alt={title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      )}
      <motion.div
        style={{ opacity }}
        className={`relative z-10 flex min-h-screen items-center justify-center px-6 ${textColor}`}
      >
        <div className="max-w-4xl text-center">
          <RevealOnScroll>
            <h2 className="font-serif text-5xl md:text-7xl font-bold mb-8">{title}</h2>
          </RevealOnScroll>
          <RevealOnScroll>
            <p className="text-xl md:text-2xl leading-relaxed opacity-90">{description}</p>
          </RevealOnScroll>
        </div>
      </motion.div>
    </section>
  )
}

// Bento Grid Item Component
function BentoItem({ image, index }: { image: string; index: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.6, ease: luxuryEase }}
      className="group relative w-full h-full overflow-hidden"
    >
      <Image
        src={image}
        alt={`Arc Montenegro ${index + 1}`}
        fill
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-charcoal/0 transition-all duration-500 group-hover:bg-charcoal/30" />

      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold/0 transition-all duration-500 group-hover:border-gold/70" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gold/0 transition-all duration-500 group-hover:border-gold/70" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gold/0 transition-all duration-500 group-hover:border-gold/70" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold/0 transition-all duration-500 group-hover:border-gold/70" />

      {/* View indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-12 h-12 rounded-full border border-white/60 flex items-center justify-center backdrop-blur-sm">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

// Gallery Slides Component - Premium fullscreen slideshow
function GallerySlides({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "-20%" })

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !isInView) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, isInView, images.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section id="gallery" ref={ref} className="relative h-screen bg-charcoal overflow-hidden">
      {/* Background Images with Crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: luxuryEase }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`Arc Montenegro ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-charcoal/30" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l border-t border-gold/30 z-10" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r border-t border-gold/30 z-10" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l border-b border-gold/30 z-10" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r border-b border-gold/30 z-10" />

      {/* Header */}
      <div className="absolute top-12 left-0 right-0 z-20 text-center">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-2 font-light">Visual Journey</p>
        <h2 className="font-serif text-3xl md:text-4xl text-white font-normal">Gallery</h2>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all duration-300 group"
      >
        <svg className="w-5 h-5 text-white/70 group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 flex items-center justify-center hover:border-gold hover:bg-gold/10 transition-all duration-300 group"
      >
        <svg className="w-5 h-5 text-white/70 group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute bottom-12 left-12 z-20 text-white/60 font-light text-sm tracking-widest">
        <span className="text-gold text-2xl font-serif">{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="mx-2">/</span>
        <span>{String(images.length).padStart(2, '0')}</span>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.slice(0, 12).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-[2px] transition-all duration-500 ${
              idx === currentIndex % 12
                ? "bg-gold w-8"
                : "bg-white/30 w-4 hover:bg-white/50"
            }`}
          />
        ))}
        {images.length > 12 && (
          <span className="text-white/40 text-xs ml-2">+{images.length - 12}</span>
        )}
      </div>

      {/* Thumbnail Preview */}
      <div className="absolute bottom-12 right-12 z-20 hidden lg:flex gap-2">
        {[-1, 0, 1].map((offset) => {
          const idx = (currentIndex + offset + images.length) % images.length
          return (
            <motion.button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`relative w-16 h-10 overflow-hidden border transition-all duration-300 ${
                offset === 0 ? "border-gold" : "border-white/20 hover:border-white/50"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={images[idx]}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
              {offset !== 0 && <div className="absolute inset-0 bg-charcoal/50" />}
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}

// Animated Logo Component - Moves from hero center to navbar on scroll
function AnimatedLogo({ isScrolled, targetRef }: { isScrolled: boolean; targetRef: React.RefObject<HTMLDivElement | null> }) {
  const [targetPos, setTargetPos] = useState({ top: 16, left: 32 })

  useEffect(() => {
    const updatePosition = () => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect()
        // Center the logo within the placeholder
        setTargetPos({
          top: rect.top + (rect.height * 0.65),
          left: rect.left + (rect.width / 2)
        })
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [targetRef])

  return (
    <motion.div
      className="fixed z-[60] pointer-events-none"
      initial={{
        top: "38%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        scale: 1
      }}
      animate={isScrolled ? {
        top: targetPos.top,
        left: targetPos.left,
        x: "-50%",
        y: "-50%",
        scale: 0.5
      } : {
        top: "38%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        scale: 1
      }}
      transition={{ duration: 0.6, ease: luxuryEase }}
    >
      <motion.div
        animate={!isScrolled ? { y: [0, -8, 0] } : { y: 0 }}
        transition={{ duration: 4, repeat: !isScrolled ? Infinity : 0, ease: "easeInOut" }}
      >
        <Image
          src="/images/arc logo.png"
          alt="Arc Logo"
          width={200}
          height={110}
          className={`drop-shadow-2xl transition-all duration-500 ${
            isScrolled ? "brightness-0" : "brightness-0 invert"
          }`}
          priority
        />
      </motion.div>
    </motion.div>
  )
}

// Hero Slideshow Component - Premium Luxury Version
function HeroSlideshow({
  heroRef,
  heroOpacity,
  heroScale,
  heroY
}: {
  heroRef: React.RefObject<HTMLElement | null>
  heroOpacity: any
  heroScale: any
  heroY: any
}) {
  const heroImages = [
    "/images/DJI_20250920172433_0082_D.JPG",
    "/images/DJI_20250920152921_0049_D.JPG",
    "/images/DJI_20250927125006_0168_D.JPG",
    "/images/DJI_20250927130020_0173_D.JPG",
    "/images/DJI_20251001141027_0186_D.JPG",
    "/images/DJI_20251001152753_0190_D.JPG",
    "/images/DJI_20251001193449_0220_D.JPG",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden bg-charcoal">
      {/* Background Images with Cinematic Crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: luxuryEase }}
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[currentIndex]}
            alt="Arc Montenegro"
            fill
            className="object-cover"
            priority
          />
          {/* Premium overlay with subtle vignette effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-gold/30 z-20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-gold/30 z-20" />
      <div className="absolute bottom-32 left-8 w-16 h-16 border-l border-b border-gold/30 z-20" />
      <div className="absolute bottom-32 right-8 w-16 h-16 border-r border-b border-gold/30 z-20" />

      {/* Content Overlay - Logo animated above this content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
        {/* Spacer for logo above */}
        <div className="h-32 md:h-40" />

        {/* Premium Title with refined typography */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: luxuryEase }}
          className="overflow-hidden"
        >
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal mb-6 tracking-wide">
            <span className="inline-block">Ârc</span>{" "}
            <span className="inline-block font-light">Montenegro</span>
          </h1>
        </motion.div>

        {/* Gold accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: luxuryEase }}
          className="w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-6"
        />

        {/* Refined Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1, ease: luxuryEase }}
          className="text-sm md:text-base max-w-xl text-platinum font-light tracking-[0.35em] uppercase"
        >
          A new foundation for the world
        </motion.p>
      </div>

      {/* Premium Slide Indicators */}
      <div className="absolute bottom-28 left-0 right-0 flex justify-center gap-3 z-20">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-[2px] transition-all duration-500 ease-out ${
              idx === currentIndex
                ? "bg-gold w-12"
                : "bg-white/30 w-6 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Elegant Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
        className="absolute bottom-10 left-0 right-0 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3 text-platinum/60"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-light">Discover</span>
          <div className="w-px h-8 bg-gradient-to-b from-platinum/40 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const logoTargetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"])

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on scroll
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const journeySteps = [
    { numeral: "I", title: "Discover", description: "Begin your journey into a world of limitless possibility", image: "/images/IMG_2204.JPG" },
    { numeral: "II", title: "Connect", description: "Join a community of visionaries and pioneers", image: "/images/IMG_2310.JPG" },
    { numeral: "III", title: "Create", description: "Build the future you've always imagined", image: "/images/IMG_2369.JPG" },
    { numeral: "IV", title: "Ascend", description: "Rise to new heights of achievement and fulfillment", image: "/images/DJI_20251001193449_0220_D.JPG" },
  ]

  const pillars = [
    {
      title: "Live",
      description: "Luxury residences designed for the modern pioneer. Where comfort meets innovation.",
      image: "/images/IMG_2314.JPG",
    },
    {
      title: "Work",
      description: "State-of-the-art facilities for the builders of tomorrow. Your ideas deserve the best.",
      image: "/images/IMG_2482.JPG",
    },
    {
      title: "Play",
      description: "World-class amenities and experiences. Life is meant to be extraordinary.",
      image: "/images/IMG_2375.JPG",
    },
  ]

  const galleryImages = [
    "/images/DJI_20250920152921_0049_D.JPG",
    "/images/DJI_20250920172433_0082_D.JPG",
    "/images/DJI_20250927125006_0168_D.JPG",
    "/images/DJI_20250927130020_0173_D.JPG",
    "/images/DJI_20250927130039_0175_D.JPG",
    "/images/DJI_20251001141027_0186_D.JPG",
    "/images/DJI_20251001152753_0190_D.JPG",
    "/images/DJI_20251001193449_0220_D.JPG",
    "/images/IMG_1976.JPG",
    "/images/IMG_1981.JPG",
    "/images/IMG_1999.JPG",
    "/images/IMG_2204.JPG",
    "/images/IMG_2310.JPG",
    "/images/IMG_2313.JPG",
    "/images/IMG_2314.JPG",
    "/images/IMG_2319.JPG",
    "/images/IMG_2348.JPG",
    "/images/IMG_2369.JPG",
    "/images/IMG_2375.JPG",
    "/images/IMG_2482.JPG",
    "/images/IMG_2539.JPG",
    "/images/IMG_2604.JPG",
  ]

  return (
    <main className="bg-cream">
      {/* Animated Logo - Moves from hero center to navbar on scroll */}
      <AnimatedLogo isScrolled={isScrolled} targetRef={logoTargetRef} />

      {/* Premium Sticky Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-cream/95 backdrop-blur-xl py-4"
            : "bg-transparent py-8"
        }`}
        style={{
          boxShadow: isScrolled ? "0 1px 0 rgba(180, 150, 100, 0.1)" : "none"
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Placeholder for logo space - actual logo is animated separately */}
          <div ref={logoTargetRef} className="w-[80px] h-[44px] sm:w-[100px] sm:h-[55px]" />

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center gap-12 ${isScrolled ? "text-charcoal" : "text-white"}`}>
            {[
              { href: "#story", label: "Story" },
              { href: "#journey", label: "Journey" },
              { href: "#pillars", label: "Pillars" },
              { href: "#gallery", label: "Gallery" },
              { href: "#contact", label: "Contact" }
            ].map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i, ease: luxuryEase }}
                className="relative text-xs font-light tracking-[0.2em] uppercase group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-500 group-hover:w-full" />
              </motion.a>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 ${isScrolled ? "text-charcoal" : "text-white"}`}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-px bg-current origin-center transition-colors"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-px bg-current transition-colors"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-px bg-current origin-center transition-colors"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-charcoal/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative h-full flex flex-col items-center justify-center gap-8"
            >
              {[
                { href: "#story", label: "Story" },
                { href: "#journey", label: "Journey" },
                { href: "#pillars", label: "Pillars" },
                { href: "#gallery", label: "Gallery" },
                { href: "#contact", label: "Contact" }
              ].map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  className="text-white text-2xl font-serif font-light tracking-wider hover:text-gold transition-colors duration-300"
                >
                  {item.label}
                </motion.a>
              ))}

              {/* Decorative element */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 w-16 h-px bg-gold/50"
              />
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Cinematic Image Slideshow */}
      <HeroSlideshow heroRef={heroRef} heroOpacity={heroOpacity} heroScale={heroScale} heroY={heroY} />

      {/* Premium Tagline Section */}
      <section className="relative py-40 bg-cream overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <Image
            src="/images/DJI_20250927130020_0173_D.JPG"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-gold/40 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-8 text-center">
          <RevealOnScroll>
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-8 font-light">The Promise</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-charcoal leading-[1.1] font-normal">
              <Typewriter text="Live, work & play like never before." />
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <div className="mt-12 w-20 h-px bg-gold/30 mx-auto" />
          </RevealOnScroll>
        </div>
      </section>

      {/* Condensed Story Sections */}
      <section id="story" className="py-32 bg-charcoal">
        <div className="max-w-7xl mx-auto px-8">
          <RevealOnScroll className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6 font-light">Our Vision</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 font-normal">The Ecosystem</h2>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Network School",
                description: "An innovative educational ecosystem where the brightest minds converge. Learn from industry leaders and shape the future.",
                image: "/images/IMG_2604.JPG"
              },
              {
                title: "NS Pop-up City",
                description: "A dynamic urban laboratory where ideas become reality. Experience sustainable living and community-driven innovation.",
                image: "/images/DJI_20250920152921_0049_D.JPG"
              },
              {
                title: "Ascend",
                description: "Elevate your potential in an environment designed for excellence. Where ambition meets opportunity.",
                image: "/images/DJI_20251001141027_0186_D.JPG"
              }
            ].map((item, index) => (
              <RevealOnScroll key={item.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.5, ease: luxuryEase }}
                  className="group relative h-[400px] overflow-hidden"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />

                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-gold/40 transition-all duration-500 group-hover:w-12 group-hover:h-12" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-gold/40 transition-all duration-500 group-hover:w-12 group-hover:h-12" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="w-8 h-px bg-gold mb-4 transition-all duration-500 group-hover:w-12" />
                    <h3 className="font-serif text-2xl md:text-3xl text-white mb-3 font-normal">{item.title}</h3>
                    <p className="text-platinum/70 text-sm font-light leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Journey Section */}
      <section id="journey" className="py-40 bg-cream">
        <div className="max-w-7xl mx-auto px-8">
          <RevealOnScroll className="text-center mb-24">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6 font-light">Your Path</p>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-charcoal mb-8 font-normal">The Journey</h2>
            <p className="text-lg text-charcoal/60 max-w-xl mx-auto font-light leading-relaxed">
              Four transformative stages toward an extraordinary life
            </p>
          </RevealOnScroll>
          <div className="grid md:grid-cols-4 gap-6 lg:gap-8">
            {journeySteps.map((step, index) => (
              <RevealOnScroll key={step.numeral} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.5, ease: luxuryEase }}
                  className="group bg-white border border-charcoal/5 overflow-hidden"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/20 to-transparent" />
                    <span className="absolute bottom-4 left-6 font-serif text-5xl text-white/90 font-light">{step.numeral}</span>
                  </div>
                  <div className="p-8">
                    <div className="w-8 h-px bg-gold mb-6 transition-all duration-500 group-hover:w-12" />
                    <h3 className="font-serif text-2xl text-charcoal mb-4 font-normal">{step.title}</h3>
                    <p className="text-charcoal/60 text-sm font-light leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Pillars Section */}
      <section id="pillars" className="py-40 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-8">
          <RevealOnScroll className="text-center mb-24">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6 font-light">Foundation</p>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-8 font-normal">Three Pillars</h2>
            <p className="text-lg text-platinum/70 max-w-xl mx-auto font-light leading-relaxed">
              The cornerstone of an extraordinary life
            </p>
          </RevealOnScroll>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {pillars.map((pillar, index) => (
              <RevealOnScroll key={pillar.title} delay={index * 0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.6, ease: luxuryEase }}
                  className="group relative overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-[400px] overflow-hidden">
                    <Image
                      src={pillar.image}
                      alt={pillar.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

                    {/* Gold corner accent */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-gold/40 transition-all duration-500 group-hover:w-16 group-hover:h-16" />
                    <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-gold/40 transition-all duration-500 group-hover:w-16 group-hover:h-16" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="w-8 h-px bg-gold mb-6 transition-all duration-500 group-hover:w-14" />
                    <h3 className="font-serif text-4xl mb-4 font-normal tracking-wide">{pillar.title}</h3>
                    <p className="text-platinum/70 font-light leading-relaxed text-sm">{pillar.description}</p>
                  </div>
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* The Vision - Minimalist Luxury with Green */}
      <section className="relative py-48 md:py-64 bg-[#1a3a2f] overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gold/30" />

        <div className="max-w-5xl mx-auto px-8">
          <RevealOnScroll className="text-center">
            {/* Minimal label */}
            <span className="inline-block text-gold/70 text-[10px] tracking-[0.5em] uppercase font-light mb-12">
              The Vision
            </span>

            {/* Hero statement */}
            <h2 className="font-serif text-4xl md:text-6xl lg:text-8xl text-white font-normal leading-[1.1] tracking-tight">
              Where Vision
              <br />
              <span className="text-gold">Meets Reality</span>
            </h2>

            {/* Elegant separator */}
            <div className="mt-16 flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-white/20" />
              <div className="w-2 h-2 rotate-45 border border-gold/50" />
              <div className="w-12 h-px bg-white/20" />
            </div>
          </RevealOnScroll>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gold/30" />
      </section>

      {/* Premium Gallery Slides Section */}
      <GallerySlides images={galleryImages} />

      {/* Ultra-Luxury CTA Section - Ascend & Liberate (Mobile-First) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,20,30,0.3)_100%)]" />

        {/* Animated floating particles - hidden on mobile for performance */}
        <div className="hidden sm:block">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold/30 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            />
          ))}
        </div>

        {/* Premium animated corner accents - responsive sizing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: luxuryEase }}
          className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-16 md:left-16 w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 border-l border-t sm:border-l-2 sm:border-t-2 border-gold/30 sm:border-gold/40"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: luxuryEase, delay: 0.1 }}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 md:top-16 md:right-16 w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 border-r border-t sm:border-r-2 sm:border-t-2 border-gold/30 sm:border-gold/40"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: luxuryEase, delay: 0.2 }}
          className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 md:bottom-16 md:left-16 w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 border-l border-b sm:border-l-2 sm:border-b-2 border-gold/30 sm:border-gold/40"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: luxuryEase, delay: 0.3 }}
          className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 md:bottom-16 md:right-16 w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 border-r border-b sm:border-r-2 sm:border-b-2 border-gold/30 sm:border-gold/40"
        />

        {/* Animated center frame - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="hidden sm:block absolute inset-12 sm:inset-20 md:inset-32 lg:inset-40 border border-gold/15 sm:border-gold/20"
          style={{ boxShadow: "inset 0 0 100px rgba(180, 150, 100, 0.05)" }}
        />

        {/* Vertical accent lines - shorter on mobile */}
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "60px" }}
          transition={{ duration: 1.5, ease: luxuryEase }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent sm:hidden"
        />
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "120px" }}
          transition={{ duration: 1.5, ease: luxuryEase }}
          className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent"
        />
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "60px" }}
          transition={{ duration: 1.5, ease: luxuryEase, delay: 0.3 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-t from-transparent via-gold/40 to-transparent sm:hidden"
        />
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "120px" }}
          transition={{ duration: 1.5, ease: luxuryEase, delay: 0.3 }}
          className="hidden sm:block absolute bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-t from-transparent via-gold/40 to-transparent"
        />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 text-center">
          {/* Animated top ornament - simplified on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: luxuryEase }}
            className="flex items-center justify-center gap-4 sm:gap-8 mb-10 sm:mb-16 md:mb-20"
          >
            <motion.div
              animate={{ scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 sm:w-3 sm:h-3 border border-gold/60 rotate-45"
            />
            <motion.div
              animate={{ scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 sm:w-20 md:w-24 h-px bg-gradient-to-l from-transparent via-gold/50 to-transparent"
            />
          </motion.div>

          {/* Premium animated label */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: luxuryEase }}
            className="inline-block text-gold/80 text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] uppercase font-light mb-6 sm:mb-10 md:mb-12"
          >
            Your Future Awaits
          </motion.span>

          {/* Staggered headline animation - stacked on mobile */}
          <div className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-normal leading-[1.1] sm:leading-[1] tracking-tight mb-8 sm:mb-12 md:mb-14">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: luxuryEase, delay: 0.2 }}
              className="block sm:inline-block text-white"
            >
              Ascend
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: luxuryEase, delay: 0.5 }}
              className="inline-block text-gold/40 mx-2 sm:mx-4 md:mx-6 font-extralight"
            >
              &
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: luxuryEase, delay: 0.7 }}
              className="block sm:inline-block text-gold"
            >
              Liberate
            </motion.span>
          </div>

          {/* Animated diamond separator with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: luxuryEase, delay: 0.9 }}
            className="flex items-center justify-center gap-3 sm:gap-6 mb-8 sm:mb-12 md:mb-14"
          >
            <div className="w-16 sm:w-24 md:w-32 h-px bg-gradient-to-r from-transparent to-white/20" />
            <motion.div
              animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="w-3 h-3 sm:w-4 sm:h-4 border sm:border-2 border-gold/70 rotate-45"
              style={{ boxShadow: "0 0 20px rgba(180, 150, 100, 0.3)" }}
            />
            <div className="w-16 sm:w-24 md:w-32 h-px bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>

          {/* Description with staggered lines */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mb-10 sm:mb-16 md:mb-20"
          >
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-platinum/60 max-w-3xl mx-auto font-light leading-relaxed tracking-wide px-2 sm:px-0">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="block"
              >
                Join a community of visionaries shaping the future.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="block mt-1 sm:mt-2 text-platinum/80"
              >
                Your journey to extraordinary begins now.
              </motion.span>
            </p>
          </motion.div>

          {/* Ultra-Premium CTA button - full width on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="px-4 sm:px-0"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.4, ease: luxuryEase }}
              className="group relative w-full sm:w-auto bg-transparent border sm:border-2 border-gold/70 text-gold px-8 sm:px-16 md:px-20 py-4 sm:py-5 md:py-6 font-light text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] uppercase overflow-hidden transition-all duration-1000 hover:border-gold hover:text-charcoal"
              style={{ boxShadow: "0 0 30px rgba(180, 150, 100, 0.1)" }}
            >
              {/* Animated background fill */}
              <span className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out" />
              {/* Shimmer effect - hidden on mobile */}
              <span className="hidden sm:block absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-300" />
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-4">
                Begin Your Journey
                <motion.svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </span>
            </motion.button>
          </motion.div>

          {/* Bottom animated ornament */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="flex items-center justify-center gap-3 sm:gap-4 mt-12 sm:mt-20 md:mt-24"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gold/50 rotate-45"
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium Newsletter Section */}
      <section id="contact" className="py-40 bg-cream">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <RevealOnScroll>
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6 font-light">Stay Informed</p>
            <h2 className="font-serif text-3xl md:text-5xl text-charcoal mb-8 font-normal">Stay Connected</h2>
            <p className="text-charcoal/60 mb-12 font-light leading-relaxed max-w-xl mx-auto">
              Be the first to know about exclusive opportunities and updates from Arc Montenegro.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white border border-charcoal/10 text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold/50 font-light transition-colors duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgb(160, 130, 80)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-gold text-white px-10 py-4 font-light text-sm tracking-[0.15em] uppercase transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </form>
          </RevealOnScroll>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-24 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-8">
          {/* Top section with logo and tagline */}
          <div className="flex flex-col items-center mb-20">
            <Image
              src="/images/arc logo.png"
              alt="Arc Montenegro"
              width={120}
              height={40}
              className="brightness-0 invert mb-8"
            />
            <p className="text-platinum/50 text-xs tracking-[0.3em] uppercase font-light">
              A new foundation for the world
            </p>
          </div>

          {/* Navigation grid */}
          <div className="grid md:grid-cols-4 gap-12 lg:gap-20 mb-20">
            <div>
              <h4 className="text-gold text-xs tracking-[0.3em] uppercase mb-8 font-light">Explore</h4>
              <ul className="space-y-4">
                {["Our Story", "The Journey", "Three Pillars", "Gallery"].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-platinum/60 text-sm font-light hover:text-gold transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gold text-xs tracking-[0.3em] uppercase mb-8 font-light">Connect</h4>
              <ul className="space-y-4">
                {["Twitter", "Instagram", "LinkedIn", "Discord"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-platinum/60 text-sm font-light hover:text-gold transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gold text-xs tracking-[0.3em] uppercase mb-8 font-light">Contact</h4>
              <ul className="space-y-4 text-platinum/60 text-sm font-light">
                <li>hello@thearccity.com</li>
                <li>Montenegro, Europe</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gold text-xs tracking-[0.3em] uppercase mb-8 font-light">Legal</h4>
              <ul className="space-y-4">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-platinum/60 text-sm font-light hover:text-gold transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-platinum/40 text-xs font-light tracking-wider">
              &copy; 2025 Arc Montenegro. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              {/* Social icons placeholder */}
              <div className="flex gap-6">
                {["twitter", "instagram", "linkedin"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-8 h-8 border border-platinum/20 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all duration-300 text-platinum/40"
                  >
                    <span className="text-xs uppercase">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
