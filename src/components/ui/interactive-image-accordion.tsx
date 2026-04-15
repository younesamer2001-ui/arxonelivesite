"use client";
import React, { useState } from "react";
import ScrollPang from "../ScrollPang";

interface ProcessAccordionProps {
  lang?: "no" | "en";
}

const content = {
  no: {
    heading: "Slik kommer du i gang med Arxon",
    description:
      "Vi setter opp alt for deg — fra første møte til et ferdig system som svarer på anrop, booker timer og følger opp kundene dine.",
    cta: "Book et møte",
    ctaLink: "#kontakt",
    items: [
      { id: 1, title: "Kartlegging" },
      { id: 2, title: "Pilot" },
      { id: 3, title: "Evaluering" },
      { id: 4, title: "Utrulling" },
      { id: 5, title: "Optimalisering" },
    ],
  },
  en: {
    heading: "How to get started with Arxon",
    description:
      "We set up everything for you — from the first meeting to a finished system that answers calls, books appointments and follows up your customers.",
    cta: "Book a meeting",
    ctaLink: "#kontakt",    items: [
      { id: 1, title: "Mapping" },
      { id: 2, title: "Pilot" },
      { id: 3, title: "Evaluation" },
      { id: 4, title: "Rollout" },
      { id: 5, title: "Optimization" },
    ],
  },
};

const images = [
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1970&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
];

function AccordionPanel({
  item,
  imageUrl,
  isActive,
  onMouseEnter,
  onClick,
}: {
  item: { id: number; title: string };
  imageUrl: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}) {
  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        /* Mobile: vertical stack */
        ${isActive ? "h-[250px] sm:h-[400px]" : "h-[60px] sm:h-[400px]"}
        /* Desktop: horizontal flex */
        ${isActive ? "sm:flex-[4]" : "sm:flex-[0.5]"}
      `}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <span
        className={`
          absolute text-white text-lg font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          /* Mobile: always horizontal label */
          ${
            isActive
              ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0"
              : "sm:w-auto sm:text-left sm:bottom-24 sm:left-1/2 sm:-translate-x-1/2 sm:rotate-90 bottom-4 left-1/2 -translate-x-1/2 rotate-0"
          }
        `}
      >
        {item.title}
      </span>
    </div>
  );
}
export default function ProcessAccordion({ lang = "no" }: ProcessAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const t = content[lang];

  return (
    <section className="bg-black py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Left: Text */}
          <ScrollPang className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              {t.heading}
            </h2>
            <p className="mt-5 text-lg text-zinc-300 max-w-xl mx-auto md:mx-0">
              {t.description}
            </p>
            <div className="mt-8">
              <a
                href={t.ctaLink}
                className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition-colors duration-300"
              >
                {t.cta}
              </a>
            </div>
          </ScrollPang>

          {/* Right: Accordion */}
          <ScrollPang offset={1} className="w-full md:w-1/2">            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4">
              {t.items.map((item, index) => (
                <AccordionPanel
                  key={item.id}
                  item={item}
                  imageUrl={images[index]}
                  isActive={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </ScrollPang>
        </div>
      </div>
    </section>
  );
}