import Link from "next/link";
import React from "react";
import Logo from "../layout/Logo";

type Props = {};

const Hero = (props: Props) => {
  return (
    <>
      <div className="relative w-full h-dvh flex justify-center items-center sketch">
        <div className="absolute bg-[linear-gradient(0deg,_rgba(255,255,255,1)_6%,_rgba(255,255,255,0)_15%)] w-full h-full" />
        <div className="z-10 flex aspect-video justify-center items-center flex-col bg-[radial-gradient(ellipse,_rgba(255,255,255,1)_40%,_rgba(255,255,255,0)_100%)] p-20">
          <Logo
            H1="text-8xl font-medium"
            SPAN="underline-offset-8 decoration-2"
          />
          <p className="text-3xl font-medium mt-4">
            A simple, yet powerful{" "}
            <span className="text-rose-400"> Blooging </span> and{" "}
            <span className="text-purple-500">Newsletter</span> app
          </p>
          <div className="flex items-center gap-4 mt-8">
            <Link
              href={"/signup"}
              className="px-8 py-1 text-xl rounded bg-black text-white"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
