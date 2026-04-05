import { create } from "zustand";

import {
  type LoginPayload,
  login as loginRequest,
  register as registerRequest,
  type RegisterPayload,
} from "@/services/auth.service";

type JwtUserPayload = {
  sub: number | string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  [key: string]: unknown;
};

type AuthState = {
  user: JwtUserPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<JwtUserPayload>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AUTH_TOKEN_STORAGE_KEY = "gc_access_token";

function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

function setStoredToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

function clearStoredToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

function decodeJwtPayload(token: string): JwtUserPayload | null {
  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    const parsed = JSON.parse(decoded) as JwtUserPayload;

    return parsed;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: JwtUserPayload) {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds;
}

function getInitialAuthState() {
  const storedToken = getStoredToken();

  if (!storedToken) {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }

  const decodedUser = decodeJwtPayload(storedToken);

  if (!decodedUser || isTokenExpired(decodedUser)) {
    clearStoredToken();
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }

  return {
    token: storedToken,
    user: decodedUser,
    isAuthenticated: true,
  };
}

const initial = getInitialAuthState();

export const useAuthStore = create<AuthState>((set) => ({
  user: initial.user,
  token: initial.token,
  isAuthenticated: initial.isAuthenticated,
  isLoading: false,
  error: null,

  login: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const { access_token } = await loginRequest(payload);
      const decodedUser = decodeJwtPayload(access_token);

      if (!decodedUser || isTokenExpired(decodedUser)) {
        throw new Error("Received invalid access token.");
      }

      setStoredToken(access_token);

      set({
        token: access_token,
        user: decodedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return decodedUser;
    } catch (error) {
      clearStoredToken();
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed.",
      });

      throw error;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      await registerRequest(payload);
      set({ isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed.",
      });

      throw error;
    }
  },

  logout: () => {
    clearStoredToken();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));
