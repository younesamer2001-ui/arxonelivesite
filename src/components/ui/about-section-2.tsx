"use client";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { Zap } from "lucide-react";
import { useRef } from "react";

interface AboutSection2Props {
  lang?: "no" | "en";
}

const content = {
  no: {
    heading1: "Når du velger Arxon, blir du",
    highlight1: "kontaktet",
    heading2: "av teamet vårt. Vi booker et møte hvor vi",
    highlight2: "kartlegger",
    heading3: "bedriften din og setter opp et skreddersydd system som",
    highlight3: "fungerer for deg.",
    cta: "Book et møte",
  },
  en: {
    heading1: "When you choose Arxon, you'll be",
    highlight1: "contacted",
    heading2: "by our team. We book a meeting where we",
    highlight2: "map out",
    heading3: "your business and set up a tailored system that",
    highlight3: "works for you.",
    cta: "Book a meeting",
  },
};

export default function AboutSection2({ lang = "no" }: AboutSection2Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const t = content[lang];

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 1.5,
        duration: 0.7,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: 40,
      opacity: 0,
    },
  };

  const textVariants = {
    visible: (i: number) => ({
      filter: "blur(0px)",
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.7,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
    },
  };

  return (
    <section className="pt-10 md:pt-14 pb-20 md:pb-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto" ref={heroRef}>
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1">
            <TimelineContent
              as="h1"
              animationNum={0}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="sm:text-4xl text-2xl md:text-5xl !leading-[110%] font-semibold text-gray-900 mb-8"
            >
              {t.heading1}{" "}
              <TimelineContent
                as="span"
                animationNum={1}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-blue-600 border-2 border-blue-500 inline-block xl:h-16 border-dotted px-2 rounded-md"
              >
                {t.highlight1}
              </TimelineContent>{" "}
              {t.heading2}{" "}
              <TimelineContent
                as="span"
                animationNum={2}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-orange-600 border-2 border-orange-500 inline-block xl:h-16 border-dotted px-2 rounded-md"
              >
                {t.highlight2}
              </TimelineContent>{" "}
              {t.heading3}{" "}
              <TimelineContent
                as="span"
                animationNum={3}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="text-green-600 border-2 border-green-500 inline-block xl:h-16 border-dotted px-2 rounded-md"
              >
                {t.highlight3}
              </TimelineContent>
            </TimelineContent>

            <div className="mt-12 flex justify-end">
              <TimelineContent
                as="button"
                animationNum={4}
                timelineRef={heroRef}
                customVariants={textVariants}
                className="bg-blue-600 gap-2 font-medium shadow-lg shadow-blue-600 text-white h-12 px-4 rounded-full text-sm inline-flex items-center cursor-pointer"
              >
                <Zap fill="white" size={16} />
                {t.cta}
              </TimelineContent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
