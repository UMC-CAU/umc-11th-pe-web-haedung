import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMovies } from '../../api/movies/get-movies'
import MovieGrid from '../../components/movies/movie-grid'
import Pagination from '../../components/movies/pagination'
import { useViewSettingStore, type MovieSortBy } from '../../stores/view-setting-store'
import { cn } from '../../utils/cn'

const TMDB_MAX_PAGE = 500

const SORT_OPTIONS: { value: MovieSortBy; label: string }[] = [
  { value: 'releaseDate', label: '최신순' },
  { value: 'title', label: '제목순' },
]

export default function MovieListPage() {
  const sortBy = useViewSettingStore((state) => state.sortBy)
  const setSortBy = useViewSettingStore((state) => state.setSortBy)

  const [page, setPage] = useState(1)

  const moviesQuery = useQuery({
    queryKey: ['movies', 'list', { page }],
    queryFn: () => getMovies({ page }),
  })

  const movies = moviesQuery.data?.results ?? []
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, TMDB_MAX_PAGE)

  const sortedMovies = [...movies].sort((a, b) =>
    sortBy === 'title'
      ? a.title.localeCompare(b.title, 'ko')
      : b.release_date.localeCompare(a.release_date),
  )

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
  }

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
                setPage(1)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {moviesQuery.isPending ? (
        <p className="py-10 text-center text-[#888]">영화 목록을 불러오는 중이에요...</p>
      ) : moviesQuery.isError ? (
        <p className="py-10 text-center text-[#e5484d]">영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p className="py-10 text-center text-[#888]">표시할 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={sortedMovies} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  )
}