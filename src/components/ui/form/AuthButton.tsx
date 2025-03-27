"use client";

import { Loader2 } from "lucide-react";

export type ButtonVariants = "primary" | "secondary" | "outline" | null;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: ButtonVariants;
  fullWidth?: boolean;
}

export default function AuthButton({
  children,
  loading,
  variant = null,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const getVariantClasses = (variant: ButtonVariants | null) => {
    switch (variant) {
      case "primary":
        return "bg-rose-400 text-white hover:bg-rose-500";
      case "secondary":
        return "bg-purple-500 text-white hover:bg-purple-600";
      case "outline":
        return "bg-transparent border-2 border-dashed border-black text-black hover:bg-gray-50";
      default:
        return "bg-black text-white hover:bg-gray-800";
    }
  };
  return (
    <button
      className={`px-6 py-1 rounded-md text-lg font-medium transition-all flex justify-center items-center ${getVariantClasses(variant)} ${
        fullWidth ? "w-full" : ""
      } ${props.disabled || loading ? "opacity-70 cursor-not-allowed" : ""}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
