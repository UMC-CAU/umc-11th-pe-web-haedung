import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "../../hooks/use-rating-mutations";
import { useMyRatingsQuery } from "../../hooks/use-my-ratings-query";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

const MAX_COMMENT_LENGTH = 500;

interface RatingFormProps {
  movieId: number;
}

export function RatingForm({ movieId }: RatingFormProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { memberId, ratingsQuery } = useMyRatingsQuery();
  const myRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId);

  const createMutation = useCreateRatingMutation(memberId);
  const updateMutation = useUpdateRatingMutation(memberId);
  const deleteMutation = useDeleteRatingMutation(memberId);

  // 입력 전에는 저장된 내 평점을 보여주고, 입력을 시작하면 입력값을 사용
  const [scoreInput, setScoreInput] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState<string | null>(null);

  const score = scoreInput ?? myRating?.score ?? 0;
  const comment = commentInput ?? myRating?.comment ?? "";

  const isLoggedIn = Boolean(accessToken);
  const isLoadingMyRating = isLoggedIn && (memberId === undefined || ratingsQuery.isPending);
  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const canSubmit =
    isLoggedIn && !isLoadingMyRating && score >= 1 && score <= 5 && !isMutating;

  const resetInputs = () => {
    setScoreInput(null);
    setCommentInput(null);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const trimmedComment = comment.trim();
    const body = { score, comment: trimmedComment || undefined };

    if (myRating) {
      updateMutation.mutate({ ratingId: myRating.ratingId, ...body }, { onSuccess: resetInputs });
    } else {
      createMutation.mutate({ movieId, ...body }, { onSuccess: resetInputs });
    }
  };

  const handleDelete = () => {
    if (!myRating || isMutating) return;
    if (!window.confirm("평점을 삭제할까요?")) return;

    deleteMutation.mutate(myRating.ratingId, { onSuccess: resetInputs });
  };

  return (
    <form
      className="flex flex-col border-t border-[#e5e7eb] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-extrabold text-[#111]">내 평점</h2>
      {isLoggedIn ? (
        <p className="mt-1.5 text-[11px] text-[#999]">별점은 필수, 후기는 선택이에요.</p>
      ) : (
        <p className="mt-1.5 text-[11px] text-[#999]">
          <Link to="/login" className="font-bold text-[#3b5aff]">
            로그인
          </Link>
          하면 평점을 남길 수 있어요.
        </p>
      )}
      <div className="mt-3 flex gap-1" role="radiogroup" aria-label="별점">
        {[1, 2, 3, 4, 5].map((value) => {
          const isActive = value <= score;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={score === value}
              aria-label={`${value}점`}
              disabled={!isLoggedIn || isLoadingMyRating}
              className={cn(
                "flex size-9.5 cursor-pointer items-center justify-center rounded-md border border-[#e5e7eb] bg-white disabled:cursor-not-allowed",
                isActive && "border-[#3b5aff]",
              )}
              onClick={() => setScoreInput(value)}
            >
              <img
                src="/icons/star.svg"
                alt=""
                className={cn(
                  "size-5.5 opacity-60",
                  // 검은 별 → 노란 별
                  isActive &&
                    "opacity-100 filter-[invert(76%)_sepia(61%)_saturate(1000%)_hue-rotate(358deg)]",
                )}
              />
            </button>
          );
        })}
      </div>
      <textarea
        className="mt-2.5 h-25 resize-none rounded-lg border border-[#e5e7eb] bg-white p-3.5 text-[13px] outline-none placeholder:text-[#aaa] focus:border-[#111] disabled:bg-[#f6f7f9]"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        maxLength={MAX_COMMENT_LENGTH}
        disabled={!isLoggedIn || isLoadingMyRating}
        value={comment}
        onChange={(event) => setCommentInput(event.target.value)}
      />
      <button
        type="submit"
        className="mt-2.5 cursor-pointer rounded-lg bg-[#111] p-3 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!canSubmit}
      >
        {createMutation.isPending || updateMutation.isPending
          ? "저장 중"
          : myRating
            ? "평점 수정"
            : "평점 저장"}
      </button>
      {myRating && (
        <button
          type="button"
          className="mt-2 cursor-pointer rounded-lg border border-[#e5e7eb] bg-white p-3 text-[13px] font-bold text-[#616773] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isMutating}
          onClick={handleDelete}
        >
          {deleteMutation.isPending ? "삭제 중" : "평점 삭제"}
        </button>
      )}
    </form>
  );
}
