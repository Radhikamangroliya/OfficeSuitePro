import axios from "axios";

const API_BASE = "http://localhost:5007/api/auth";

export const authApi = {
  async loginWithGoogle(googleToken: string) {
    const res = await axios.post(`${API_BASE}/google`, { IdToken: googleToken });
    return res.data;
  },

  async getCurrentUser(token: string) {
    const res = await axios.get(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // ⭐ ADD THIS METHOD ⭐
  async getAllUsers(token: string) {
    try {
      const res = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      // graceful fallback if your backend does NOT have /api/auth/users
      if (err.response?.status === 404) return [];
      throw err;
    }
  }
};
