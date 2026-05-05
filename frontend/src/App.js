import React, { useState } from "react";
import Upload from "./components/Upload";
import MoleculeTable from "./components/MoleculeTable";
import Statistics from "./components/Statistics";
import "./App.css";

/**
 * Root Application Component
 */
function App() {
  const [datasetId, setDatasetId] = useState(null);
  const [columns, setColumns] = useState([]);
  const [activeTab, setActiveTab] = useState("table");

  /**
   * Callback triggered after successful file upload
   * Updates:
   * - dataset ID
   * - columns
   * - switches to table view
   */
  const handleUploadSuccess = (id, cols) => {
    setDatasetId(id);
    setColumns(cols);
    setActiveTab("table");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Molecule Data Explorer</h1>
          <p>Upload, explore and analyze molecular datasets</p>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main">
        <Upload onUploadSuccess={handleUploadSuccess} />

        {datasetId && (
          <div className="content">
            {/* ===== TAB SWITCHING ===== */}
            <div className="tabs">
              <button
                className={activeTab === "table" ? "tab active" : "tab"}
                onClick={() => setActiveTab("table")}
              >
                Molecules
              </button>
              <button
                className={activeTab === "stats" ? "tab active" : "tab"}
                onClick={() => setActiveTab("stats")}
              >
                Statistics
              </button>
            </div>

            {/* ===== CONDITIONAL RENDERING ===== */}
            {activeTab === "table" && (
              <MoleculeTable datasetId={datasetId} columns={columns} />
            )}
            {activeTab === "stats" && (
              <Statistics datasetId={datasetId} />
            )}
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {!datasetId && (
          <div className="empty-state">
            <h2>No dataset loaded</h2>
            <p>Upload a CSV file above to start exploring molecule data</p>
            <p className="hint">A sample dataset is included in the backend folder</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
