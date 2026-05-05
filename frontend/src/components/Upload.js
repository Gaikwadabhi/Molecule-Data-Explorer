import React, { useState } from "react";
import api from "../api";

/**
 * Upload Component
 * Handles:
 * - Drag and Drop CSV upload
 * - File validation
 * - API upload
 * - Success/Error feedback
 */
function Upload({ onUploadSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Handle file upload
   */
  const handleFile = async (file) => {
    if (!file || !file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await api.post("/api/upload", formData);
      setMessage(`Uploaded: ${res.data.total_rows} molecules found`);
      onUploadSuccess(res.data.dataset_id, res.data.columns);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle drag-and-drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  /**
   * Handle file input selection
   */
  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  return (
    <div className="upload-section">
      {/* ===== DROPZONE ===== */}
      <div
        className={`dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input").click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleChange}
        />
        {loading ? (
          <div className="loading">Uploading...</div>
        ) : (
          <>
            <p>Drag & drop a CSV file here, or click to browse</p>
            <span className="upload-hint">Supports .csv files only</span>
          </>
        )}
      </div>

      {/* ===== FEEDBACK MESSAGES ===== */}
      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg"> {error}</div>}
    </div>
  );
}

export default Upload;
