// src/animations/textVariants.js

// Helper for consistent timing
const baseTransition = (i, duration = 0.4) => ({
  delay: i * 0.05,
  duration,
  ease: "easeOut",
});

export const textVariants = {
  // 1️⃣ Fade In
  fadeIn: {
    hidden: { opacity: 0 },
    show: (i) => ({
      opacity: 1,
      transition: baseTransition(i),
    }),
  },

  // 2️⃣ Blur In
  blurIn: {
    hidden: { opacity: 0, filter: "blur(8px)" },
    show: (i) => ({
      opacity: 1,
      filter: "blur(0px)",
      transition: baseTransition(i),
    }),
  },

  // 3️⃣ Blur In Up
  blurInUp: {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    show: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: baseTransition(i),
    }),
  },

  // 4️⃣ Blur In Down
  blurInDown: {
    hidden: { opacity: 0, y: -20, filter: "blur(8px)" },
    show: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: baseTransition(i),
    }),
  },

  // 5️⃣ Slide Up
  slideUp: {
    hidden: { opacity: 0, y: 40 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: baseTransition(i),
    }),
  },

  // 6️⃣ Slide Down
  slideDown: {
    hidden: { opacity: 0, y: -40 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: baseTransition(i),
    }),
  },

  // 7️⃣ Slide Left
  slideLeft: {
    hidden: { opacity: 0, x: 40 },
    show: (i) => ({
      opacity: 1,
      x: 0,
      transition: baseTransition(i),
    }),
  },

  // 8️⃣ Slide Right
  slideRight: {
    hidden: { opacity: 0, x: -40 },
    show: (i) => ({
      opacity: 1,
      x: 0,
      transition: baseTransition(i),
    }),
  },

  // 9️⃣ Scale Up
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    show: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        ...baseTransition(i),
        type: "spring",
        stiffness: 250,
      },
    }),
  },

  // 🔟 Scale Down
  scaleDown: {
    hidden: { opacity: 0, scale: 1.2 },
    show: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        ...baseTransition(i),
        type: "spring",
        stiffness: 250,
      },
    }),
  },
};
