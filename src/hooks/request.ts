import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export const post = async (url: string, payload: Record<string, any>) => {
  try {
    return await http.post(url, payload);
  } catch (e) {
    console.log(e);
  }
};

export const get = async (url: string) => {
  try {
    const { data } = await http.get(url);
    return data;
  } catch (e) {
    console.log(e);
  }
};
