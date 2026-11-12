
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// School registration
export const signupSchool = (data) => {
  return api.post("/auth/signup", data);
};

// School login
export const loginSchool = (data) => {
  return api.post("/auth/signin", data);
};

// Search admissions
export const searchAdmissions = (params) => {
  return api.get("/admissions/search", { params });
};

export default api;
