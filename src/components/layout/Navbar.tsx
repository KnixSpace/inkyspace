"use client";
import React from "react";
import Logo from "./Logo";
import { motion } from "framer-motion";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <motion.div
        className="fixed z-20 top-0 left-0 w-full flex justify-center py-2 border-b-2 border-gray-300 border-dashed bg-white/30 backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="innerContainer grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Logo H1="text-xl" SPAN="underline-offset-4" />
          </div>
          <div className="flex items-center justify-end gap-4">
            <Link href="/auth/login" className="text-xl">
              Login
            </Link>
            <Link href="/auth/register" className="text-xl">
              Sign Up
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
