import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});