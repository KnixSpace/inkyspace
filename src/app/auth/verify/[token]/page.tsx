"use client";

import AuthButton from "@/components/ui/form/AuthButton";
import { showMessage } from "@/components/ui/MessageBox";
import { mapApiErrors } from "@/lib/apis/api";
import { verifyEmail } from "@/lib/apis/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

enum verificationStatus {
  LOADING = 0,
  SUCCESS = 1,
  ERROR = 2,
  IDLE = 3,
}

export default function EmailVerificationPage() {
  const [status, setStatus] = useState<verificationStatus>(
    verificationStatus.IDLE
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const handleVerification = async () => {
    if (!token) return;

    setIsVerifying(true);
    setStatus(verificationStatus.LOADING);

    try {
      const response = await verifyEmail(token);
      if (response.success) {
        setStatus(verificationStatus.SUCCESS);
        showMessage({
          type: "success",
          message:
            "Your email has been verified successfully! You can now log in to your account.",
          duration: 3000,
        });

        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setStatus(verificationStatus.ERROR);
        mapApiErrors(response.errors);
      }
    } catch (error) {
      setStatus(verificationStatus.ERROR);
      showMessage({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-lg border-2 border-dashed border-gray-300 text-center"
      >
        <div className="mb-4 text-5xl">
          {status === verificationStatus.IDLE && "✉️"}
        </div>

        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>

        {status === verificationStatus.SUCCESS ? (
          <div>
            <p className="mb-6 text-gray-600">
              Your email has been verified successfully! You can now log in to
              your account.
            </p>
            <Link href="/auth/login">
              <AuthButton fullWidth>Go to Login</AuthButton>
            </Link>
          </div>
        ) : status === verificationStatus.ERROR ? (
          <div>
            <p className="mb-6 text-gray-600">
              We couldn't verify your email. The verification link may have
              expired or is invalid.
            </p>
            <div className="space-y-3">
              <Link href="/auth/login">
                <AuthButton fullWidth>Go to Login</AuthButton>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-gray-600">
              Please click the button below to verify your email address and
              activate your account.
            </p>
            <div className="space-y-3">
              <AuthButton
                onClick={handleVerification}
                loading={isVerifying}
                fullWidth
              >
                Verify Email
              </AuthButton>
              <Link href="/auth/login">
                <AuthButton variant="outline" fullWidth>
                  Back to Login
                </AuthButton>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
