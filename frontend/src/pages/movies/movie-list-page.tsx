import MovieGrid from '../../components/movies/movie-grid'
import Pagination from '../../components/movies/pagination'
import { movies } from '../../data/movies'
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

  const sortedMovies = [...movies].sort((a, b) =>
    sortBy === 'title'
      ? a.title.localeCompare(b.title, 'ko')
      : b.releaseDate.localeCompare(a.releaseDate),
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
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <MovieGrid movies={sortedMovies} />
      <Pagination totalPages={Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE))} />
    </main>
  )
}
