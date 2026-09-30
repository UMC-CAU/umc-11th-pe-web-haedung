import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { useAuth } from "../../auth/auth-context";
import "./auth-page.css";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/" />;
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    if (!login(email.trim(), password)) {
      setError("이메일 또는 비밀번호가 올바르지 않아요.");
      return;
    }
    navigate({ to: "/" });
  }

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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error && (
            <p className="auth-help is-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <button type="submit" className="auth-submit">
          로그인
        </button>

        <p className="auth-switch">
          처음이신가요?
          <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </main>
  );
}
