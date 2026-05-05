import React, { useState } from "react";
import Upload from "./components/Upload";
import MoleculeTable from "./components/MoleculeTable";
import Statistics from "./components/Statistics";
import "./App.css";

function App() {
  const [datasetId, setDatasetId] = useState(null);
  const [columns, setColumns] = useState([]);
  const [activeTab, setActiveTab] = useState("table");

  const handleUploadSuccess = (id, cols) => {
    setDatasetId(id);
    setColumns(cols);
    setActiveTab("table");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🧬 Molecule Data Explorer</h1>
          <p>Upload, explore and analyze molecular datasets</p>
        </div>
      </header>

      <main className="main">
        <Upload onUploadSuccess={handleUploadSuccess} />

        {datasetId && (
          <div className="content">
            <div className="tabs">
              <button
                className={activeTab === "table" ? "tab active" : "tab"}
                onClick={() => setActiveTab("table")}
              >
                📋 Molecules
              </button>
              <button
                className={activeTab === "stats" ? "tab active" : "tab"}
                onClick={() => setActiveTab("stats")}
              >
                📊 Statistics
              </button>
            </div>

            {activeTab === "table" && (
              <MoleculeTable datasetId={datasetId} columns={columns} />
            )}
            {activeTab === "stats" && (
              <Statistics datasetId={datasetId} />
            )}
          </div>
        )}

        {!datasetId && (
          <div className="empty-state">
            <div className="empty-icon">🧪</div>
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
