"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroLogo from "./HeroLogo";

type Props = {};
const Hero = (props: Props) => {
  return (
    <>
      <motion.div
        className="relative w-full h-dvh mb-20 flex justify-center items-center sketch"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="absolute bg-[linear-gradient(0deg,_rgba(255,255,255,1)_6%,_rgba(255,255,255,0)_30%)] w-full h-full" />
        <motion.div
          className="z-10 flex aspect-video justify-center items-center flex-col bg-[radial-gradient(ellipse,_rgba(255,255,255,1)_35%,_rgba(255,255,255,0)_75%)] p-20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <HeroLogo />
          <motion.p
            className="text-3xl font-medium mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            A simple, yet powerful{" "}
            <span className="text-rose-400">Blogging</span> and{" "}
            <span className="text-purple-500">Newsletter</span> app
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={"/signup"}
                className="px-8 py-3 text-lg font-medium rounded bg-black text-white hover:text-rose-400 transition-all ease-in-out duration-500"
              >
                Start Writing
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={"/explore"}
                className="px-8 py-3 text-lg font-medium rounded border-1 border-black bg-white hover:text-purple-500 transition-all ease-in-out duration-500"
              >
                Explore Threads
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Hero;
