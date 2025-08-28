import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";  // change if backend runs elsewhere

export const getEVs = async () => {
  const res = await axios.get(`${API_URL}/evs/`);
  return res.data;
};

export const getEVById = async (id) => {
  const res = await axios.get(`${API_URL}/evs/${id}/`);
  return res.data;
};

export const getStats = async () => {
  const res = await axios.get(`${API_URL}/stats/`);
  return res.data;
};
