import axios from "axios";

const isServer = typeof window === "undefined";

export const apiClient = axios.create({
  baseURL: process.env.NODE_ENV == "development" ? (isServer ? "http://nginx/api" : "http://localhost/api") : "https://sunlog.dev/api"
});
