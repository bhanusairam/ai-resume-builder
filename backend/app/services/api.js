import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const generateResume = (form) => {
  return API.post("/api/resume/generate", form);
};