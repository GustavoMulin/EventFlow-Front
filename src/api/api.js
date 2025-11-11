import axios from "axios";

const api = axios.create({
  baseURL: "http://12.0.0.100:3000/api",
});

export default api;
