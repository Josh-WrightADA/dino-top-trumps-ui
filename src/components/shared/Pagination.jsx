export default function Pagination({ page, totalPages, onPageChange, className = '' }) {
  return (
    <div className={`pagination ${className}`.trim()}>
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        Previous
      </button>
      <span className="pagination__info">
        Page {page + 1} of {totalPages}
      </span>
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        Next
      </button>
    </div>
  );
}
