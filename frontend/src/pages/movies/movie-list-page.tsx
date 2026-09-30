import { useState } from 'react'
import MovieGrid from '../../components/movies/movie-grid'
import Pagination from '../../components/movies/pagination'
import { movies as initialMovies } from '../../data/movies'

const MOVIES_PER_PAGE = 10

export default function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies)

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    )
  }

  return (
    <main className="mx-auto max-w-300 p-10">
      <h1 className="mb-6 text-[32px] font-extrabold">영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      <Pagination totalPages={Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE))} />
    </main>
  )
}