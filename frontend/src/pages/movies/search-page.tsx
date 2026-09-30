import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  const hasQuery = Boolean(normalizedQuery);

  return (
    <main
      className={cn(
        "min-h-[calc(100vh-80px)] bg-[#f5f6f8] px-4 pt-50 pb-10",
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
            <p className="text-xs text-[#999]">영화 {searchResults.length}편</p>
          </div>
          {searchResults.length === 0 ? (
            <p className="py-10 text-center text-[#888]">검색 결과가 없어요.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              {searchResults.map((movie) => (
                <li key={movie.id} className="flex gap-4.5 border-b border-[#e5e7eb] py-5">
                  <img
                    className="aspect-2/3 w-31.25 shrink-0 rounded-lg object-cover"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                  />
                  <div className="flex flex-col gap-2.5 pt-1">
                    <h3 className="text-lg font-bold text-[#111]">{movie.title}</h3>
                    <p className="flex gap-2 text-xs text-[#999]">
                      <span>{movie.originalTitle}</span>
                      <span>{movie.releaseDate}</span>
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
