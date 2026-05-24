function StudentSearch({
  searchId,
  isSearching,
  onSearchIdChange,
  onSearchStudent,
  onClearSearch,
}) {

  return (
    <form
      className="card p-4 mb-4"
      onSubmit={onSearchStudent}
    >

      <h3>Search Student</h3>

      <div className="d-flex gap-2">

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="form-control"
          placeholder="Enter student ID"
          value={searchId}
          onChange={(e) => onSearchIdChange(e.target.value)}
        />

        <button
          className="btn btn-info"
          type="submit"
        >
          Search
        </button>

        {isSearching && (
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onClearSearch}
          >
            Clear
          </button>
        )}

      </div>

    </form>
  );
}

export default StudentSearch;
