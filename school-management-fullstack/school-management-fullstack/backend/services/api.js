
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export const signupSchool = (data) =>
  api.post("/auth/signup", data);

export const loginSchool = (data) =>
  api.post("/auth/signin", data);

export default api;
