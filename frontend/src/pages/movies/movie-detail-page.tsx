import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { BookmarkButton } from "../../components/bookmark-button";
import { RatingForm } from "../../components/movies/rating-form";
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
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  if (!isValidMovieId) {
    return <StatusMessage message="올바르지 않은 영화 번호예요." />;
  }

  if (movieDetailQuery.isPending) {
    return <StatusMessage message="영화 정보를 불러오는 중이에요..." />;
  }

  if (movieDetailQuery.isError) {
    return <StatusMessage message={getMovieDetailErrorMessage(movieDetailQuery.error)} />;
  }

  const movie = movieDetailQuery.data;

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

        <RatingForm key={movie.id} movieId={movie.id} />
      </div>
    </main>
  );
}