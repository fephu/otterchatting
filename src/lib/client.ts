import { treaty } from "@elysiajs/eden";
import type { App } from "../app/api/[[...slugs]]/route";
import { useAuthStore } from "@/stores/useAuthStore";

export const client = treaty<App>("localhost:3000", {
  headers: {
    "Content-Type": "application/json",
  },
}).api;

export const getAuthHeaders = () => {
  const storeState = useAuthStore.getState().token;

  return {
    Authorization: storeState ? `Bearer ${storeState}` : "",
    "Content-Type": "application/json",
  };
};
