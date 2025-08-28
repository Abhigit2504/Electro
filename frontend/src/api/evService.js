// import axios from "axios";

// const API_URL = "https://electro-b.vercel.app/api";  // deployed backend

// export const getEVs = async () => {
//   try {
//     const res = await axios.get(`${API_URL}/evs`);
//     return res.data;
//   } catch (err) {
//     console.error("Failed to fetch EVs:", err.message);
//     return [];
//   }
// };

// export const getEVById = async (id) => {
//   try {
//     const res = await axios.get(`${API_URL}/evs/${id}`);
//     return res.data;
//   } catch (err) {
//     console.error("Failed to fetch EV by ID:", err.message);
//     return null;
//   }
// };

// export const getStats = async () => {
//   try {
//     const res = await axios.get(`${API_URL}/stats`);
//     return res.data;
//   } catch (err) {
//     console.error("Failed to fetch stats:", err.message);
//     return {};
//   }
// };




import axios from "axios";

const API_URL = "https://electro-b.vercel.app/api";  // your deployed backend

export const getEVs = async () => {
  try {
    const res = await axios.get(`${API_URL}/evs`);
    console.log("EVs fetched:", res.data);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch EVs:", err.message);
    return [];
  }
};

export const getEVById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/evs/${id}`);
    console.log("EV by ID fetched:", res.data);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch EV by ID:", err.message);
    return null;
  }
};

export const getStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/stats`);
    console.log("Stats fetched:", res.data);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch stats:", err.message);
    return {};
  }
};
