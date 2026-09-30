import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'
import { cn } from '../../utils/cn'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
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
        <button
          className={cn(
            'absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-lg border-2 border-white bg-black',
            movie.isBookmarked && 'bg-[#3b5aff]',
          )}
          aria-label={movie.isBookmarked ? '북마크 해제' : '북마크 추가'}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={movie.isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
            className="invert"
          />
        </button>
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