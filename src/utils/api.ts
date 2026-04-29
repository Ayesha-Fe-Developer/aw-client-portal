const API_URL = "http://127.0.0.1:5000";

export const generateSACS = async (data: object): Promise<Blob> => {
  const response = await fetch(`${API_URL}/generate/sacs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const blob = await response.blob();
  return blob;
};

export const generateTCC = async (data: object): Promise<Blob> => {
  const response = await fetch(`${API_URL}/generate/tcc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const blob = await response.blob();
  return blob;
};

export const downloadPDF = (blob: Blob, filename: string) => {
  // Open in new tab instead of downloading — bypasses IDM
  const url = window.URL.createObjectURL(
    new Blob([blob], { type: "application/pdf" }),
  );
  window.open(url, "_blank");
};
