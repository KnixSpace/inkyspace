"use client";
import Logo from "./Logo";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import UserProfileDropdown from "./UserProfileDropdown";
// import UserProfileDropdown from "./UserProfileDropdown";

const Navbar = () => {
  const { user } = useAppSelector((state) => state.user);
  const isAuthenticated = !!user;

  return (
    <motion.div
      className="fixed z-20 top-0 left-0 w-full flex justify-center py-2 border-b-2 border-gray-300 border-dashed bg-white/10 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="innerContainer mx-auto max-md:px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo H1="text-xl" SPAN="underline-offset-4" />
        </div>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                href="/explore"
                className="text-lg hover:text-purple-500 transition-colors"
              >
                Explore
              </Link>
              {user.role === "O" && (
                <Link
                  href="/space"
                  className="text-lg hover:text-rose-400 transition-colors"
                >
                  My Spaces
                </Link>
              )}
              <UserProfileDropdown />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-lg hover:text-purple-500 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-1 text-lg font-medium rounded bg-black text-white hover:text-rose-400 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
