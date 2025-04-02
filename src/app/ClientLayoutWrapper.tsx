"use client";

import type React from "react";

import MessageBox from "@/components/ui/MessageBox";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <ClientLayout key={pathname}>{children}</ClientLayout>;
}

function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <>
      {!isAuthPage && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className={!isAuthPage ? "pt-16" : ""}
          {...pageTransition}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {!isAuthPage && <Footer />}
      <MessageBox />
    </>
  );
}

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
