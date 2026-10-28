import { useEffect, useState } from 'react'
import { getMovies } from '../../api/movies/get-movies'
import type { TmdbMovieListItem } from '../../api/movies/models'
import MovieGrid from '../../components/movies/movie-grid'
import Pagination from '../../components/movies/pagination'
import { useViewSettingStore, type MovieSortBy } from '../../stores/view-setting-store'
import { cn } from '../../utils/cn'

const MOVIES_PER_PAGE = 10

const SORT_OPTIONS: { value: MovieSortBy; label: string }[] = [
  { value: 'releaseDate', label: '최신순' },
  { value: 'title', label: '제목순' },
]

export default function MovieListPage() {
  const sortBy = useViewSettingStore((state) => state.sortBy)
  const setSortBy = useViewSettingStore((state) => state.setSortBy)

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let ignore = false

    async function loadMovies() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await getMovies({ page: 1 })
        if (!ignore) setMovies(response.results)
      } catch {
        if (!ignore) setErrorMessage('영화 목록을 불러오지 못했어요.')
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadMovies()

    return () => {
      ignore = true
    }
  }, [])

  const sortedMovies = [...movies].sort((a, b) =>
    sortBy === 'title'
      ? a.title.localeCompare(b.title, 'ko')
      : b.release_date.localeCompare(a.release_date),
  )

  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE))
  const visibleMovies = sortedMovies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE,
  )

  return (
    <main className="mx-auto max-w-300 p-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[32px] font-extrabold">영화 목록</h1>
        <div className="flex gap-2" role="group" aria-label="정렬 기준">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'cursor-pointer rounded-md border border-[#e5e7eb] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#555]',
                sortBy === option.value && 'border-[#111] bg-[#111] text-white',
              )}
              aria-pressed={sortBy === option.value}
              onClick={() => {
                setSortBy(option.value)
                setCurrentPage(1)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <p className="py-10 text-center text-[#888]">영화 목록을 불러오는 중이에요...</p>
      ) : errorMessage ? (
        <p className="py-10 text-center text-[#e5484d]">{errorMessage}</p>
      ) : (
        <>
          <MovieGrid movies={visibleMovies} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </main>
  )
}