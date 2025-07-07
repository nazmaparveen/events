import { create } from "zustand";

type AuthStore = {
  email: string | null;
  login: (email: string) => void;
  logout: () => void;
};

export const useAuth = create<AuthStore>((set) => ({
  email: null,
  login: (email) => set({ email }),
  logout: () => set({ email: null }),
}));
