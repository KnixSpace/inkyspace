"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useState } from "react";
import { showMessage } from "../ui/MessageBox";
import { setCurrentStep, setIsLoading } from "@/redux/features/onboardingSlice";
import { inviteEditors } from "@/lib/apis/onboarding";
import { motion } from "framer-motion";
import { Loader2, Plus, X } from "lucide-react";

const EditorInvitationStep = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.onboarding);
  const { user } = useAppSelector((state) => state.user);
  const [email, setEmail] = useState<string>("");
  const [emails, setEmails] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddEmail = () => {
    if (emails.length >= 5) {
      setEmailError("You can only invite up to 5 editors at a time");
      return;
    }

    if (!email.trim()) {
      setEmailError("Email cannot be empty");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (email === user?.email) {
      setEmailError("You cannot invite yourself");
      return;
    }

    if (emails.includes(email)) {
      setEmailError("This email has already been added");
      return;
    }

    setEmails([email, ...emails]);
    setEmail("");
    setEmailError("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleInvite = async () => {
    if (emails.length === 0) {
      showMessage({
        type: "error",
        message: "Please add at least one email to invite editors.",
      });
      return;
    }

    dispatch(setIsLoading(true));
    try {
      const response = await inviteEditors(emails);
      if (response.success) {
        showMessage({
          type: "success",
          message: `Successfully sent invitations to editors.`,
        });
        dispatch(setCurrentStep(1));
      } else {
        showMessage({
          type: "error",
          message: "Failed to send invitations. Please try again.",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleSkip = () => {
    dispatch(setCurrentStep(1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Invite editors to collaborate</h3>
        <p className="text-gray-600">
          Add email addresses of people you'd like to invite as editors to your
          space.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex mb-4 gap-2 items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter email address"
            className={`flex-1 p-2 border-2 border-dashed rounded-md ${
              emailError ? "border-rose-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          <button
            onClick={handleAddEmail}
            disabled={isLoading}
            className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center "
          >
            <Plus size={20} />
          </button>
        </div>
        {emailError && (
          <p className="text-rose-500 text-sm mb-2">{emailError}</p>
        )}

        <h4 className="text-lg font-semibold">Invited Editors</h4>
        <div className="mt-1 overflow-y-auto max-h-40">
          {emails.length > 0 ? (
            <div
              className={`grid grid-cols-1 ${emails.length > 1 && "sm:grid-cols-2"} gap-3`}
            >
              {emails.map((email, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-2 bg-purple-50 rounded-md"
                >
                  <span>{email}</span>
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className="text-gray-500 hover:text-rose-500"
                    disabled={isLoading}
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No emails added yet</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <button
            onClick={handleSkip}
            className="px-6 py-2 border-2 border-dashed border-gray-300 rounded-md font-medium hover:bg-gray-50 mr-2"
            disabled={isLoading}
          >
            Skip
          </button>
        </div>
        <button
          onClick={handleInvite}
          disabled={emails.length === 0 || isLoading}
          className="px-6 py-2 bg-purple-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Send Invitations
        </button>
      </div>
    </motion.div>
  );
};

export default EditorInvitationStep;
