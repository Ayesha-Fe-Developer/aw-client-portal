import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export const generateSACS = async (data: object) => {
  const response = await axios.post(`${API_URL}/generate/sacs`, data, {
    responseType: "blob",
  });
  return response.data;
};

export const generateTCC = async (data: object) => {
  const response = await axios.post(`${API_URL}/generate/tcc`, data, {
    responseType: "blob",
  });
  return response.data;
};

export const downloadPDF = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
