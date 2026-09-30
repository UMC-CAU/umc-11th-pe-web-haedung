import { useState } from 'react'
import { cn } from '../../utils/cn'

interface PaginationProps {
  totalPages: number
}

const arrowClass =
  'cursor-pointer rounded-lg border border-[#ddd] bg-white px-4 py-2 text-sm text-[#333] disabled:cursor-not-allowed disabled:text-[#ccc]'

export default function Pagination({ totalPages }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="페이지 이동">
      <button
        className={arrowClass}
        onClick={() => setCurrentPage((previous) => previous - 1)}
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
          onClick={() => setCurrentPage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      <button
        className={arrowClass}
        onClick={() => setCurrentPage((previous) => previous + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </nav>
  )
}
