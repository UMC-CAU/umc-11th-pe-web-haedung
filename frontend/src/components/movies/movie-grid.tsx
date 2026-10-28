import type { TmdbMovie } from '../../api/movies/models'
import MovieCard from './movie-card'

interface MovieGridProps {
  movies: TmdbMovie[]
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </ul>
  )
}
