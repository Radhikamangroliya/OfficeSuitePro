import axios from "axios";

const API = "http://localhost:5007/api/timeline";

export const getTimelineEntries = async (token: string) => {
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createTimelineEntry = async (entry: any, token: string) => {
  const res = await axios.post(API, entry, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const updateTimelineEntry = async (id: number, data: any, token: string) => {
  const res = await axios.put(`${API}/${id}`, data, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
};

export const deleteTimelineEntry = async (id: number, token: string) => {
  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
