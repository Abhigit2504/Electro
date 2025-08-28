import axios from "axios";

const API_URL = "https://electro-b.vercel.app/api";  

export const getEVs = async () => {
  const res = await axios.get(`${API_URL}/evs`);   // ✅ no slash
  return res.data;
};

export const getEVById = async (id) => {
  const res = await axios.get(`${API_URL}/evs/${id}`);  // ✅ no slash
  return res.data;
};

export const getStats = async () => {
  const res = await axios.get(`${API_URL}/stats`);  // ✅ no slash
  return res.data;
};
