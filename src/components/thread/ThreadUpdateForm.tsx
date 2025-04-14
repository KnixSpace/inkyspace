"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const EditorComponent = dynamic(
  () => import("@/components/editor/EditorComponent"),
  {
    ssr: false,
    loading: () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-lg"
      >
        Loading editor...
      </motion.div>
    ),
  }
);
