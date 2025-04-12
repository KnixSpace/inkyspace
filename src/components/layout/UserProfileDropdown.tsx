"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/lib/apis/auth";
import { setUser } from "@/redux/features/userSlice";
import { showMessage } from "@/components/ui/MessageBox";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Settings, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buttonHover, buttonTap, scale } from "@/lib/animations";

const UserProfileDropdown = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.success) {
        dispatch(setUser(null));
        showMessage({
          type: "success",
          message: "Logged out successfully",
        });
        router.push("/");
      } else {
        showMessage({
          type: "error",
          message: "Failed to logout. Please try again.",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-4 focus:outline-none rounded cursor-pointer ${
          isOpen ? "bg-purple-50" : "hover:bg-purple-50"
        }`}
        whileHover={buttonHover}
        whileTap={buttonTap}
      >
        <span className="hidden md:inline-block md:pl-4">{user.name}</span>

        <div className="relative w-8 h-8 rounded overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-purple-100 flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-4 w-36 bg-white rounded-md shadow-lg border-2 border-dashed border-gray-300 p-1 z-50"
          >
            {user.role === "O" && (
              <motion.div whileTap={buttonTap}>
                <Link
                  href={`/profile/${user.userId}`}
                  className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left rounded"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={16} />
                  Public Profile
                </Link>
              </motion.div>
            )}
            <motion.div whileTap={buttonTap}>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left rounded"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={16} />
                Settings
              </Link>
            </motion.div>
            <motion.div whileTap={buttonTap}></motion.div>
            {user.role === "A" && (
              <motion.div whileTap={buttonTap}>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left rounded"
                  onClick={() => setIsOpen(false)}
                >
                  <Shield size={16} />
                  Admin Panel
                </Link>
              </motion.div>
            )}
            <motion.button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 px-2 py-2 text-sm text-rose-500 hover:bg-purple-50 w-full text-left rounded"
              whileTap={buttonTap}
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;
