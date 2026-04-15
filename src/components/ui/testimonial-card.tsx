"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  title: string;
  quote?: string;
  avatarSrc: string;
  rating: number;
}

export interface ClientsSectionProps {
  tagLabel: string;
  title: string;
  description: string;
  stats: Stat[];
  testimonials: Testimonial[];
  primaryActionLabel: string;
  secondaryActionLabel: string;
  className?: string;
}

const StatCard = ({ value, label }: Stat) => (
  <Card className="bg-muted/50 border-border text-center rounded-xl">
    <CardContent className="p-4">
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

const StickyTestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
  return (
    <motion.div
      className="sticky w-full"
      style={{ top: `${20 + index * 24}px` }}
    >
      <div className={cn(
        "p-6 rounded-2xl shadow-lg flex flex-col h-auto w-full",
        "bg-card border border-border"
      )}>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${testimonial.avatarSrc})` }}
            aria-label={`Photo of ${testimonial.name}`}
          />
          <div className="flex-grow">
            <p className="font-semibold text-lg text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 my-4">
          <span className="font-bold text-base text-foreground">{testimonial.rating.toFixed(1)}</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(testimonial.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
        {testimonial.quote && (
          <p className="text-base text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
        )}
      </div>
    </motion.div>
  );
};

export const ClientsSection = ({
  tagLabel,
  title,
  description,
  stats,
  testimonials,
  primaryActionLabel,
  secondaryActionLabel,
  className,
}: ClientsSectionProps) => {
  const scrollContainerHeight = `calc(100vh + ${testimonials.length * 100}px)`;
  return (
    <section className={cn("w-full bg-background text-foreground py-20 md:py-28", className)}>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start px-4 sm:px-6">
        
        {/* Left Column: Sticky Content */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-20">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-muted/50 px-3 py-1 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">{tagLabel}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-6">
            <Button variant="outline" size="lg" className="rounded-full">{secondaryActionLabel}</Button>
            <Button size="lg" className="rounded-full">{primaryActionLabel}</Button>
          </div>
        </div>

        {/* Right Column: Sticky card stack */}
        <div className="relative flex flex-col gap-4" style={{ height: scrollContainerHeight }}>
          {testimonials.map((testimonial, index) => (
            <StickyTestimonialCard
              key={testimonial.name}
              index={index}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
