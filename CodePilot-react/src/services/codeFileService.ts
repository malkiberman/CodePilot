import axios from "axios";
import API_BASE_URL from "../config";

// פונקציה להעלאת קובץ
export const uploadFile = async (file: File, fileName: string, language: string) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    console.error("No token found in sessionStorage");
    return;
  }

  const formData = new FormData();
  formData.append("File", file);  // שם הפרמטר חייב להיות בדיוק כמו ב-DTO
  formData.append("FileName", fileName);
  formData.append("FileType", language);  // שדה "LanguageType" הוסב ל-"FileType"

  try {
    const response = await axios.post(`${API_BASE_URL}/CodeFile/upload`, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Response received:", response.data);
    return response.data;
  } catch (error:any) {
    console.error("Server Error:", error.response?.data ?? error);
    throw error;
  }
};

// פונקציה לקבלת קובץ לפי מזהה
export const getFileById = async (fileId: number) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(`${API_BASE_URL}/codefile/${fileId}/download`,{
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch file", error);
    throw error;
  }
};

// פונקציה להחזרת גרסה קודמת של קובץ
export const revertFileVersion = async (fileId: number, versionId: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/codefile/${fileId}/version`, { versionId });
    return response.data;
  } catch (error) {
    console.error("Failed to revert file version", error);
    throw error;
  }
};

// פונקציה לקבלת כל הקבצים של המשתמש
export const getUserFiles = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("טוקן לא נמצא");
    }
    const response = await axios.get(`${API_BASE_URL}/CodeFile/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("שגיאה בקבלת קבצי משתמש:", error);
    throw error;
  }
};