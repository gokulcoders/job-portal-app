import './Pagination.css'

export default function Pagination({ page, pages, onPageChange }) {
  if (!pages || pages <= 1) return null

  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1)

  return (
    <nav className="pagination">
      <button
        type="button"
        className="pagination-button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <div className="pagination-numbers">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`pagination-number ${pageNumber === page ? 'active' : ''}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="pagination-button"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  )
}
