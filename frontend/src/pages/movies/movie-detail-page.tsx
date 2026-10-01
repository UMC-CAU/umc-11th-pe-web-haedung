import { Link, useParams } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { BookmarkButton } from "../../components/bookmark-button";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  if (!movie) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f5f6f8] px-4 text-center text-2xl font-bold text-[#111]">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f5f6f8]">
      <section
        className="relative h-90 bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.backdropPath})` }}
      >
        {/* 왼쪽을 어둡게 해서 흰 글자가 잘 보이게 */}
        <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/25 to-transparent" />
        <div className="relative flex h-full flex-col justify-between px-4 pt-7 pb-6 text-white md:px-20">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-white no-underline"
          >
            <img src="/icons/chevron-left.svg" alt="" className="size-5 invert" />
            영화 목록
          </Link>
          <div>
            <h1 className="text-[32px] font-extrabold tracking-[-0.03em] md:text-5xl">
              {movie.title}
            </h1>
            <p className="mt-2 text-sm">{movie.originalTitle}</p>
            <p className="mt-2 flex gap-2 text-[13px] font-bold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 px-4 pt-6 pb-15 md:px-20 lg:grid-cols-[200px_1fr_326px]">
        <img
          className="aspect-7/10 w-40 rounded-[10px] object-cover shadow-[0_12px_28px_rgba(0,0,0,0.18)] lg:w-full"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <section className="flex flex-col items-start gap-4 pt-1">
          <h2 className="text-xl font-extrabold text-[#111]">{movie.tagline}</h2>
          <p className="text-[13px] leading-[1.8] text-[#555]">{movie.overview}</p>
          <BookmarkButton movieId={movie.id} variant="label" />
        </section>

        <form
          className="flex flex-col border-t border-[#e5e7eb] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-extrabold text-[#111]">내 평점</h2>
          <p className="mt-1.5 text-[11px] text-[#999]">별점은 필수, 후기는 선택이에요.</p>
          <div className="mt-3 flex gap-1" role="radiogroup" aria-label="별점">
            {[1, 2, 3, 4, 5].map((score) => {
              const isActive = score <= rating;
              return (
                <button
                  key={score}
                  type="button"
                  role="radio"
                  aria-checked={rating === score}
                  aria-label={`${score}점`}
                  className={cn(
                    "flex size-9.5 cursor-pointer items-center justify-center rounded-md border border-[#e5e7eb] bg-white",
                    isActive && "border-[#3b5aff]",
                  )}
                  onClick={() => setRating(score)}
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
            className="mt-2.5 h-25 resize-none rounded-lg border border-[#e5e7eb] bg-white p-3.5 text-[13px] outline-none placeholder:text-[#aaa] focus:border-[#111]"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            value={review}
            onChange={(event) => setReview(event.target.value)}
          />
          <button
            type="submit"
            className="mt-2.5 cursor-pointer rounded-lg bg-[#111] p-3 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled={rating === 0}
          >
            평점 저장
          </button>
        </form>
      </div>
    </main>
  );
}
