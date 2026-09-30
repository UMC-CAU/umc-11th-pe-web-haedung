import { createContext, useContext } from "react";

export interface User {
  email: string;
  nickname: string;
  profileImage?: string;
}

export interface SignupInput extends User {
  password: string;
}

export type ProfileChanges = Pick<User, "nickname" | "profileImage">;

export interface AuthContextValue {
  user: User | null;
  profile: User;
  updateProfile: (changes: ProfileChanges) => void;
  withdraw: () => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (input: SignupInput) => void;
  isEmailTaken: (email: string) => boolean;
  isNicknameTaken: (nickname: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서만 쓸 수 있어요.");
  }
  return context;
}
