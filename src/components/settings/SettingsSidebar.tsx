"use client";

import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  BookOpen,
  Users,
  Layout,
  FileCheck,
  Shield,
  Building,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { stagger } from "@/lib/animations";

const SettingsSidebar = () => {
  const { user } = useAppSelector((state) => state.user);
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => {
    return pathname === `/settings${path}`
      ? "bg-purple-50 text-purple-600"
      : "";
  };

  return (
    <motion.div
      className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.nav
        className="space-y-1"
        variants={stagger.container}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={stagger.item}>
          <Link
            href="/settings/profile"
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive("/profile")}`}
          >
            <User size={18} />
            <span>Profile</span>
          </Link>
        </motion.div>

        {user.role === "U" && (
          <motion.div variants={stagger.item}>
            <Link
              href="/settings/subscribed-spaces"
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive(
                "/subscribed-spaces"
              )}`}
            >
              <BookOpen size={18} />
              <span>Subscribed Spaces</span>
            </Link>
          </motion.div>
        )}

        {user.role === "O" && (
          <>
            <motion.div variants={stagger.item}>
              <Link
                href="/settings/editor-management"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive(
                  "/editor-management"
                )}`}
              >
                <Users size={18} />
                <span>Editor Management</span>
              </Link>
            </motion.div>
            <motion.div variants={stagger.item}>
              <Link
                href="/settings/space-management"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive(
                  "/space-management"
                )}`}
              >
                <Layout size={18} />
                <span>Space Management</span>
              </Link>
            </motion.div>
            <motion.div variants={stagger.item}>
              <Link
                href="/settings/thread-approvals"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive(
                  "/thread-approvals"
                )}`}
              >
                <FileCheck size={18} />
                <span>Thread Approvals</span>
              </Link>
            </motion.div>
          </>
        )}

        {user.role === "E" && (
          <>
            <motion.div variants={stagger.item}>
              <Link
                href="/settings/owner-info"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive("/owner-info")}`}
              >
                <Building size={18} />
                <span>Owner Info</span>
              </Link>
            </motion.div>
            <motion.div variants={stagger.item}>
              <Link
                href="/settings/threads"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive("/threads")}`}
              >
                <FileText size={18} />
                <span>My Threads</span>
              </Link>
            </motion.div>
            <motion.div variants={stagger.item}>
              <Link
                href="/settings/thread-approvals"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive(
                  "/thread-approvals"
                )}`}
              >
                <FileCheck size={18} />
                <span>Thread Approvals</span>
              </Link>
            </motion.div>
          </>
        )}

        <motion.div variants={stagger.item}>
          <Link
            href="/settings/security"
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive("/security")}`}
          >
            <Shield size={18} />
            <span>Security</span>
          </Link>
        </motion.div>
      </motion.nav>
    </motion.div>
  );
};

export default SettingsSidebar;
