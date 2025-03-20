import React from "react";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <div className="fixed z-20 top-0 left-0 w-full flex justify-center py-2 border-b-2 border-gray-400 border-dashed bg-white/30 backdrop-blur">
      <div className="innerContainer grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Logo H1="text-xl" SPAN="underline-offset-4" />
        </div>
        <div className="flex justify-center items-center gap-4">
          <a href="#" className="text-xl">
            About
          </a>
          <a href="#" className="text-xl">
            Contact
          </a>
        </div>
        <div className="flex items-center justify-end gap-4">
          <a href="#" className="text-xl">
            Login
          </a>
          <a href="#" className="text-xl">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
