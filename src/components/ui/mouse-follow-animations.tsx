"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const SPRING = {
  mass: 0.1,
  damping: 12,
  stiffness: 120,
};

const SpringMouseFollow = ({
  size = 12,
  color = "#7dd3fc",
}: {
  size?: number;
  color?: string;
}) => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const xSpring = useSpring(cursorX, SPRING);
  const ySpring = useSpring(cursorY, SPRING);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", () => setVisible(true));
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [cursorX, cursorY, visible]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: xSpring,
        y: ySpring,
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
        backgroundColor: color,
        borderRadius: "50%",
        boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}40`,
        pointerEvents: "none",
        zIndex: 9999,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
};

export { SpringMouseFollow };
