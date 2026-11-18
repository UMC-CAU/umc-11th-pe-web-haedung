import { useNavigate } from "@tanstack/react-router";
import { useFavoritesQuery } from "../hooks/use-favorites-query";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../hooks/use-favorite-mutations";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "label";
}

export function BookmarkButton({ movieId, variant = "icon" }: BookmarkButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: favorites = [] } = useFavoritesQuery();
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();

  const isBookmarked = favorites.some((favorite) => favorite.movieId === movieId);
  const isPending = addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인하면 즐겨찾기할 수 있어요.");
      navigate({ to: "/login" });
      return;
    }
    if (isPending) return;

    if (isBookmarked) {
      removeFavoriteMutation.mutate(movieId);
    } else {
      addFavoriteMutation.mutate(movieId);
    }
  };

  const iconSrc = isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg";

  if (variant === "label") {
    return (
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#3b5aff] px-4 py-2.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        aria-pressed={isBookmarked}
        disabled={isPending}
        onClick={handleClick}
      >
        <img src={iconSrc} alt="" className="size-4.5 invert" />
        {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-lg border-2 border-white bg-black disabled:cursor-not-allowed disabled:opacity-60",
        isBookmarked && "bg-[#3b5aff]",
      )}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      disabled={isPending}
      onClick={handleClick}
    >
      <img src={iconSrc} alt="" className="invert" />
    </button>
  );
}
