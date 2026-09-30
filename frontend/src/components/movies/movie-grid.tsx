import type { Movie } from '../../types/movie'
import MovieCard from './movie-card'

interface MovieGridProps {
  movies: Movie[]
  onToggleBookmark: (movieId: number) => void
}

export default function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </ul>
  )
}
