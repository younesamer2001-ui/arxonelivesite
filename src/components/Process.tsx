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
      filter: 'blur(0px)',
      transition: {
        delay: i * 1.5,
        duration: 0.7,
      },
    }),
    hidden: {
      filter: 'blur(10px)',
      y: 40,
      opacity: 0,
    },
  };
  
  const textVariants = {
    visible: (i: number) => ({
      filter: 'blur(0px)',
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.7,
      },
    }),
    hidden: {
      filter: 'blur(10px)',
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
              Mens du vurderer AI, bruker{" "}
              <TimelineContent
                as="span"
                animationNum={1}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-red-400 border-2 border-red-400/50 inline-block border-dotted px-2 rounded-md"
              >
                konkurrentene dine
              </TimelineContent>{" "}
              det allerede. De sparer tid. De skalerer. Du henger etter. Vi gir deg en{" "}
              <TimelineContent
                as="span"
                animationNum={2}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-emerald-400 border-2 border-emerald-400/50 inline-block border-dotted px-2 rounded-md"
              >
                risikofri måte
              </TimelineContent>{" "}
              å teste det på — 50% depositum, resten etter 20 dager. Ikke fornøyd? <TimelineContent
                as="span"
                animationNum={3}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-2 py-1 rounded-md"
              >Full refusjon</TimelineContent>.
            </TimelineContent>

            <TimelineContent
              as="div"
              animationNum={4}
              timelineRef={heroRef}
              customVariants={textVariants}
              className="mt-12"
            >
              <a
                href="/10-day-promise"
                className="bg-emerald-600 gap-2 font-medium shadow-lg shadow-emerald-600/50 text-white h-12 px-6 rounded-full text-sm inline-flex items-center cursor-pointer hover:bg-emerald-700 transition-colors"
              >
                <Zap fill="white" size={16} />
                Se hvordan det fungerer
              </a>
            </TimelineContent>
          </div>
        </div>
      </div>
    </section>
  );
}
