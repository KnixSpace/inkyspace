"use client";

import CallToAction from "@/components/home/CallToAction";
import FeaturedBlogs from "@/components/home/FeaturedBlogs";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import ScrollTo from "@/components/layout/ScrollTo";
import { useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

type Props = {};

const page = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleScrollToClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <ScrollTo opacity={opacity} onClick={handleScrollToClick} />
      <Hero />
      <div className="outerContainer" ref={containerRef}>
        <div className="innerContainer">
          <Features />
          <FeaturedBlogs ref={ref} />
          <CallToAction />
        </div>
      </div>
    </>
  );
};

export default page;
