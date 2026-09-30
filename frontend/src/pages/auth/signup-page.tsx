import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { useAuth } from "../../auth/auth-context";
import "./auth-page.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대문자, 소문자, 숫자, 특수문자를 모두 포함한 8자 이상
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const PASSWORD_GUIDE = "영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요";

type CheckState = { status: "idle" | "ok" | "error"; message: string };
const IDLE: CheckState = { status: "idle", message: "" };

export function SignupPage() {
  const { user, signup, isEmailTaken, isNicknameTaken } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [emailCheck, setEmailCheck] = useState<CheckState>(IDLE);
  const [nicknameCheck, setNicknameCheck] = useState<CheckState>(IDLE);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  if (user) {
    return <Navigate to="/" />;
  }

  function checkEmail() {
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setEmailCheck({ status: "error", message: "올바른 이메일 형식을 입력해 주세요." });
    } else if (isEmailTaken(value)) {
      setEmailCheck({ status: "error", message: "이미 사용 중인 이메일이에요." });
    } else {
      setEmailCheck({ status: "ok", message: "사용할 수 있는 이메일이에요." });
    }
  }

  function checkNickname() {
    const value = nickname.trim();
    if (value.length < 2 || value.length > 12) {
      setNicknameCheck({ status: "error", message: "닉네임은 2~12자로 입력해 주세요." });
    } else if (isNicknameTaken(value)) {
      setNicknameCheck({ status: "error", message: "이미 사용 중인 닉네임이에요." });
    } else {
      setNicknameCheck({ status: "ok", message: "사용할 수 있는 닉네임이에요." });
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    let isValid = true;

    if (emailCheck.status !== "ok") {
      setEmailCheck({ status: "error", message: "이메일 중복 확인을 해 주세요." });
      isValid = false;
    }
    if (nicknameCheck.status !== "ok") {
      setNicknameCheck({ status: "error", message: "닉네임 중복 확인을 해 주세요." });
      isValid = false;
    }
    if (!PASSWORD_PATTERN.test(password)) {
      setPasswordError(PASSWORD_GUIDE);
      isValid = false;
    } else {
      setPasswordError("");
    }
    if (password !== passwordConfirm) {
      setConfirmError("비밀번호가 일치하지 않아요.");
      isValid = false;
    } else {
      setConfirmError("");
    }
    if (!isValid) return;

    signup({ email: email.trim(), nickname: nickname.trim(), password });
    navigate({ to: "/login" });
  }

  function helpClass(state: CheckState) {
    return `auth-help ${state.status === "ok" ? "is-success" : "is-error"}`;
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">회원가입</h1>

        <div className="auth-field">
          <label htmlFor="signup-email" className="auth-label">
            이메일
          </label>
          <div className={`auth-input-box ${emailCheck.status === "error" ? "is-invalid" : ""}`}>
            <input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailCheck(IDLE);
              }}
            />
            <button type="button" className="auth-check-button" onClick={checkEmail}>
              중복 확인
            </button>
          </div>
          {emailCheck.message && <p className={helpClass(emailCheck)}>{emailCheck.message}</p>}
        </div>

        <div className="auth-field">
          <label htmlFor="signup-nickname" className="auth-label">
            닉네임
          </label>
          <div className={`auth-input-box ${nicknameCheck.status === "error" ? "is-invalid" : ""}`}>
            <input
              id="signup-nickname"
              placeholder="2~12자"
              maxLength={12}
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value);
                setNicknameCheck(IDLE);
              }}
            />
            <button type="button" className="auth-check-button" onClick={checkNickname}>
              중복 확인
            </button>
          </div>
          {nicknameCheck.message && (
            <p className={helpClass(nicknameCheck)}>{nicknameCheck.message}</p>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password" className="auth-label">
            비밀번호
          </label>
          <div className={`auth-input-box ${passwordError ? "is-invalid" : ""}`}>
            <input
              id="signup-password"
              type="password"
              placeholder="8자 이상"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <p className={`auth-help ${passwordError ? "is-error" : ""}`}>{PASSWORD_GUIDE}</p>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password-confirm" className="auth-label">
            비밀번호 확인
          </label>
          <div className={`auth-input-box ${confirmError ? "is-invalid" : ""}`}>
            <input
              id="signup-password-confirm"
              type="password"
              placeholder="다시 입력"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />
          </div>
          {confirmError && <p className="auth-help is-error">{confirmError}</p>}
        </div>

        <button type="submit" className="auth-submit">
          가입하기
        </button>

        <p className="auth-switch">
          이미 계정이 있나요?
          <Link to="/login">로그인</Link>
        </p>
      </form>
    </main>
  );
}
