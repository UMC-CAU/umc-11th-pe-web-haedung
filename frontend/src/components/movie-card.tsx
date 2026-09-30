import type { Movie } from "../types/movie";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <li className="movie-card">
      <div className="poster-wrapper">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="poster-image"
        />
        <button
          className={`bookmark-button ${movie.isBookmarked ? "bookmarked" : ""}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg" }
            alt={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
            style={{ filter: "invert(1)" }}
          />
        </button>
      </div>

      <div className="movie-info">
        <p className="movie-title">{movie.title}</p>
        <p className="movie-date">{movie.releaseDate}</p>
      </div>
    </li>
  );
}