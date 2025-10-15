import axios from "axios";

const api = axios.create({
  baseURL: "http://12.0.0.71:3000/api", 
});

export default api;
