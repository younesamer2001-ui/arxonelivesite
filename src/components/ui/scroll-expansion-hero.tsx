'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image' | 'component';
  mediaSrc?: string;
  posterSrc?: string;
  bgGradient?: string;
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  scrollToExpand?: string;
  badge?: ReactNode;
  mediaComponent?: ReactNode;
  children?: ReactNode;
}

const ScrollExpandMedia = ({ mediaType = 'component', mediaSrc, posterSrc, bgGradient, title, titleAccent, subtitle, scrollToExpand, badge, mediaComponent, children }: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [winW, setWinW] = useState(1200);
  const [winH, setWinH] = useState(800);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setScrollProgress(0); setShowContent(false); setMediaFullyExpanded(false); }, [mediaType]);

  useEffect(() => {
    const update = () => {
      setWinW(window.innerWidth);
      setWinH(window.innerHeight);
      setIsMobile(window.innerWidth < 768);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false); e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const next = Math.min(Math.max(scrollProgress + e.deltaY * 0.0008, 0), 1);
        setScrollProgress(next);
        if (next >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
          setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        } else if (next < 0.75) {
          setShowContent(false);
        }
      }
    };
    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false); e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const next = Math.min(Math.max(scrollProgress + deltaY * (deltaY < 0 ? 0.006 : 0.004), 0), 1);
        setScrollProgress(next);
        if (next >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
          setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        } else if (next < 0.75) { setShowContent(false); }
        setTouchStartY(e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => setTouchStartY(0);
    const handleScroll = () => { if (!mediaFullyExpanded) window.scrollTo(0, 0); };
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  /* ── Animation calculations ── */
  const headingOpacity = Math.max(0, 1 - scrollProgress * 2.5);
  const headingY = scrollProgress * 60;

  const expandPhase = Math.max(0, Math.min((scrollProgress - 0.05) / 0.95, 1));
  const eased = 1 - Math.pow(1 - expandPhase, 3);

  // Dashboard starts already visible — scales from 0.6 to 1.0
  const cardW = isMobile ? winW * 0.92 : Math.min(winW * 0.88, 1400);
  const cardH = isMobile ? winH * 0.7 : winH * 0.78;
  const startScale = 0.6;
  const currentScale = startScale + eased * (1 - startScale);

  // Slide up from slight offset
  const startY = 40;
  const cardTranslateY = startY * (1 - eased);

  const borderRadius = 16;
  // Dashboard content visible from the start (opacity starts at 0.7)
  const dashboardOpacity = Math.min(0.7 + eased * 0.3, 1);
  const shadowIntensity = 0.06 + eased * 0.1;

  // Background orbs react to scroll — drift away as dashboard takes focus
  const orbDrift = eased * 30;

  return (
    <div ref={sectionRef} className="overflow-x-hidden">
      <section className="relative flex flex-col items-center min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          {/* Background */}
          <div className="absolute inset-0 z-0 h-full">
            <div className="w-full h-full bg-[#fafafa]">
              <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-500/[0.04] rounded-full blur-[120px]" />
              <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] bg-zinc-500/[0.03] rounded-full blur-[100px]" />
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center w-full h-[100dvh] pt-20 md:pt-24">
            {/* Heading */}
            <div className="flex flex-col items-center text-center px-6 flex-shrink-0" style={{ opacity: headingOpacity, transform: `translateY(${headingY}px)`, pointerEvents: headingOpacity < 0.1 ? 'none' : 'auto' }}>
              {badge && <div className="mb-4">{badge}</div>}
              {title && <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-[-0.03em] text-zinc-900 leading-[1.08]">{title}</h1>}
              {titleAccent && <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-[-0.03em] leading-[1.08] mt-1" style={{ background: 'linear-gradient(135deg, #18181b 0%, #3f3f46 40%, #52525b 70%, #18181b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{titleAccent}</h1>}
              {subtitle && <p className="mt-4 max-w-xl text-base md:text-lg text-zinc-400 leading-relaxed font-normal" style={{ opacity: Math.max(0, 1 - scrollProgress * 4) }}>{subtitle}</p>}
            </div>

            {/* Dashboard card — all 4 corners visible */}
            <div className="flex-1 flex items-center justify-center w-full mt-4 md:mt-6 pb-6">
              <div style={{
                width: `${cardW}px`,
                height: `${cardH}px`,
                borderRadius: `${borderRadius}px`,
                boxShadow: `0 8px 60px rgba(0,0,0,${shadowIntensity}), 0 0 0 1px rgba(0,0,0,0.06)`,
                overflow: 'hidden',
                position: 'relative',
                background: '#ffffff',
                border: '1px solid rgba(228,228,231,0.6)',
                transform: `scale(${currentScale}) translateY(${cardTranslateY}px)`,
                transformOrigin: 'center center',
              }}>
                <div className="absolute inset-0 z-10" style={{ opacity: dashboardOpacity, pointerEvents: dashboardOpacity > 0.5 ? 'auto' : 'none' }}>
                  {mediaType === 'component' && mediaComponent ? (
                    <div className="w-full h-full overflow-y-auto overflow-x-hidden">{mediaComponent}</div>
                  ) : mediaType === 'video' && mediaSrc ? (
                    <video src={mediaSrc} poster={posterSrc} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  ) : mediaType === 'image' && mediaSrc ? (
                    <img src={mediaSrc} alt={title || ''} className="w-full h-full object-cover" />
                  ) : null}
                </div>
              </div>
            </div>

            {/* Scroll hint */}
            {scrollToExpand && (
              <motion.p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-300 font-medium text-sm tracking-wide"
                animate={{ opacity: scrollProgress < 0.08 ? [0.2, 0.6, 0.2] : 0, y: scrollProgress < 0.08 ? [0, 5, 0] : 12 }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}>{scrollToExpand}</motion.p>
            )}
          </div>

          {/* Below-fold content */}
          <motion.section className="relative z-10 flex flex-col w-full" initial={{ opacity: 0 }} animate={{ opacity: showContent ? 1 : 0 }} transition={{ duration: 0.7 }}>{children}</motion.section>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
