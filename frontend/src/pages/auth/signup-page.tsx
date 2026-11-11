import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { useAuth } from "../../auth/auth-context";
import "./auth-page.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대문자, 소문자, 숫자, 특수문자를 모두 포함한 8자 이상
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const PASSWORD_GUIDE = "영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요";

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultForm = typeof DEFAULT_FORM;
type DefaultFormKey = keyof DefaultForm;
type DefaultFormValue = DefaultForm[DefaultFormKey];

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  const trimmedNickname = form.nickname.trim();
  const isEmailValid = EMAIL_PATTERN.test(form.email.trim());
  const isNicknameValid = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isPasswordValid = PASSWORD_PATTERN.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid && duplicateCheck.email.isAvailable && duplicateCheck.nickname.isAvailable;

  // 입력을 시작한 뒤 형식이 틀렸을 때만 오류로 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showConfirmError = form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  if (user) {
    return <Navigate to="/" />;
  }

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(isAvailable ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // passwordConfirm은 화면에서만 검사하므로 요청에 포함하지 않음
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-title">회원가입</h1>

        <div className="auth-field">
          <label htmlFor="signup-email" className="auth-label">
            이메일
          </label>
          <div className={`auth-input-box ${showEmailError ? "is-invalid" : ""}`}>
            <input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              value={form.email}
              disabled={duplicateCheck.email.isChecking}
              onChange={(event) => handleChangeField("email", event.target.value)}
            />
            <button
              type="button"
              className="auth-check-button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && <p className="auth-help is-error">올바른 이메일 형식을 입력해 주세요.</p>}
        </div>

        <div className="auth-field">
          <label htmlFor="signup-nickname" className="auth-label">
            닉네임
          </label>
          <div className={`auth-input-box ${showNicknameError ? "is-invalid" : ""}`}>
            <input
              id="signup-nickname"
              placeholder="2~12자"
              maxLength={12}
              value={form.nickname}
              disabled={duplicateCheck.nickname.isChecking}
              onChange={(event) => handleChangeField("nickname", event.target.value)}
            />
            <button
              type="button"
              className="auth-check-button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && <p className="auth-help is-error">닉네임은 2~12자로 입력해 주세요.</p>}
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password" className="auth-label">
            비밀번호
          </label>
          <div className={`auth-input-box ${showPasswordError ? "is-invalid" : ""}`}>
            <input
              id="signup-password"
              type="password"
              placeholder="8자 이상"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => handleChangeField("password", event.target.value)}
            />
          </div>
          <p className={`auth-help ${showPasswordError ? "is-error" : ""}`}>{PASSWORD_GUIDE}</p>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password-confirm" className="auth-label">
            비밀번호 확인
          </label>
          <div className={`auth-input-box ${showConfirmError ? "is-invalid" : ""}`}>
            <input
              id="signup-password-confirm"
              type="password"
              placeholder="다시 입력"
              autoComplete="new-password"
              value={form.passwordConfirm}
              onChange={(event) => handleChangeField("passwordConfirm", event.target.value)}
            />
          </div>
          {showConfirmError && <p className="auth-help is-error">비밀번호가 일치하지 않아요.</p>}
        </div>

        <button type="submit" className="auth-submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="auth-switch">
          이미 계정이 있나요?
          <Link to="/login">로그인</Link>
        </p>
      </form>
    </main>
  );
}
