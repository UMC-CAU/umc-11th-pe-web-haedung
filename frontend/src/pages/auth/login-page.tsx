import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import "./auth-page.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">로그인</h1>

        <div className="auth-field">
          <label htmlFor="login-email" className="auth-label">
            이메일
          </label>
          <div className="auth-input-box">
            <img src="/icons/mail.svg" alt="" />
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              value={form.email}
              onChange={(event) => handleChangeField("email", event.target.value)}
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="login-password" className="auth-label">
            비밀번호
          </label>
          <div className="auth-input-box">
            <img src="/icons/lock.svg" alt="" />
            <input
              id="login-password"
              type="password"
              placeholder="비밀번호"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => handleChangeField("password", event.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={!canSubmit || loginMutation.isPending}
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="auth-switch">
          처음이신가요?
          <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </main>
  );
}
