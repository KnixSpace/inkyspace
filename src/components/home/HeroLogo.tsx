"use client";

import { motion } from "framer-motion";

const HeroLogo = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const underlineVariants = {
    hidden: { width: "0%" },
    visible: {
      width: "100%",
      transition: {
        delay: 1.2,
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.h1
      className="text-8xl font-medium"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.span className="relative" variants={letterVariants}>
        Inky
        <motion.span
          className="absolute -z-10 bottom-4 left-0 h-0.5 bg-rose-400 rounded-full"
          variants={underlineVariants}
        />
      </motion.span>
      <motion.span className="relative" variants={letterVariants}>
        Space
        <motion.span
          className="absolute ml-4 -z-10 bottom-4 left-0 h-0.5 bg-purple-500 rounded-full"
          variants={underlineVariants}
        />
      </motion.span>
    </motion.h1>
  );
};

export default HeroLogo;
