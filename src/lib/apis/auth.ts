import { apiRequest } from "./api";

export const loginUser = (email: string, password: string) =>
  apiRequest<{ token: string }>(
    "/auth/login",
    "POST",
    { email, password },
    {},
    true
  );

export const registerUser = (
  name: string,
  email: string,
  password: string,
  role: string
) => apiRequest("/auth/register", "POST", { name, email, password, role });

export const verifyEmail = (token: string) =>
  apiRequest(`/auth/verify-email/${token}`, "GET");

export const resendVerificationEmail = (email: string) =>
  apiRequest("/auth/resend-verification-email", "POST", { email });
