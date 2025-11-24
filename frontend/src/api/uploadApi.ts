const API_URL = "http://localhost:5007/api/upload";

export const uploadImage = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");

  return await res.json(); // returns { imageUrl }
};