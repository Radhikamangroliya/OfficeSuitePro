// src/api/timelineApi.ts
import axios from "axios";

const API_URL = "http://localhost:5007/api/timeline";

export const getTimelineEntries = async (token: string) => {
  try {
    console.log("Fetching timeline entries from:", API_URL);
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Timeline API response status:", res.status);
    console.log("Timeline API response data:", res.data);
    console.log("Number of entries received:", Array.isArray(res.data) ? res.data.length : "Not an array");
    if (Array.isArray(res.data) && res.data.length > 0) {
      console.log("Sample entry structure:", res.data[0]);
      console.log("Sample entry keys:", Object.keys(res.data[0]));
    }
    return res.data || [];
  } catch (error: any) {
    console.error("Error fetching timeline entries:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

export const createTimelineEntry = async (entry: any, token: string) => {
  try {
    console.log("Sending request to:", API_URL);
    console.log("Request data:", JSON.stringify(entry, null, 2));
    
    const res = await axios.post(API_URL, entry, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    console.log("Response received:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Create entry error - Full error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.error) {
        throw new Error(errorData.error + (errorData.details ? `: ${errorData.details}` : ""));
      }
      if (errorData.title) {
        // ASP.NET Core validation error format
        const errors = errorData.errors ? Object.values(errorData.errors).flat().join(", ") : errorData.title;
        throw new Error(errors);
      }
      throw new Error(JSON.stringify(errorData));
    }
    throw error;
  }
};

export const updateTimelineEntry = async (
  id: number,
  updates: any,
  token: string
) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, updates, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Update entry error:", error.response?.data);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const deleteTimelineEntry = async (id: number, token: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error("Delete entry error:", error.response?.data);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};