'use client';

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, User, LucideIcon } from 'lucide-react';

type Mode = 'light' | 'dark';

interface Testimonial {
  image?: string;
  name?: string;
  jobtitle?: string;
  text?: string;
  audio?: string;
  phoneNumber?: string;
  icon?: LucideIcon;
}

interface VoiceTestimonialProps {
  mode?: Mode;
  testimonials: Testimonial[];
}

export const VoiceTestimonial: React.FC<VoiceTestimonialProps> = ({ 
  mode = 'dark', 
  testimonials 
}) => {
  const [showAll, setShowAll] = React.useState(false);

  const handleLoadMore = () => {
    setShowAll(true);
  };

  const isDark = mode === 'dark';
  const shouldShowLoadMore = testimonials.length > 6;

  return (
    <div>
      <div className="flex flex-col items-center justify-center pt-5">
        <div className="flex flex-col gap-5 mb-8 max-w-3xl mx-auto">
          <span className={`text-center text-4xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {isDark ? 'Møt våre AI-resepsjonister' : 'Meet our AI receptionists'}
          </span>
          <span className={`text-center text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isDark 
              ? 'Våre AI-resepsjonister er trent for spesifikke bransjer. Hver av dem kan booke timer, svare på spørsmål og følge opp kunder — akkurat som en ekte medarbeider. Test dem selv ved å ringe nedenfor.' 
              : 'Our AI receptionists are trained for specific industries. Each can book appointments, answer questions, and follow up with customers — just like a real employee. Test them yourself by calling below.'}
          </span>
          <div className={`text-center text-sm px-4 py-2 rounded-lg ${isDark ? 'bg-white/10 text-gray-300' : 'bg-black/10 text-gray-700'}`}>
            {isDark 
              ? '💡 Tips: Spør om timebooking, priser, eller tilgjengelighet. AI-en svarer som en ekte medarbeider.' 
              : '💡 Tip: Ask about booking, prices, or availability. The AI responds like a real employee.'}
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className={`flex justify-center items-center gap-5 flex-wrap overflow-hidden ${showAll ? 'max-h-full' : 'max-h-[720px]'} relative`}>
          {shouldShowLoadMore && !showAll && (
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-10"></div>
          )}
          
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${
                isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              } border w-80 h-auto rounded-2xl p-5 relative ${
                !showAll && index >= 6 ? 'testimonial-partially-visible' : ''
              }`}
            >
              {/* Avatar med ikon */}
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center ${
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

              {/* Description */}
              <div className="mt-5 mb-1">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {testimonial.text}
                </span>
              </div>

              {/* Call Button */}
              {testimonial.phoneNumber && (
                <a
                  href={`tel:${testimonial.phoneNumber}`}
                  className={`flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-lg font-medium transition-all ${
                    isDark
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  {isDark ? 'Ring nå' : 'Call now'}
                </a>
              )}
            </motion.div>
          ))}
        </div>
        
        {shouldShowLoadMore && !showAll && (
          <div className="flex justify-center mt-8">
            <button
              className={`px-5 py-2 rounded-md transition ${
                isDark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
              onClick={handleLoadMore}
            >
              {isDark ? 'Last mer' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceTestimonial;
