"use client";

import { ArrowDownToDot } from "lucide-react";
import { motion, MotionValue } from "framer-motion";

type Props = {
  onClick: () => void;
  opacity: MotionValue<number>;
};

const ScrollTo = (props: Props) => {
  return (
    <motion.div
      style={{ opacity: props.opacity }}
      className="fixed bottom-2.5 left-0 z-10 w-full flex justify-center pointer-events-none"
      onClick={props.onClick}
      animate={{ y: [0, -10, 0] }}
      transition={{
        delay: 0.5,
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <motion.div
        className="flex flex-col items-center cursor-pointer pointer-events-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="text-xl font-medium">Scroll to Explore</div>
        <ArrowDownToDot />
      </motion.div>
    </motion.div>
  );
};

export default ScrollTo;
