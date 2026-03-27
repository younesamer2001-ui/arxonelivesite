'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, User, ChevronLeft, ChevronRight, LucideIcon, Loader2, Mic, MicOff } from 'lucide-react';
import { useVapi } from '@/hooks/useVapi';

type Mode = 'light' | 'dark';

interface Testimonial {
  image?: string;
  name?: string;
  jobtitle?: string;
  text?: string;
  audio?: string;
  phoneNumber?: string;
  assistantId?: string;
  icon?: LucideIcon;
}

interface VoiceTestimonialProps {
  mode?: Mode;
  testimonials: Testimonial[];
}

function CallButton({ 
  testimonial, 
  isDark, 
  callStatus, 
  activeAssistantId, 
  onCall, 
  onHangup,
  isMuted,
  onToggleMute
}: { 
  testimonial: Testimonial; 
  isDark: boolean;
  callStatus: string;
  activeAssistantId: string | null;
  onCall: (id: string) => void;
  onHangup: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}) {
  const isThisActive = activeAssistantId === testimonial.assistantId;
  const isAnyCallActive = callStatus === 'active' || callStatus === 'connecting';

  if (isThisActive && callStatus === 'connecting') {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-lg font-medium animate-pulse ${
          isDark ? 'bg-yellow-500/80 text-black' : 'bg-yellow-500/80 text-black'
        }`}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Kobler til...
      </button>
    );
  }

  if (isThisActive && callStatus === 'active') {
    return (
      <div className="flex gap-2 mt-4">
        <button
          onClick={onToggleMute}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
            isMuted
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-black/10 text-black border border-black/20'
          }`}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        <button
          onClick={onHangup}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all"
        >
          <PhoneOff className="w-4 h-4" />
          Legg på
        </button>
      </div>
    );
  }

  if (isThisActive && callStatus === 'ended') {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-lg font-medium ${
          isDark ? 'bg-white/10 text-gray-400' : 'bg-black/10 text-gray-600'
        }`}
      >
        Samtale avsluttet
      </button>
    );
  }

  return (
    <button
      onClick={() => testimonial.assistantId && onCall(testimonial.assistantId)}
      disabled={isAnyCallActive || !testimonial.assistantId}
      className={`flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-lg font-medium transition-all ${
        isAnyCallActive || !testimonial.assistantId
          ? isDark ? 'bg-white/10 text-gray-500 cursor-not-allowed' : 'bg-black/10 text-gray-400 cursor-not-allowed'
          : isDark
            ? 'bg-white text-black hover:bg-gray-200'
            : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      <Phone className="w-4 h-4" />
      {isDark ? 'Ring nå' : 'Call now'}
    </button>
  );
}

function TestimonialCard({ 
  testimonial, 
  isDark, 
  index,
  callStatus,
  activeAssistantId,
  onCall,
  onHangup,
  isMuted,
  onToggleMute
}: { 
  testimonial: Testimonial; 
  isDark: boolean; 
  index: number;
  callStatus: string;
  activeAssistantId: string | null;
  onCall: (id: string) => void;
  onHangup: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}) {
  const isThisActive = activeAssistantId === testimonial.assistantId && (callStatus === 'active' || callStatus === 'connecting');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      } border rounded-2xl p-5 relative flex flex-col ${
        isThisActive ? 'ring-2 ring-green-500/50' : ''
      }`}
    >
      {isThisActive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>
      )}

      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0 ${
          isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
        }`}>
          {testimonial.icon ? (
            <testimonial.icon className="w-6 h-6" />
          ) : testimonial.image ? (
            <Image
              src={testimonial.image}
              alt={testimonial.name || 'AI Assistant'}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
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
        testimonial={testimonial}
        isDark={isDark}
        callStatus={callStatus}
        activeAssistantId={activeAssistantId}
        onCall={onCall}
        onHangup={onHangup}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
      />
    </motion.div>
  );
}

export const VoiceTestimonial: React.FC<VoiceTestimonialProps> = ({ 
  mode = 'dark', 
  testimonials 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [activeAssistantId, setActiveAssistantId] = useState<string | null>(null);
  const isDark = mode === 'dark';
  const { status, isMuted, start, stop, toggleMute } = useVapi();

  const handleCall = (assistantId: string) => {
    setActiveAssistantId(assistantId);
    start(assistantId);
  };

  const handleHangup = () => {
    stop();
    setTimeout(() => setActiveAssistantId(null), 2000);
  };

  const minSwipeDistance = 50;

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
      setCurrentSlide(prev => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const cardProps = {
    callStatus: status,
    activeAssistantId,
    onCall: handleCall,
    onHangup: handleHangup,
    isMuted,
    onToggleMute: toggleMute
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center pt-5">
        <div className="flex flex-col gap-5 mb-8 max-w-3xl mx-auto px-4">
          <span className={`text-center text-2xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {isDark ? 'Møt våre AI-resepsjonister' : 'Meet our AI receptionists'}
          </span>
          <span className={`text-center text-base md:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isDark 
              ? 'Våre AI-resepsjonister er trent for spesifikke bransjer. Hver av dem kan booke timer, svare på spørsmål og følge opp kunder \u2014 akkurat som en ekte medarbeider.' 
              : 'Our AI receptionists are trained for specific industries. Each can book appointments, answer questions, and follow up with customers \u2014 just like a real employee.'}
          </span>
        </div>
      </div>

      {/* Mobile: Swipeable slides */}
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
                {...cardProps}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide 
                  ? 'w-6 bg-[#0066FF]' 
                  : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Prev / Next buttons */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
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
            onClick={() => setCurrentSlide(prev => Math.min(testimonials.length - 1, prev + 1))}
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

      {/* Desktop: Grid layout */}
      <div className="hidden md:block">
        <div className="flex justify-center items-stretch gap-5 flex-wrap">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-80">
              <TestimonialCard
                testimonial={testimonial}
                isDark={isDark}
                index={index}
                {...cardProps}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceTestimonial;
