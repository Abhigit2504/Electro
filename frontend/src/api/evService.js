import axios from "axios";

const API_URL = "https://electro-b.vercel.app/api";  // backend base URL

export const getEVs = async () => {
  const res = await axios.get(`${API_URL}/evs`);   // ✅ removed slash
  return res.data;
};

export const getEVById = async (id) => {
  const res = await axios.get(`${API_URL}/evs/${id}`);  // ✅ removed slash
  return res.data;
};

export const getStats = async () => {
  const res = await axios.get(`${API_URL}/stats`);  // ✅ removed slash
  return res.data;
};
