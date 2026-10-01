import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'
import { BookmarkButton } from '../bookmark-button'

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <li className="flex w-full min-w-0 flex-col">
      <div className="relative">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 보기`}
          className="block"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="block w-full aspect-2/3 rounded-lg object-cover"
          />
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
        <p className="mt-1 mb-0 text-[13px] text-[#8a8a8a]">{movie.releaseDate}</p>
      </div>
    </li>
  )
}