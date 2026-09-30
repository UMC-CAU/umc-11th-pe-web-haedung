import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent } from "react";
import { useAuth } from "../../auth/auth-context";
import "../auth/auth-page.css";
import "./my-page.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; 

type CheckState = { status: "idle" | "ok" | "error"; message: string };
const IDLE: CheckState = { status: "idle", message: "" };

export function MyPageEdit() {
  const { profile, updateProfile, withdraw, isNicknameTaken } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(profile.nickname);
  const [nicknameCheck, setNicknameCheck] = useState<CheckState>(IDLE);
  const [profileImage, setProfileImage] = useState(profile.profileImage);
  const [imageError, setImageError] = useState("");

  const isNicknameChanged = nickname.trim() !== profile.nickname;

  function checkNickname() {
    const value = nickname.trim();
    if (value.length < 2 || value.length > 12) {
      setNicknameCheck({ status: "error", message: "닉네임은 2~12자로 입력해 주세요." });
    } else if (!isNicknameChanged) {
      setNicknameCheck({ status: "ok", message: "지금 쓰고 있는 닉네임이에요." });
    } else if (isNicknameTaken(value)) {
      setNicknameCheck({ status: "error", message: "이미 사용 중인 닉네임이에요." });
    } else {
      setNicknameCheck({ status: "ok", message: "사용할 수 있는 닉네임이에요." });
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; 
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 올릴 수 있어요.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("5MB 이하의 이미지만 올릴 수 있어요.");
      return;
    }
    setImageError("");
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (isNicknameChanged && nicknameCheck.status !== "ok") {
      setNicknameCheck({ status: "error", message: "닉네임 중복 확인을 해 주세요." });
      return;
    }
    updateProfile({ nickname: nickname.trim(), profileImage });
    navigate({ to: "/mypage" });
  }

  function handleWithdraw() {
    if (!window.confirm("정말 탈퇴할까요? 탈퇴하면 복구할 수 없어요.")) return;
    withdraw();
    navigate({ to: "/" });
  }

  return (
    <main className="mypage mypage-edit">
      <div className="mypage-edit-header">
        <div>
          <h1 className="mypage-title">내 정보 수정</h1>
          <p className="mypage-edit-subtitle">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
        </div>
        <button type="button" className="mypage-edit-button" onClick={handleSave}>
          변경사항 저장
        </button>
      </div>

      <div className="mypage-edit-body">
        <div className="mypage-edit-avatar-area">
          <label className="mypage-edit-avatar" aria-label="프로필 이미지 변경">
            <span className="mypage-avatar">
              {profileImage ? (
                <img src={profileImage} alt="" className="mypage-avatar-photo" />
              ) : (
                <img src="/icons/person.svg" alt="" />
              )}
            </span>
            <span className="mypage-edit-avatar-badge">
              <img src="/icons/edit.svg" alt="" />
            </span>
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </label>
          <p className="mypage-edit-avatar-label">프로필 이미지</p>
          <p className="mypage-edit-avatar-hint">선택 사항 · 최대 5MB</p>
          {imageError && <p className="auth-help is-error">{imageError}</p>}
          {profileImage && (
            <button
              type="button"
              className="mypage-edit-avatar-remove"
              onClick={() => setProfileImage(undefined)}
            >
              기본 이미지로
            </button>
          )}
        </div>

        <div className="mypage-edit-fields">
          <div className="auth-field">
            <label htmlFor="edit-nickname" className="auth-label">
              닉네임
            </label>
            <div
              className={`auth-input-box ${nicknameCheck.status === "error" ? "is-invalid" : ""}`}
            >
              <input
                id="edit-nickname"
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
              <p
                className={`auth-help ${nicknameCheck.status === "ok" ? "is-success" : "is-error"}`}
              >
                {nicknameCheck.message}
              </p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="edit-email" className="auth-label">
              이메일
            </label>
            <div className="auth-input-box">
              <input id="edit-email" value={profile.email} readOnly />
            </div>
          </div>
        </div>
      </div>

      <section className="mypage-withdraw">
        <div>
          <h2 className="mypage-withdraw-title">회원 탈퇴</h2>
          <p className="mypage-withdraw-text">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
          </p>
        </div>
        <button type="button" className="mypage-withdraw-button" onClick={handleWithdraw}>
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
