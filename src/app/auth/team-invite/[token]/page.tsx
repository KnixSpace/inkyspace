"use client";

import Logo from "@/components/layout/Logo";
import AuthButton from "@/components/ui/form/AuthButton";
import AuthInput from "@/components/ui/form/AuthInput";
import { showMessage } from "@/components/ui/MessageBox";
import { mapApiErrors } from "@/lib/apis/api";
import { editorRegisterSchema } from "@/lib/validations/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptInvite, verifyEditorInvite } from "@/lib/apis/invite";

type EditorRegisterFormData = {
  name: string;
  password: string;
  confirmPassword: string;
};

interface InviteDetails {
  isAccepted: boolean;
  valid: boolean;
}

export default function EditorInvitePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(
    null
  );
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditorRegisterFormData>({
    resolver: yupResolver(editorRegisterSchema),
  });

  useEffect(() => {
    const verifyInvite = async () => {
      setIsVerifying(true);
      try {
        const response = await verifyEditorInvite(token);
        if (response.success && response.data) {
          setInviteDetails({
            isAccepted: response.data.isAccepted,
            valid: response.data.isAccepted ? false : true,
          });
        } else {
          mapApiErrors(response.errors);
          setInviteDetails({ isAccepted: false, valid: false });
        }
      } catch (error) {
        showMessage({
          type: "error",
          message: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    if (token) {
      verifyInvite();
    }
  }, [token]);

  const onSubmit = async (data: EditorRegisterFormData) => {
    if (!inviteDetails?.valid) return;

    setIsLoading(true);
    try {
      const response = await acceptInvite(token, data.name, data.password);

      if (response.success) {
        showMessage({
          type: "success",
          message: "Registration successful! You are now logged in.",
          duration: 3000,
        });

        router.push("/explore");
      } else {
        mapApiErrors(response.errors);
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white p-8 rounded-lg border-2 border-dashed border-gray-300"
      >
        <div className="text-center mb-6">
          <Logo
            H1="text-3xl font-medium"
            SPAN="underline-offset-4 decoration-2"
          />
          <p className="mt-2 text-gray-600">Join as an editor</p>
        </div>

        {isVerifying ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying invitation...</p>
          </div>
        ) : !inviteDetails?.valid ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
            {inviteDetails?.isAccepted ? (
              <p className="text-gray-600 mb-6">
                This invitation has already been accepted. Please contact the
                Owner for a new invitation.
              </p>
            ) : (
              <p className="text-gray-600 mb-6">
                This invitation is invalid or has expired. Please contact the
                Owner for resend or new invitation.
              </p>
            )}
            <Link href="/auth/login">
              <AuthButton variant="outline" fullWidth>
                Back to Login
              </AuthButton>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-6">
              <p className="text-sm text-gray-700">
                You've been invited to join as an editor.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AuthInput
                label="Your Name"
                type="text"
                placeholder="John Doe"
                disabled={isLoading}
                error={errors.name?.message}
                {...register("name")}
              />

              <AuthInput
                label="Password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                error={errors.password?.message}
                {...register("password")}
              />

              <AuthInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <div className="pt-2">
                <AuthButton type="submit" loading={isLoading} fullWidth>
                  Complete Registration
                </AuthButton>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-purple-500 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
