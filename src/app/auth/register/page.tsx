"use client";

import Logo from "@/components/layout/Logo";
import AuthButton from "@/components/ui/form/AuthButton";
import AuthInput from "@/components/ui/form/AuthInput";
import { showMessage } from "@/components/ui/MessageBox";
import { mapApiErrors } from "@/lib/apis/api";
import { registerUser, resendVerificationEmail } from "@/lib/apis/auth";
import { registerSchema } from "@/lib/validations/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "U" | "O";
};

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(15);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const userRoleParams = searchParams.get("role") || "U";
  const getRoleLabel = () => (userRoleParams === "U" ? "Reader" : "Writer");

  const resendDelay = () => {
    const interval = setInterval(() => {
      setCounter((prev) => prev - 1);
      if (counter === 0) clearInterval(interval);
    }, 1000);
    setCounter(15);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: { role: userRoleParams as "U" | "O" },
  });

  useEffect(() => {
    if (!["U", "O"].includes(userRoleParams)) {
      router.push("/auth/register?role=U");
    }
    setValue("role", userRoleParams as "U" | "O");
  }, [userRoleParams]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    resendDelay();
    try {
      const response = await registerUser(
        data.name,
        data.email,
        data.password,
        data.role
      );

      if (response.success) {
        setRegisteredEmail(data.email);
        showMessage({
          type: "success",
          message:
            "Registration successful! Please check your email for verification.",
        });
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

  const handleResendVerification = async () => {
    if (!registeredEmail) return;

    setIsLoading(true);
    resendDelay();
    try {
      const response = await resendVerificationEmail(registeredEmail);

      if (response.success) {
        showMessage({
          type: "success",
          message: "Verification email resent successfully!",
        });
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
        {registeredEmail ? (
          <div className="text-center">
            <div className="mb-4 text-5xl">✉️</div>
            <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
            <p className="mb-2 text-gray-600">
              We've sent a verification email to{" "}
              <strong>{registeredEmail}</strong>. Please check your inbox and
              click the verification link.
            </p>
            {counter > 0 && (
              <p className="mb-6 text-gray-600">
                Wait {counter > 0 && `(${counter})`} for resend link
              </p>
            )}
            <div className="space-y-3">
              <AuthButton
                onClick={handleResendVerification}
                loading={isLoading}
                disabled={counter > 0}
                fullWidth
              >
                Resend Verification Email
              </AuthButton>
              <Link href="/auth/login">
                <AuthButton variant="outline" fullWidth>
                  Back to Login
                </AuthButton>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <Logo
                H1="text-3xl font-medium"
                SPAN="underline-offset-4 decoration-2"
              />
              <p className="mt-2 text-gray-600">
                Sign up as a{" "}
                <span
                  className={
                    userRoleParams === "U" ? "text-purple-500" : "text-rose-400"
                  }
                >
                  {getRoleLabel()}{" "}
                </span>
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AuthInput
                label="Name"
                type="text"
                placeholder="John Doe"
                disabled={isLoading}
                error={errors.name?.message}
                {...register("name")}
              />
              <AuthInput
                label="Email"
                type="email"
                placeholder="your@email.com"
                disabled={isLoading}
                error={errors.email?.message}
                {...register("email")}
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

              <input type="hidden" {...register("role")} />

              <div>
                <AuthButton type="submit" loading={isLoading} fullWidth>
                  Create Account
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
              {userRoleParams === "U" ? (
                <p className="mt-2 text-gray-600">
                  Want to create content?{" "}
                  <Link
                    href="/auth/register?role=O"
                    className="text-rose-400 hover:underline"
                  >
                    Sign up as a writer
                  </Link>
                </p>
              ) : (
                <p className="mt-2 text-gray-600">
                  Just want to read?{" "}
                  <Link
                    href="/auth/register?role=U"
                    className="text-purple-500 hover:underline"
                  >
                    Sign up as a reader
                  </Link>
                </p>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default page;
