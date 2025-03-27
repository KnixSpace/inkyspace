"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            className={`w-full px-4 py-1 text-lg border-2 border-dashed rounded-md focus:outline-none  focus:border-purple-500 transition-all ${
              error ? "border-rose-500" : "border-gray-300"
            }`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="text-rose-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
