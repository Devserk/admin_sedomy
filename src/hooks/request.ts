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

// export const put = async (url: string, payload: Record<string, any>) => {
//   try {
//     return await http.put(url, payload);
//   } catch (error) {
//     console.error("PUT request error:", error);
//     throw error; // On propage l'erreur pour le error boundary
//   }
// };

export const put = async <T = any>(
  url: string,
  payload?: Record<string, any> // Rend le payload optionnel si nécessaire
): Promise<{ data?: T; error?: string }> => {
  try {
    const response = await http.put<T>(url, payload);
    return { data: response.data };
  } catch (error) {
    console.error("PUT request error:", error);
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.message || error.message,
      };
    }
    return { error: "Unknown error" };
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
