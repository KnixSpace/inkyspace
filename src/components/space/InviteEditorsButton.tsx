"use client";

import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { buttonHover, buttonTap } from "@/lib/animations";
import { useAppSelector } from "@/redux/hooks";

interface InviteEditorsButtonProps {
  spaceId: string;
}

const InviteEditorsButton = ({ spaceId }: InviteEditorsButtonProps) => {
  const user = useAppSelector((state) => state.user.user);
  const isOwner = user?.role === "O";

  if (!isOwner) return null;

  return (
    <div className="mt-6 text-center">
      <p className="text-gray-600 mb-4">
        No threads published in this space yet. Invite editors to start creating
        content.
      </p>
      <Link href="/settings/editor-management">
        <motion.button
          className="px-4 py-2 bg-purple-500 text-white rounded-md font-medium flex items-center gap-2 mx-auto"
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <UserPlus size={18} />
          <span>Invite Editors</span>
        </motion.button>
      </Link>
    </div>
  );
};

export default InviteEditorsButton;
