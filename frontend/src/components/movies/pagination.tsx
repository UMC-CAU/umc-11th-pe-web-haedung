import { cn } from '../../utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const PAGE_GROUP_SIZE = 10

const arrowClass =
  'cursor-pointer rounded-lg border border-[#ddd] bg-white px-4 py-2 text-sm text-[#333] disabled:cursor-not-allowed disabled:text-[#ccc]'

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const firstPage = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1
  const lastPage = Math.min(firstPage + PAGE_GROUP_SIZE - 1, totalPages)
  const pageNumbers = Array.from(
    { length: lastPage - firstPage + 1 },
    (_, index) => firstPage + index,
  )

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="페이지 이동">
      <button
        className={arrowClass}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={cn(
            'size-9 cursor-pointer rounded-lg text-sm text-[#555]',
            pageNumber === currentPage && 'bg-[#3b5aff] font-bold text-white',
          )}
          aria-current={pageNumber === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      <button
        className={arrowClass}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </nav>
  )
}
