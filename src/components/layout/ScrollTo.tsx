"use client";

import { ArrowDownToDot } from "lucide-react";

type Props = {
  onClick: () => void;
};

const ScrollTo = (props: Props) => {
  return (
    <div
      className="z-10 absolute bottom-2 w-full flex justify-center"
      onClick={props.onClick}
    >
      <div className="flex flex-col items-center cursor-pointer">
        <div className="text-xl font-medium">Scroll to Explore</div>
        <ArrowDownToDot />
      </div>
    </div>
  );
};

export default ScrollTo;
