import { treaty } from "@elysiajs/eden";
import type { App } from "../app/api/[[...slugs]]/route";
import { useAuthStore } from "@/stores/useAuthStore";

export const createApiClient = () => {
  const getToken = () => {
    if (typeof window !== "undefined") {
      return useAuthStore.getState().token;
    }
    return null;
  };

  return treaty<App>(
    process.env.NODE_ENV === "production"
      ? "otterchatting.vercel.app"
      : "localhost:3000",
    {
      headers: {
        get authorization() {
          const token = getToken();
          return token ? `Bearer ${token}` : "";
        },
      },
    }
  );
};

export const baseApi = createApiClient();
