import { Link } from '@tanstack/react-router'
import type { TmdbMovie } from '../../api/movies/models'
import { getTmdbPosterUrl } from '../../utils/movies/tmdb-image'
import { BookmarkButton } from '../bookmark-button'

interface MovieCardProps {
  movie: TmdbMovie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path)

  return (
    <li className="flex w-full min-w-0 flex-col">
      <div className="relative">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 보기`}
          className="block"
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="block w-full aspect-2/3 rounded-lg object-cover"
            />
          ) : (
            <div className="flex w-full aspect-2/3 items-center justify-center rounded-lg bg-[#f1f1f1] text-[13px] text-[#999]">
              포스터 없음
            </div>
          )}
        </Link>
        <BookmarkButton movieId={movie.id} />
      </div>

      <div className="mt-3">
        <p className="m-0 text-base font-bold text-[#1a1a1a]">
          <Link
            to="/movies/$movieId"
            params={{ movieId: String(movie.id) }}
            className="text-inherit no-underline"
          >
            {movie.title}
          </Link>
        </p>
        <p className="mt-1 mb-0 text-[13px] text-[#8a8a8a]">{movie.release_date}</p>
      </div>
    </li>
  )
}