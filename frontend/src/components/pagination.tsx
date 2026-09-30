import { useState } from "react";
import "./pagination.css";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination">
      <button
        className="page-arrow"
        onClick={() => setCurrentPage((prev) => prev - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`page-number ${pageNumber === currentPage ? "active" : ""}`}
          onClick={() => setCurrentPage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      <button
        className="page-arrow"
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </nav>
  );
}