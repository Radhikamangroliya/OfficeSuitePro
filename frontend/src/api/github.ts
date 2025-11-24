import axios from "axios";

const API_BASE = "http://localhost:5007/api/github";

export const getGithubActivity = async (username: string) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_BASE}/activity`, {
    params: { username },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};