export function TmdbAttribution() {
  return (
    <footer className="border-t border-[#e5e7eb] bg-white px-4 py-5 md:px-10">
      <p className="flex items-center justify-end gap-2.5 text-sm text-[#6b7280]">
        <img src="/icons/tmdb-logo.svg" alt="TMDB 로고" className="h-3.5 w-auto shrink-0" />
        <span>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            TMDB
          </a>
          .
        </span>
      </p>
    </footer>
  );
}