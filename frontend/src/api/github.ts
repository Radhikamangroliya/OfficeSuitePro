import axios from "axios";

const API_BASE = "http://localhost:5007/api/github";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please log in first.");
  }
  return {
    Authorization: `Bearer ${token}`
  };
};

export const getGithubActivity = async (username: string) => {
  const response = await axios.get(`${API_BASE}/activity`, {
    params: { username },
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getGithubProfile = async (username: string) => {
  try {
    const response = await axios.get(`${API_BASE}/profile`, {
      params: { username },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching GitHub profile:", error.response?.status, error.response?.data);
    throw error;
  }
};

export const getGithubRepos = async (username: string) => {
  try {
    const response = await axios.get(`${API_BASE}/repos`, {
      params: { username },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching GitHub repos:", error.response?.status, error.response?.data);
    throw error;
  }
};

export const getGithubContributions = async (username: string) => {
  try {
    const response = await axios.get(`${API_BASE}/contributions`, {
      params: { username },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching GitHub contributions:", error.response?.status, error.response?.data);
    throw error;
  }
};

export const getGithubCommits = async (username: string, repo: string) => {
  const response = await axios.get(`${API_BASE}/commits`, {
    params: { username, repo },
    headers: getAuthHeaders()
  });
  return response.data;
};