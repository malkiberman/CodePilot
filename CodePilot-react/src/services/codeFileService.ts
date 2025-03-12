// src/services/codeFileService.ts
import axios from "axios";
import API_BASE_URL from "../config";


export const uploadFile = async (file: File, fileName: string, language: string) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
      console.error("No token found in localStorage");
      return;
  }
console.log("token",token);

  const formData = new FormData();
  
 
  formData.append("File", file);  // שם הפרמטר חייב להיות בדיוק כמו ב-DTO
  formData.append("FileName", fileName);
  formData.append("FileType", language);  // במקום "LanguageType"


  console.log("FormData prepared:");
  formData.forEach((value, key) => console.log(key + ": " + value.toString()));
  console.log(JSON.parse(atob(token.split('.')[1])));
  const timestamp = 1741803791;
  const date = new Date(timestamp * 1000);  // Convert seconds to milliseconds
  console.log(date.toUTCString());
  
  try {
    const response = await axios.post(`${API_BASE_URL}/CodeFile/upload`, formData, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    console.log("Response received:", response.data);
    return response.data;
} catch (error: any) {
    if (error.response) {
        console.error("Server Error:", error.response.status, error.response.data); // מדפיס את הודעת השגיאה מהשרת
    } else {
        console.error("Unexpected Error:", error);
    }
    throw error;
}

};


// export const uploadFile = async (file: File, fileName: string, language: string, email: string, password: string) => {
//   const formData = new FormData();
  
//   // הוספת פרמטרים לקובץ ולנתונים הנלווים
//   formData.append("File", file);
//   formData.append("FileName", fileName);
//   formData.append("LanguageType", language);
//   formData.append("Email", email);
//   formData.append("Password", password);  // הוספת הסיסמה לצורך האימות

//   console.log("FormData prepared:");
//   formData.forEach((value, key) => console.log(key + ": " + value));

//   try {
//       const response = await axios.post(`${API_BASE_URL}/CodeFile/upload`, formData, {
//           headers: {
//               "Content-Type": "multipart/form-data",
//           },
//       });

//       console.log("File uploaded successfully:", response.data);
//       return response.data;
//   } catch (error: any) {
//       console.error("File upload failed", error);
//       throw error;
//   }
// };

export const getFileById = async (fileId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/codefile/${fileId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch file", error);
    throw error;
  }
};
