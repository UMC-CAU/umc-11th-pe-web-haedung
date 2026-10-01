import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "label";
}

export function BookmarkButton({ movieId, variant = "icon" }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const iconSrc = isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg";

  if (variant === "label") {
    return (
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#3b5aff] px-4 py-2.5 text-[13px] font-bold text-white"
        aria-pressed={isBookmarked}
        onClick={() => toggleBookmark(movieId)}
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
        "absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-lg border-2 border-white bg-black",
        isBookmarked && "bg-[#3b5aff]",
      )}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img src={iconSrc} alt="" className="invert" />
    </button>
  );
}
