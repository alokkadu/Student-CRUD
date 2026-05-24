function Pagination({
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
}) {

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 mb-4">

      <button
        className="btn btn-outline-primary"
        onClick={onPreviousPage}
        disabled={page === 1}
      >
        Previous
      </button>

      <span>
        Page {page} of {totalPages || 1}
      </span>

      <button
        className="btn btn-outline-primary"
        onClick={onNextPage}
        disabled={page === totalPages || totalPages === 0}
      >
        Next
      </button>

    </div>
  );
}

export default Pagination;
