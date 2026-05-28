import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 CHANGE THIS TO YOUR PC IP
export const BASE_URL = "http://192.168.1.37:3000";
export const WS_URL = "ws://192.168.1.37:3000";

const api = axios.create({ baseURL: BASE_URL });

export const AuthService = {
  login: async (username: string, password: string) => {
    const res = await api.post("/login", { username, password });
    await AsyncStorage.setItem("token", res.data.token);
    return res.data.token;
  },
  register: async (username: string, password: string) => {
    await api.post("/register", { username, password });
  },
  logout: async () => {
    await AsyncStorage.removeItem("token");
  },
  getToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem("token");
  },
};