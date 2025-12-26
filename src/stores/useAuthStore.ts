import { baseApi } from "@/lib/client";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,

      setToken: (token) =>
        set({
          token,
          isAuthenticated: Boolean(token),
        }),

      setUser: (user) => set({ user }),

      setLoading: (loading) => set({ loading }),

      logout: async () => {
        await baseApi.api.auth.logout.post(null);
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      refreshUser: async () => {
        set({ loading: true });
        try {
          const response = await baseApi.api.auth.me.get();

          set({
            user: response.data?.user,
            isAuthenticated: true,
            loading: false,
          });
        } catch (e) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
          throw e;
        }
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
