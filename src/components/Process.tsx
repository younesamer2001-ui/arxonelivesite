'use client';
import { TimelineContent } from '@/components/ui/timeline-animation';
import { Zap } from 'lucide-react';
import { useRef } from 'react';

export default function Process() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 1.5,
        duration: 0.7,
      },
    }),
    hidden: {
      y: 40,
      opacity: 0,
    },
  };
  
  const textVariants = {
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.7,
      },
    }),
    hidden: {
      opacity: 0,
    },
  };

  return (
    <section className="py-12 md:py-16 px-4 bg-black">
      <div className="max-w-6xl mx-auto" ref={heroRef}>
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1">
            <TimelineContent
              as="h1"
              animationNum={0}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl !leading-[130%] font-semibold text-white mb-6 md:mb-8"
            >
              Hvert tapte anrop er en tapt kunde — og{" "}
              <TimelineContent
                as="span"
                animationNum={1}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-red-400 border-2 border-red-400/50 inline-block border-dotted px-2 rounded-md"
              >
                tapt inntekt
              </TimelineContent>{" "}
              du aldri får tilbake. Med Arxon får du en{" "}
              <TimelineContent
                as="span"
                animationNum={2}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-emerald-400 border-2 border-emerald-400/50 inline-block border-dotted px-2 rounded-md"
              >
                risikofri pilot
              </TimelineContent>{" "}
              med ekte samtaler, ekte resultater — og full innsikt i hva kundene dine faktisk trenger. <TimelineContent
                as="span"
                animationNum={3}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-orange-400 border-2 border-orange-400/50 inline-block border-dotted px-2 rounded-md"
              >Se verdien før du bestemmer deg</TimelineContent>.
            </TimelineContent>

            <TimelineContent
              as="div"
              animationNum={4}
              timelineRef={heroRef}
              customVariants={textVariants}
              className="mt-12"
            >
              <a
                href="#prov-ai"
                className="bg-zinc-900 gap-2 font-medium shadow-lg shadow-zinc-900/30 text-white h-12 px-6 rounded-full text-sm inline-flex items-center cursor-pointer hover:bg-zinc-800 transition-colors"
              >
                <Zap fill="white" size={16} />
                Prøv AI-en gratis
              </a>
            </TimelineContent>
          </div>
        </div>
      </div>
    </section>
  );
}
