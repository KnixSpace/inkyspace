"use client";
import Logo from "@/components/layout/Logo";
import AuthButton from "@/components/ui/form/AuthButton";
import AuthInput from "@/components/ui/form/AuthInput";
import { showMessage } from "@/components/ui/MessageBox";
import { loginUser } from "@/lib/apis/auth";
import { loginSchema } from "@/lib/validations/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
};

const page = () => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await loginUser(data.email, data.password);

      if (response.success) {
        showMessage({
          type: "success",
          message: "Login successful! Redirecting...",
          duration: 2000,
        });

        router.push("/explore");
      } else {
        showMessage({
          type: "error",
          message:
            response.message || "Login failed. Please check your credentials.",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
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
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AuthInput
            label="Email"
            type="email"
            disabled={isLoading}
            placeholder="your@gmail.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <AuthInput
            label="Password"
            type="password"
            disabled={isLoading}
            placeholder=". . . . . . . ."
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="pt-2">
            <AuthButton type="submit" loading={isLoading} fullWidth>
              Sign In
            </AuthButton>
          </div>
        </form>
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/register?role=U"
              className="text-purple-500 hover:underline"
            >
              Sign up as a reader
            </Link>
            {" or "}
            <Link
              href="/auth/register?role=O"
              className="text-rose-400 hover:underline"
            >
              as a writer
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default page;
