from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import uuid

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# In-memory store
datasets = {}


def find_weight_column(df):
    """Find the molecular weight column in the dataframe."""
    # First try exact match
    for col in df.columns:
        if "molecular_weight" in col.lower() or col.lower() == "mw":
            return col
    # Fallback: any column with 'weight' in name
    for col in df.columns:
        if "weight" in col.lower():
            return col
    return None


@app.route("/api/upload", methods=["POST"])
def upload_csv():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.endswith(".csv"):
        return jsonify({"error": "Only CSV files are allowed"}), 400

    try:
        df = pd.read_csv(file)
        dataset_id = str(uuid.uuid4())
        datasets[dataset_id] = df
        return jsonify({
            "message": "File uploaded successfully",
            "dataset_id": dataset_id,
            "columns": list(df.columns),
            "total_rows": len(df)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/molecules", methods=["GET"])
def list_molecules():
    dataset_id = request.args.get("dataset_id")
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    min_weight = request.args.get("min_weight", type=float)
    max_weight = request.args.get("max_weight", type=float)
    search = request.args.get("search", "").lower()

    if not dataset_id or dataset_id not in datasets:
        return jsonify({"error": "Invalid or missing dataset_id"}), 400

    df = datasets[dataset_id].copy()

    # Filter by molecular weight
    weight_col = find_weight_column(df)

    if weight_col and min_weight is not None:
        df = df[pd.to_numeric(df[weight_col], errors="coerce") >= min_weight]
    if weight_col and max_weight is not None:
        df = df[pd.to_numeric(df[weight_col], errors="coerce") <= max_weight]

    # Search filter
    if search:
        mask = df.apply(lambda row: row.astype(str).str.lower().str.contains(search).any(), axis=1)
        df = df[mask]

    total = len(df)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = df.iloc[start:end].fillna("").to_dict(orient="records")

    return jsonify({
        "data": paginated,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }), 200


@app.route("/api/statistics", methods=["GET"])
def get_statistics():
    dataset_id = request.args.get("dataset_id")

    if not dataset_id or dataset_id not in datasets:
        return jsonify({"error": f"dataset_id '{dataset_id}' not found. Available: {list(datasets.keys())}"}), 400

    try:
        df = datasets[dataset_id].copy()
        for col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="ignore")

        stats = {}
        numeric_cols = df.select_dtypes(include="number").columns.tolist()
        for col in numeric_cols:
            stats[col] = {
                "average": round(float(df[col].mean()), 3),
                "min": round(float(df[col].min()), 3),
                "max": round(float(df[col].max()), 3),
                "count": int(df[col].count())
            }

        return jsonify({
            "total_molecules": len(df),
            "columns": list(df.columns),
            "numeric_stats": stats
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/filter", methods=["GET"])
def filter_molecules():
    dataset_id = request.args.get("dataset_id")
    min_weight = request.args.get("min_weight", type=float)
    max_weight = request.args.get("max_weight", type=float)

    if not dataset_id or dataset_id not in datasets:
        return jsonify({"error": "Invalid or missing dataset_id"}), 400

    df = datasets[dataset_id].copy()

    weight_col = find_weight_column(df)

    if weight_col is None:
        return jsonify({"error": "No molecular weight column found"}), 400

    if min_weight is not None:
        df = df[pd.to_numeric(df[weight_col], errors="coerce") >= min_weight]
    if max_weight is not None:
        df = df[pd.to_numeric(df[weight_col], errors="coerce") <= max_weight]

    return jsonify({
        "data": df.fillna("").to_dict(orient="records"),
        "total": len(df)
    }), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, use_reloader=False, port=5000)