import { useState, type ReactNode } from "react";
import {
  AuthContext,
  type ProfileChanges,
  type SignupInput,
  type User,
} from "./auth-context";

const USER_KEY = "umcine-user";
const ACCOUNTS_KEY = "umcine-accounts";
const DEMO_PROFILE_KEY = "umcine-demo-profile";

const DEMO_PROFILE: User = {
  email: "gwangsoo@cinemalab.kr",
  nickname: "gs0428",
};

function load<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load(USER_KEY, null));
  const [accounts, setAccounts] = useState<SignupInput[]>(() =>
    load(ACCOUNTS_KEY, []),
  );
  const [demoProfile, setDemoProfile] = useState<User>(() =>
    load(DEMO_PROFILE_KEY, DEMO_PROFILE),
  );

  function updateUser(nextUser: User | null) {
    setUser(nextUser);
    save(USER_KEY, nextUser);
  }

  function updateAccounts(nextAccounts: SignupInput[]) {
    setAccounts(nextAccounts);
    save(ACCOUNTS_KEY, nextAccounts);
  }

  function login(email: string, password: string) {
    const account = accounts.find(
      (item) => item.email === email && item.password === password,
    );
    if (!account) return false;

    updateUser({
      email: account.email,
      nickname: account.nickname,
      profileImage: account.profileImage,
    });
    return true;
  }

  function logout() {
    updateUser(null);
  }

  function signup(input: SignupInput) {
    updateAccounts([...accounts, input]);
  }

  function isEmailTaken(email: string) {
    return accounts.some((item) => item.email === email);
  }

  function isNicknameTaken(nickname: string) {
    return accounts.some((item) => item.nickname === nickname);
  }

  function updateProfile(changes: ProfileChanges) {
    if (!user) {
      const nextProfile = { ...demoProfile, ...changes };
      setDemoProfile(nextProfile);
      save(DEMO_PROFILE_KEY, nextProfile);
      return;
    }
    updateUser({ ...user, ...changes });
    updateAccounts(
      accounts.map((item) =>
        item.email === user.email ? { ...item, ...changes } : item,
      ),
    );
  }

  function withdraw() {
    if (!user) {
      setDemoProfile(DEMO_PROFILE);
      save(DEMO_PROFILE_KEY, null);
      return;
    }
    updateAccounts(accounts.filter((item) => item.email !== user.email));
    updateUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user ?? demoProfile,
        login,
        logout,
        signup,
        isEmailTaken,
        isNicknameTaken,
        updateProfile,
        withdraw,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
