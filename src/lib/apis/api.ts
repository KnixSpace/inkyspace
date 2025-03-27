import { showMessage } from "@/components/ui/MessageBox";

const API_BASE_URL = "http://localhost:3000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  headers?: Headers;
  message?: string;
  errors?: { property: string; error: string }[];
}

export type MethodType = "GET" | "POST" | "PUT" | "DELETE";

export const mapApiErrors = (
  errors?: { property: string; error: string }[]
): void => {
  if (errors?.length)
    errors.forEach((e) => {
      showMessage({
        type: "error",
        message: e.error,
      });
    });
  else {
    showMessage({
      type: "error",
      message: "An unexpected error occurred",
    });
  }
};

export const apiRequest = async <T>(
  endpoint: string,
  method: MethodType,
  data?: any,
  headers?: HeadersInit,
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: data ? JSON.stringify(data) : undefined,
      credentials: requiresAuth ? "include" : "omit",
    });

    const result = await response.json();
    return {
      success: response.ok,
      data: result.data,
      headers: response.headers,
      message: result.message,
      errors: result.errors,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};
