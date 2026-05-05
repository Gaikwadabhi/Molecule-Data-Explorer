import React, { useState, useEffect, useCallback } from "react";
import api from "../api";

function MoleculeTable({ datasetId, columns }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const perPage = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        dataset_id: datasetId,
        page,
        per_page: perPage,
      };
      if (search) params.search = search;
      if (minWeight) params.min_weight = minWeight;
      if (maxWeight) params.max_weight = maxWeight;

      const res = await api.get("/api/molecules", { params });
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error("Error fetching molecules", err);
    } finally {
      setLoading(false);
    }
  }, [datasetId, page, search, minWeight, maxWeight]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilter = () => {
    setPage(1);
    fetchData();
  };

  const handleClear = () => {
    setSearch("");
    setMinWeight("");
    setMaxWeight("");
    setPage(1);
  };

  return (
    <div className="table-section">
      <div className="filters">
        <input
          type="text"
          placeholder="Search molecules..."
          value={search}
          onChange={handleSearch}
          className="search-input"
        />
        <input
          type="number"
          placeholder="Min Weight"
          value={minWeight}
          onChange={(e) => setMinWeight(e.target.value)}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Max Weight"
          value={maxWeight}
          onChange={(e) => setMaxWeight(e.target.value)}
          className="filter-input"
        />
        <button onClick={handleFilter} className="btn-primary">Apply</button>
        <button onClick={handleClear} className="btn-secondary">Clear</button>
      </div>

      <div className="table-info">
        Showing {data.length} of {total} molecules
      </div>

      {loading ? (
        <div className="loading">Loading molecules...</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="molecule-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="no-data">
                      No molecules found
                    </td>
                  </tr>
                ) : (
                  data.map((row, idx) => (
                    <tr key={idx}>
                      {columns.map((col) => (
                        <td key={col}>{row[col]}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary"
            >
              ← Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MoleculeTable;
