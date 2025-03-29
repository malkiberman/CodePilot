import axios from "axios";


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
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL||import.meta.env.REACT_APP_API_BASE_URL}/CodeFile/upload`, formData, {
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
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL||import.meta.env.REACT_APP_API_BASE_URL}/codefile/${fileId}/download`,{
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
// export const revertFileVersion = async (fileId: number, versionId: number) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/codefile/${fileId}/version`, { versionId });
//     return response.data;
//   } catch (error) {
//     console.error("Failed to revert file version", error);
//     throw error;
//   }
// };

// פונקציה לקבלת כל הקבצים של המשתמש
export const getUserFiles = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("טוקן לא נמצא");
    }
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL||import.meta.env.REACT_APP_API_BASE_URL}/CodeFile/user`, {
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


export const getFileVersions = async (fileId: number) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL||import.meta.env.REACT_APP_API_BASE_URL}/CodeFile/${fileId}/versions`);
    console.log(response);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching file versions:', error);
    throw error;
  }
};export const uploadFileVersion = async (fileId: number, file: File, fileName: string, language: string) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    console.error("No token found in sessionStorage");
    return;
  }

  const formData = new FormData();
  formData.append("File", file);
  formData.append("FileName", fileName);
  formData.append("FileType", language);

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL||import.meta.env.REACT_APP_API_BASE_URL}/CodeFile/${fileId}/version`, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Version uploaded:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Failed to upload file version2222222", error.response?.data ?? error);
    throw error;
  }
};
// פונקציה למחיקת קובץ
export const deleteFile = async (fileId: number) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    console.error("No token found in sessionStorage");
    return;
  }

  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL||import.meta.env.REACT_APP_API_BASE_URL}/CodeFile/${fileId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("File deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to delete file:", error);
    throw error;
  }
};

// פונקציה לשינוי שם קובץ
export const renameFile = async (fileId: number, newFileName: string) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    console.error("No token found in sessionStorage");
    return;
  }

  const renameFileDto = { NewFileName: newFileName };

  try {
    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL||import.meta.env.REACT_APP_API_BASE_URL}/CodeFile/${fileId}/rename`, renameFileDto, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("File renamed:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to rename file:", error);
    throw error;
  }
};
