"use client";

import Content from "@/components/home/Content";
import Hero from "@/components/home/Hero";
import ScrollTo from "@/components/layout/ScrollTo";
import React, { useRef } from "react";

type Props = {};

const page = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleScrollToClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <ScrollTo onClick={handleScrollToClick} />
      <div className="outerContainer">
        <div className="innerContainer border-x-2 border-gray-400 border-dashed">
          <Hero />
          <Content ref={ref} />
        </div>
      </div>
    </>
  );
};

export default page;
