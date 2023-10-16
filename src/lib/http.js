import axios from "axios";

function http(options = {}) {
  const headers = {
    Accept: "application/json",
    ...options,
  };

  return axios.create({
    baseURL: import.meta.env.VITE_API,
    headers,
    withCredentials: true,
  });
}

export default http;
