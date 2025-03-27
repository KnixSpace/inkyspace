"use client";

import { apiRequest } from "@/lib/apis/api";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { User } from "@/types/user";
import { ReactNode, useEffect } from "react";

const Auth = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  const checkAuth = async () => {
    try {
      const response = await apiRequest<{ user: User }>(
        "/auth/user",
        "GET",
        null,
        {},
        true
      );
      if (response.success) {
        if (response.data?.user) {
          dispatch(setUser(response.data.user));
        }
      }
    } catch (error: any) {
      console.log(error.response.errors);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default Auth;
