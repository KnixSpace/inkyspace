"use client";

import type React from "react";

import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { changePassword } from "@/lib/apis/auth";
import { deleteAccount } from "@/lib/apis/user";
import { setUser } from "@/redux/features/userSlice";
import { showMessage } from "@/components/ui/MessageBox";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp, buttonHover, buttonTap, stagger } from "@/lib/animations";

const SecuritySettings = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await changePassword(currentPassword, newPassword);
      if (response.success) {
        showMessage({
          type: "success",
          message: "Password changed successfully!",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(
          response.message || "Failed to change password. Please try again."
        );
      }
    } catch (error) {
      setPasswordError("An unexpected error occurred.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      showMessage({
        type: "error",
        message: 'Please type "DELETE" to confirm account deletion',
      });
      return;
    }

    setIsDeletingAccount(true);
    try {
      const response = await deleteAccount();
      if (response.success) {
        showMessage({
          type: "success",
          message: "Your account has been deleted successfully.",
        });
        dispatch(setUser(null));
        router.push("/");
      } else {
        showMessage({
          type: "error",
          message: "Failed to delete account. Please try again.",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <motion.div {...slideUp}>
      <h2 className="text-2xl font-semibold mb-6">Security Settings</h2>

      <motion.div
        className="mb-8"
        variants={stagger.container}
        initial="initial"
        animate="animate"
      >
        <motion.h3 className="text-lg font-medium mb-4" variants={stagger.item}>
          Change Password
        </motion.h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <motion.div variants={stagger.item}>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Current Password
            </label>
            <motion.input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
              required
              whileFocus={{ borderColor: "#a855f7" }}
            />
          </motion.div>
          <motion.div variants={stagger.item}>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              New Password
            </label>
            <motion.input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
              required
              whileFocus={{ borderColor: "#a855f7" }}
            />
          </motion.div>
          <motion.div variants={stagger.item}>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <motion.input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
              required
              whileFocus={{ borderColor: "#a855f7" }}
            />
          </motion.div>
          {passwordError && (
            <motion.p
              className="text-rose-500 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {passwordError}
            </motion.p>
          )}
          <motion.div variants={stagger.item}>
            <motion.button
              type="submit"
              disabled={isChangingPassword}
              className="px-6 py-2 bg-purple-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              whileHover={!isChangingPassword ? buttonHover : undefined}
              whileTap={!isChangingPassword ? buttonTap : undefined}
            >
              {isChangingPassword ? (
                <>
                  <motion.div
                    animate={{
                      rotate: 360,
                      transition: {
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      },
                    }}
                    className="mr-2"
                  >
                    <Loader2 className="w-4 h-4" />
                  </motion.div>
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>

      <motion.div
        className="pt-6 border-t border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <h3 className="text-lg font-medium mb-4 text-rose-500">Danger Zone</h3>
        <AnimatePresence mode="wait">
          {!showDeleteConfirm ? (
            <motion.button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2 bg-rose-100 text-rose-700 rounded-md font-medium hover:bg-rose-200"
              whileHover={buttonHover}
              whileTap={buttonTap}
              exit={{ opacity: 0, y: -10 }}
            >
              Delete Account
            </motion.button>
          ) : (
            <motion.div
              className="p-4 bg-rose-50 border-2 border-dashed border-rose-300 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start mb-4">
                <AlertTriangle className="text-rose-500 mr-2 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-rose-700">
                    Delete your account?
                  </h4>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone. All your data, including
                    spaces, threads, and subscriptions will be permanently
                    deleted.
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Type "DELETE" to confirm
                </label>
                <motion.input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md focus:outline-none focus:border-rose-500"
                  whileFocus={{ borderColor: "#f43f5e" }}
                />
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE" || isDeletingAccount}
                  className="px-4 py-2 bg-rose-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  whileHover={
                    deleteConfirmText === "DELETE" &&
                    !isDeletingAccount ?
                    buttonHover : undefined
                  }
                  whileTap={
                    deleteConfirmText === "DELETE" &&
                    !isDeletingAccount ?
                    buttonTap : undefined
                  }
                >
                  {isDeletingAccount ? (
                    <>
                      <motion.div
                        animate={{
                          rotate: 360,
                          transition: {
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          },
                        }}
                        className="mr-2"
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                      Deleting Account...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default SecuritySettings;
