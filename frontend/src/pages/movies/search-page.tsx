import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/bookmark-button";
import { cn } from "../../utils/cn";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  const normalizedQuery = (query ?? "").trim();

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(normalizedQuery));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 검색어가 바뀌면 이전 결과를 렌더 중에 초기화한다 (effect 안에서 setState 하지 않기 위해)
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
    setMovies([]);
    setErrorMessage(null);
    setIsLoading(Boolean(normalizedQuery));
  }

  useEffect(() => {
    if (!normalizedQuery) return;

    let ignore = false;

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [normalizedQuery]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  const hasQuery = Boolean(query?.trim());

  return (
    <main
      className={cn(
        "flex-1 bg-[#f5f6f8] px-4 pt-50 pb-10",
        hasQuery && "px-4 pt-8 pb-10 md:px-20 md:pb-15",
      )}
    >
      <h1
        className={cn(
          "mb-10 text-center text-[44px] font-extrabold tracking-[-0.02em] text-[#111]",
          hasQuery && "mb-5 text-left text-4xl",
        )}
      >
        {hasQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
      </h1>
      <form
        className={cn(
          "mx-auto flex max-w-196 items-center gap-3 rounded-xl border-2 border-[#111] bg-white py-3.5 pr-4 pl-6 shadow-[0_12px_24px_rgba(0,0,0,0.08)]",
          hasQuery &&
            "max-w-none border border-[#e5e7eb] py-2 pr-3 pl-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)]",
        )}
        onSubmit={handleSubmit}
      >
        <img src="/icons/search.svg" alt="" className="size-5 opacity-60" />
        <input
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#aaa]"
          aria-label="검색어"
          placeholder="예: 스파이더맨"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        {searchText && (
          <button
            type="button"
            className="flex size-8 cursor-pointer items-center justify-center"
            aria-label="검색어 지우기"
            onClick={() => setSearchText("")}
          >
            <img src="/icons/close.svg" alt="" className="size-5" />
          </button>
        )}
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-[#111] px-4.5 py-2.5 text-sm font-semibold text-white hover:bg-[#333]"
        >
          {hasQuery ? "다시 검색" : "검색"}
        </button>
      </form>

      {hasQuery && (
        <section>
          <div className="mt-6 flex items-center justify-between border-b border-[#e5e7eb] pb-4">
            <h2 className="text-lg font-bold">‘{query}’ 검색 결과</h2>
            <p className="text-xs text-[#999]">영화 {movies.length}편</p>
          </div>
          {isLoading ? (
            <p className="py-10 text-center text-[#888]">검색 중이에요...</p>
          ) : errorMessage ? (
            <p className="py-10 text-center text-[#e5484d]">{errorMessage}</p>
          ) : movies.length === 0 ? (
            <p className="py-10 text-center text-[#888]">검색 결과가 없어요.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              {movies.map((movie) => (
                <li key={movie.id} className="flex gap-4.5 border-b border-[#e5e7eb] py-5">
                  <div className="relative w-31.25 shrink-0">
                    {movie.poster_path ? (
                      <img
                        className="block aspect-2/3 w-full rounded-lg object-cover"
                        src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={`${movie.title} 포스터`}
                      />
                    ) : (
                      <div className="aspect-2/3 w-full rounded-lg bg-[#e5e7eb]" />
                    )}
                    <BookmarkButton movieId={movie.id} />
                  </div>
                  <div className="flex flex-col gap-2.5 pt-1">
                    <h3 className="text-lg font-bold text-[#111]">{movie.title}</h3>
                    <p className="flex gap-2 text-xs text-[#999]">
                      <span>{movie.original_title}</span>
                      <span>{movie.release_date}</span>
                    </p>
                    <p className="text-[13px] leading-[1.6] text-[#555]">{movie.overview}</p>
                    <Link
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#3b5aff] no-underline"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      상세 보기
                      <img src="/icons/arrow-right.svg" alt="" className="size-3.5" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}