# Molecule Data Explorer

A full stack web application that allows users to upload a CSV dataset of molecules, explore and filter the data, and view statistics and visualizations on a dashboard.

---

## Tech Stack

- **Backend**: Python, Flask, Pandas
- **Frontend**: React, Axios, Recharts
- **Containerization**: Docker, Docker Compose

---

## Project Structure

```
molecule-explorer/
├── backend/
│   ├── app.py               # Flask API
│   ├── requirements.txt     # Python dependencies
│   ├── sample_molecules.csv # Sample dataset
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Upload.js        # CSV upload component
│   │   │   ├── MoleculeTable.js # Data table with filters
│   │   │   └── Statistics.js    # Stats dashboard + chart
│   │   ├── api.js           # Axios instance
│   │   ├── App.js
│   │   └── App.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Clone the Repository

git clone https://github.com/Gaikwadabhi/Molecule-Data-Explorer.git
cd Molecule-Data-Explorer

---

## Running the Application

You can run this project in two ways — with Docker or manually without Docker.

---

### Option 1: Run with Docker (Recommended)

**Prerequisites:** Docker and Docker Compose installed.

# Build and start both services
docker-compose up --build

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

To stop:
docker-compose down

---

### Option 2: Run Without Docker (Manual Setup)

**Prerequisites:** Python 3.8+, Node.js 16+, npm

#### Step 1 - Start the Backend

Open a terminal:

cd backend
pip install -r requirements.txt
python app.py

Flask will start at: http://localhost:5000

#### Step 2 - Start the Frontend

Open a second terminal:

cd frontend
npm install
npm start

React will start at: http://localhost:3000

---

## Sample Dataset

A sample CSV file is included at `backend/sample_molecules.csv`.

You can upload this file directly to test the application.

**Columns:**

| Column | Description |
|---|---|
| id | Unique identifier |
| name | Molecule name |
| molecular_weight | Weight of the molecule |
| formula | Chemical formula |
| solubility | High / Medium / Low |
| toxicity | High / Medium / Low |
| category | Type of molecule (Stimulant, Hormone, etc.) |

---

## API Details

All endpoints are prefixed with `/api`.

### POST `/api/upload`
Upload a CSV file.

**Request:** `multipart/form-data` with field `file`

**Response:**
{
  "message": "File uploaded successfully",
  "dataset_id": "uuid-string",
  "columns": ["name", "molecular_weight", "..."],
  "total_rows": 30
}

---

### GET `/api/molecules`
List molecules with pagination, search and weight filtering.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| dataset_id | string | Required. ID from upload response |
| page | int | Page number (default: 1) |
| per_page | int | Results per page (default: 10) |
| search | string | Search across all columns |
| min_weight | float | Minimum molecular weight |
| max_weight | float | Maximum molecular weight |

**Response:**
{
  "data": [...],
  "total": 30,
  "page": 1,
  "per_page": 10,
  "total_pages": 3
}

---

### GET `/api/statistics`
Get statistics for all numeric columns.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| dataset_id | string | Required. ID from upload response |

**Response:**
{
  "total_molecules": 30,
  "columns": ["name", "molecular_weight", "..."],
  "numeric_stats": {
    "molecular_weight": {
      "average": 2547.528,
      "min": 32.04,
      "max": 64500.0,
      "count": 30
    }
  }
}

---

### GET `/api/filter`
Filter molecules by molecular weight range.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| dataset_id | string | Required. ID from upload response |
| min_weight | float | Minimum molecular weight |
| max_weight | float | Maximum molecular weight |

**Response:**
{
  "data": [...],
  "total": 10
}

---

## Approach

### Backend
- Built with **Flask** for simplicity and fast API development
- **Pandas** is used to parse and process the uploaded CSV in memory
- Each uploaded dataset is assigned a unique `dataset_id` (UUID) and stored in an in-memory dictionary for the session
- The weight column is auto-detected by scanning column names for keywords like `molecular_weight` or `mw`
- Proper error handling is implemented across all endpoints with descriptive error messages

### Frontend
- Built with **React** using functional components and hooks
- **Axios** is used for all API calls via a centralized `api.js` instance
- The molecules table supports live search, min/max weight filtering, and pagination
- The statistics dashboard shows summary cards and a bar chart (Min / Average / Max) using **Recharts**
- Responsive design using CSS Flexbox

### Docker
- The backend and frontend each have their own `Dockerfile`
- `docker-compose.yml` orchestrates both services on a shared network
- Port mappings: `3000` for frontend, `5000` for backend

---

## Features

- CSV file upload with drag and drop support
- Molecule data table with pagination
- Search across all columns
- Filter by molecular weight (min and max)
- Statistics dashboard with average, min, max and count
- Bar chart visualization using Recharts
- Docker setup with Docker Compose
- Responsive UI
- Error handling on all API endpoints

---

## Requirements

### Backend
flask
flask-cors
pandas

Install with:
pip install -r requirements.txt

### Frontend
react
react-dom
axios
recharts
react-scripts

Install with:
npm install