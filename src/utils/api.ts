const API_URL = "https://aw-client-portal-production.up.railway.app";

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
  const url = window.URL.createObjectURL(
    new Blob([blob], { type: "application/pdf" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
