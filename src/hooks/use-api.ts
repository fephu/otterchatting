"use client";

import { baseApi } from "@/lib/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, logout } = useAuthStore.getState();

  const renewToken = async () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const response = await baseApi.api.auth.renew.post();

        if (response.error) throw new Error("Renew failed");

        setToken(response.data.accessToken ?? "");
      } catch (error) {
        logout();
        window.location.href = "/login";
        throw error;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  const apiCall = async <T>(
    callback: () => Promise<{ data?: T; error?: any; status?: number }>
  ) => {
    setIsLoading(true);

    try {
      let result = await callback();

      if (result.error && result.status === 401) {
        await renewToken();
        result = await callback();
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return { apiCall, isLoading };
};
