'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Loader2, Mic, MicOff, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useVapi } from '@/hooks/useVapi';

type Mode = 'light' | 'dark';

export interface Testimonial {
  image?: string;
  name?: string;
  jobtitle?: string;
  text?: string;
  audio?: string;
  phoneNumber?: string;
  icon?: React.ReactNode;
  assistantId?: string;
}

interface VoiceTestimonialProps {
  mode?: Mode;
  testimonials: Testimonial[];
}

/* call button (WebRTC via Vapi) */
function CallButton({
  assistantId,
  isDark,
  status,
  isThisCall,
  isMuted,
  onStart,
  onStop,
  onToggleMute,
  disabled,
}: {
  assistantId?: string;
  isDark: boolean;
  status: string;
  isThisCall: boolean;
  isMuted: boolean;
  onStart: (id: string) => void;
  onStop: () => void;
  onToggleMute: () => void;
  disabled: boolean;
}) {
  if (!assistantId) return null;

  if (isThisCall && status === 'connecting') {
    return (
      <div className="flex gap-2 mt-4">
        <button
          disabled
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium bg-yellow-500 text-black cursor-wait"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Kobler til...
        </button>
      </div>
    );
  }

  if (isThisCall && status === 'active') {
    return (
      <div className="flex gap-2 mt-4">
        <button
          onClick={onStop}
          className="flex items-center justify-center gap-2 flex-1 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
        >
          <PhoneOff className="w-4 h-4" />
          Legg p\u00e5
        </button>
        <button
          onClick={onToggleMute}
          className={`flex items-center justify-center w-12 py-3 rounded-lg font-medium transition-all ${
            isMuted
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          title={isMuted ? 'Sl\u00e5 p\u00e5 mikrofon' : 'Demp mikrofon'}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  if (isThisCall && status === 'ended') {
    return (
      <div className="flex gap-2 mt-4">
        <span className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium bg-white/10 text-white/60">
          Samtale avsluttet
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => onStart(assistantId)}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium transition-all ${
          disabled
            ? 'bg-white/10 text-white/30 cursor-not-allowed'
            : isDark
            ? 'bg-white text-black hover:bg-gray-200'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        <Phone className="w-4 h-4" />
        Ring n\u00e5
      </button>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  isDark,
  index,
  status,
  isThisCall,
  isAnyCallActive,
  isMuted,
  onStart,
  onStop,
  onToggleMute,
}: {
  testimonial: Testimonial;
  isDark: boolean;
  index: number;
  status: string;
  isThisCall: boolean;
  isAnyCallActive: boolean;
  isMuted: boolean;
  onStart: (id: string) => void;
  onStop: () => void;
  onToggleMute: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      } border rounded-2xl p-5 relative flex flex-col ${
        isThisCall && status === 'active'
          ? 'ring-2 ring-green-400/50 shadow-lg shadow-green-500/10'
          : ''
      }`}
    >
      {isThisCall && status === 'active' && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>
      )}

      <div className="flex items-center mb-4">
        <div
          className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0 ${
            isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
          }`}
        >
          {testimonial.icon ? (
            testimonial.icon
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <div className="flex flex-col pl-4">
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
            {testimonial.name || 'AI Assistant'}
          </span>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {testimonial.jobtitle || 'AI Resepsjonist'}
          </span>
        </div>
      </div>

      <div className="mt-2 mb-1 flex-1">
        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {testimonial.text}
        </span>
      </div>

      <CallButton
        assistantId={testimonial.assistantId}
        isDark={isDark}
        status={status}
        isThisCall={isThisCall}
        isMuted={isMuted}
        onStart={onStart}
        onStop={onStop}
        onToggleMute={onToggleMute}
        disabled={isAnyCallActive && !isThisCall}
      />
    </motion.div>
  );
}

export const VoiceTestimonial: React.FC<VoiceTestimonialProps> = ({
  mode = 'dark',
  testimonials,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isDark = mode === 'dark';
  const minSwipeDistance = 50;

  const { status, isMuted, start, stop, toggleMute } = useVapi();
  const [activeAssistantId, setActiveAssistantId] = useState<string | null>(null);
  const isAnyCallActive = status === 'active' || status === 'connecting';

  const handleStart = useCallback(
    (assistantId: string) => {
      setActiveAssistantId(assistantId);
      start(assistantId);
    },
    [start]
  );

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  useEffect(() => {
    if (status === 'idle' && activeAssistantId) {
      setActiveAssistantId(null);
    }
  }, [status, activeAssistantId]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < testimonials.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div>
      <div className="md:hidden relative">
        <div
          className="overflow-hidden px-4"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <TestimonialCard
                testimonial={testimonials[currentSlide]}
                isDark={isDark}
                index={0}
                status={status}
                isThisCall={testimonials[currentSlide]?.assistantId === activeAssistantId}
                isAnyCallActive={isAnyCallActive}
                isMuted={isMuted}
                onStart={handleStart}
                onStop={handleStop}
                onToggleMute={toggleMute}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-6 bg-[#0066FF]' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className={`p-2 rounded-full border transition-all ${
              currentSlide === 0
                ? 'border-white/5 text-white/20'
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) => Math.min(testimonials.length - 1, prev + 1))
            }
            disabled={currentSlide === testimonials.length - 1}
            className={`p-2 rounded-full border transition-all ${
              currentSlide === testimonials.length - 1
                ? 'border-white/5 text-white/20'
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="flex justify-center items-stretch gap-5 flex-wrap">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-80">
              <TestimonialCard
                testimonial={testimonial}
                isDark={isDark}
                index={index}
                status={status}
                isThisCall={testimonial.assistantId === activeAssistantId}
                isAnyCallActive={isAnyCallActive}
                isMuted={isMuted}
                onStart={handleStart}
                onStop={handleStop}
                onToggleMute={toggleMute}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceTestimonial;
