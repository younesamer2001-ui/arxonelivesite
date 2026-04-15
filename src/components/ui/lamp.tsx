"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LAMP_COLORS = [
  { main: "#38bdf8", glow: "#7dd3fc", name: "sky" },
  { main: "#818cf8", glow: "#a5b4fc", name: "indigo" },
  { main: "#c084fc", glow: "#d8b4fe", name: "purple" },
  { main: "#34d399", glow: "#6ee7b7", name: "emerald" },
  { main: "#f472b6", glow: "#f9a8d4", name: "pink" },
  { main: "#22d3ee", glow: "#67e8f9", name: "cyan" },
  { main: "#60a5fa", glow: "#93c5fd", name: "blue" },
];

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const color = useMemo(() => {
    const idx = Math.floor(Math.random() * LAMP_COLORS.length);
    return LAMP_COLORS[idx];
  }, []);

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 w-full z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        {/* Left conic gradient */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(from 70deg at center top, ${color.main}, transparent, transparent)`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem]"
        >
          <div className="absolute w-full left-0 bg-zinc-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-full left-0 bg-zinc-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        {/* Right conic gradient */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, ${color.main})`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem]"
        >
          <div className="absolute w-40 h-full right-0 bg-zinc-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full right-0 bg-zinc-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Background layers */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-zinc-950 blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* Glow orb */}
        <div
          className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
          style={{ backgroundColor: color.main }}
        />

        {/* Inner glow */}
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full blur-2xl"
          style={{ backgroundColor: color.glow }}
        />

        {/* Light bar */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem]"
          style={{ backgroundColor: color.glow }}
        />

        {/* Top mask */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-zinc-950" />
      </div>

      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};
