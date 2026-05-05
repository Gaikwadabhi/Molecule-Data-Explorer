import axios from "axios";

/**
 * Centralized configuration for all API calls.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
});

export default api;