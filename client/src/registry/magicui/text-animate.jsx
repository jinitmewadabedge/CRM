"use client";
import React from "react";
import { motion } from "framer-motion";

export function TextAnimate({
  children,
  animation = ["slideUp"],
  by = "character",
  duration = 0.6,
  delayStep = 0.05,
  highlightWords = [],
  highlightStyle = { fontWeight: "bold" },
}) {
  const text = typeof children === "string" ? children : children.toString();
  const textArray = by === "character" ? [...text] : text.split(" ");

  // ✅ Build combined animation variants
  const combinedVariants = {
    hidden: {
      opacity: 0,
      y: animation.includes("slideUp")
        ? 20
        : animation.includes("slideDown")
        ? -20
        : 0,
      x: animation.includes("slideLeft")
        ? -20
        : animation.includes("slideRight")
        ? 20
        : 0,
      scale: animation.includes("scaleUp")
        ? 0.8
        : animation.includes("scaleDown")
        ? 1.2
        : 1,
      filter: animation.includes("blurIn") ? "blur(6px)" : "blur(0px)",
    },
    show: (i) => ({
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration,
        delay: i * delayStep,
        ease: "easeOut",
      },
    }),
  };

  // ✅ Precompute highlight ranges
  const highlightRanges = React.useMemo(() => {
    if (!highlightWords || highlightWords.length === 0) return [];
    const ranges = [];
    const lowerText = text.toLowerCase();

    highlightWords.forEach((word) => {
      if (!word) return;
      const lowerWord = word.toLowerCase();
      let startIndex = 0;

      while (true) {
        const found = lowerText.indexOf(lowerWord, startIndex);
        if (found === -1) break;
        ranges.push([found, found + word.length]);
        startIndex = found + word.length;
      }
    });

    return ranges;
  }, [text, highlightWords]);

  // ✅ Check if character index is inside a highlight range
  const isCharHighlighted = (i) =>
    highlightRanges.some(([start, end]) => i >= start && i < end);

  return (
    <span style={{ display: "inline-block", overflow: "hidden" }}>
      {textArray.map((char, i) => {
        const highlight = isCharHighlighted(i);
        return (
          <motion.span
            key={i}
            custom={i}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={combinedVariants}
            style={{
              display: "inline-block",
              ...(highlight ? highlightStyle : {}),
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}
