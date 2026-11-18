import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useAuth } from "../../auth/auth-context";
import { useMeQuery } from "../../hooks/use-me-query";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import "../auth/auth-page.css";
import "./my-page.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; 

export function MyPageEdit() {
  const { profile, updateProfile, withdraw } = useAuth();
  const navigate = useNavigate();
  const { data: me } = useMeQuery();
  const updateMeMutation = useUpdateMeMutation();

  // 입력 전에는 조회한 내 닉네임을 보여주고, 입력을 시작하면 입력값을 사용
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState(profile.profileImage);
  const [imageError, setImageError] = useState("");

  const nicknameValue = nicknameInput ?? me?.nickname ?? "";
  const nickname = nicknameValue.trim();
  const canSubmit = nickname.length >= 2 && nickname.length <= 12;
  const showNicknameError = nicknameValue.length > 0 && !canSubmit;

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

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    // 프로필 이미지는 서버 API가 없어 기존처럼 브라우저에만 저장
    updateProfile({ nickname, profileImage });
    updateMeMutation.mutate(
      { nickname },
      { onSuccess: () => navigate({ to: "/mypage" }) },
    );
  };

  function handleWithdraw() {
    if (!window.confirm("정말 탈퇴할까요? 탈퇴하면 복구할 수 없어요.")) return;
    withdraw();
    navigate({ to: "/" });
  }

  return (
    <form className="mypage mypage-edit" onSubmit={handleSubmit} noValidate>
      <div className="mypage-edit-header">
        <div>
          <h1 className="mypage-title">내 정보 수정</h1>
          <p className="mypage-edit-subtitle">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
        </div>
        <button
          type="submit"
          className="mypage-edit-button"
          disabled={!canSubmit || updateMeMutation.isPending}
        >
          {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
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
            <div className={`auth-input-box ${showNicknameError ? "is-invalid" : ""}`}>
              <input
                id="edit-nickname"
                maxLength={12}
                value={nicknameValue}
                onChange={(event) => setNicknameInput(event.target.value)}
              />
            </div>
            {showNicknameError && (
              <p className="auth-help is-error">닉네임은 2~12자로 입력해 주세요.</p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="edit-email" className="auth-label">
              이메일
            </label>
            <div className="auth-input-box">
              <input id="edit-email" value={me?.email ?? ""} readOnly />
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
    </form>
  );
}
