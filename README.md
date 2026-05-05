# 🧬 Molecule Data Explorer

A full-stack web application to upload, explore, filter, and analyze molecular datasets.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, Flask, Pandas |
| Frontend | React, Recharts |
| DevOps | Docker, Docker Compose |

---

## Features

- **CSV Upload** — Drag & drop or click to upload any molecular CSV dataset
- **Molecule Table** — Paginated table view with all molecule properties
- **Search** — Full text search across all columns
- **Filter** — Filter molecules by molecular weight range
- **Statistics Dashboard** — Auto-computed min, max, average, count for all numeric columns
- **Charts** — Bar chart visualization of property statistics
- **Docker Support** — Run entire app with one command

---

## Setup Instructions

### Option 1 — Run Locally (Without Docker)

#### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

Backend runs at: `http://localhost:5000`

#### Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

Frontend runs at: `http://localhost:3000`

---

### Option 2 — Run with Docker (Recommended)

```bash
# From root directory
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## API Details

### POST /api/upload
Upload a CSV file.

**Request:** `multipart/form-data` with `file` field

**Response:**
```json
{
  "message": "File uploaded successfully",
  "dataset_id": "uuid-string",
  "columns": ["col1", "col2"],
  "total_rows": 20
}
```

---

### GET /api/molecules
List molecules with pagination, search and filtering.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| dataset_id | string | Required. From upload response |
| page | int | Page number (default: 1) |
| per_page | int | Items per page (default: 10) |
| search | string | Search across all columns |
| min_weight | float | Minimum molecular weight |
| max_weight | float | Maximum molecular weight |

**Response:**
```json
{
  "data": [...],
  "total": 20,
  "page": 1,
  "per_page": 10,
  "total_pages": 2
}
```

---

### GET /api/statistics
Get statistics for all numeric columns.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| dataset_id | string | Required |

**Response:**
```json
{
  "total_molecules": 20,
  "columns": ["col1", "col2"],
  "numeric_stats": {
    "molecular_weight": {
      "average": 285.5,
      "min": 46.07,
      "max": 5807.57,
      "count": 20
    }
  }
}
```

---

### GET /api/filter
Filter molecules by molecular weight range.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| dataset_id | string | Required |
| min_weight | float | Minimum weight |
| max_weight | float | Maximum weight |

---

## Sample Dataset

A sample dataset `sample_molecules.csv` is included in the `backend/` folder with 20 molecules including:
- Aspirin, Caffeine, Ibuprofen, Paracetamol
- Morphine, Dopamine, Serotonin
- Molecular weight, formula, logP, activity

---

## Approach

1. **Backend** — Flask REST API with in-memory dataset storage using Pandas. Each uploaded CSV gets a unique `dataset_id` (UUID) for session-based access. Pagination, filtering and statistics are computed on the fly using Pandas operations.

2. **Frontend** — React app with component-based architecture. Upload component handles drag-and-drop. MoleculeTable handles pagination and filters. Statistics component uses Recharts for visualization.

3. **Design decisions:**
   - In-memory storage for simplicity (no DB required)
   - Auto-detection of molecular weight column for filtering
   - Responsive design works on all screen sizes
   - Docker setup for easy deployment

---

## Author

Abhishek Gaikwad  
abhishekgaikwad001place@gmail.com
