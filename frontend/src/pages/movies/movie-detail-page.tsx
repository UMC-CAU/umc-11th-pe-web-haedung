import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { cn } from "../../utils/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

function StatusMessage({ message }: { message: string }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#f5f6f8] px-4 text-center text-2xl font-bold text-[#111]">
      {message}
    </main>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [prevMovieId, setPrevMovieId] = useState(movieId);

  // 다른 영화로 이동하면 이전 상태를 렌더 중에 초기화한다 (effect 안에서 setState 하지 않기 위해)
  if (movieId !== prevMovieId) {
    setPrevMovieId(movieId);
    setMovie(null);
    setErrorMessage(null);
    setIsLoading(isValidMovieId);
  }

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (!isValidMovieId) return;

    let ignore = false;

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error: unknown) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  if (!isValidMovieId) {
    return <StatusMessage message="올바르지 않은 영화 번호예요." />;
  }

  if (isLoading) {
    return <StatusMessage message="영화 정보를 불러오는 중이에요..." />;
  }

  if (errorMessage) {
    return <StatusMessage message={errorMessage} />;
  }

  if (!movie) {
    return <StatusMessage message="영화를 찾을 수 없어요." />;
  }

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <section
        className="relative h-90 bg-[#222] bg-cover bg-center"
        style={
          movie.backdrop_path
            ? { backgroundImage: `url(${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path})` }
            : undefined
        }
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
            <p className="mt-2 text-sm">{movie.original_title}</p>
            <p className="mt-2 flex gap-2 text-[13px] font-bold">
              <span>{movie.release_date}</span>
              <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 px-4 pt-6 pb-15 md:px-20 lg:grid-cols-[200px_1fr_326px]">
        {movie.poster_path ? (
          <img
            className="aspect-7/10 w-40 rounded-[10px] object-cover shadow-[0_12px_28px_rgba(0,0,0,0.18)] lg:w-full"
            src={`${TMDB_POSTER_BASE_URL}${movie.poster_path}`}
            alt={`${movie.title} 포스터`}
          />
        ) : (
          <div className="aspect-7/10 w-40 rounded-[10px] bg-[#e5e7eb] lg:w-full" />
        )}

        <section className="flex flex-col items-start gap-4 pt-1">
          {movie.tagline && (
            <h2 className="text-xl font-extrabold text-[#111]">{movie.tagline}</h2>
          )}
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