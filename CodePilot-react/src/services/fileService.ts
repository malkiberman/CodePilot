import axios from "axios"
import type { CodeFile, FileVersion } from "../types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.REACT_APP_API_BASE_URL

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token")
  return {
    Authorization: `Bearer ${token}`,
  }
}

// File Management
export const uploadFile = async (file: File, fileName: string, language: string) => {
  const formData = new FormData()
  formData.append("File", file)
  formData.append("FileName", fileName)
  formData.append("FileType", language)

  try {
    const response = await axios.post(`${API_BASE_URL}/CodeFile/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error: any) {
    console.error("Upload failed:", error.response?.data ?? error)
    throw error
  }
}

export const getUserFiles = async (): Promise<CodeFile[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/CodeFile/user`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    console.error("Failed to fetch user files:", error)
    throw error
  }
}

export const getFileById = async (fileId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/codefile/${fileId}/download`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    console.error("Failed to fetch file:", error)
    throw error
  }
}

export const deleteFile = async (fileId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/CodeFile/${fileId}`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    console.error("Failed to delete file:", error)
    throw error
  }
}

export const renameFile = async (fileId: number, newFileName: string) => {
  const renameFileDto = { NewFileName: newFileName }

  try {
    const response = await axios.put(`${API_BASE_URL}/CodeFile/${fileId}/rename`, renameFileDto, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    console.error("Failed to rename file:", error)
    throw error
  }
}

// Version Management
export const getFileVersions = async (fileId: number): Promise<FileVersion[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/CodeFile/${fileId}/versions`, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    console.error("Failed to fetch file versions:", error)
    throw error
  }
}

export const uploadFileVersion = async (fileId: number, file: File, fileName: string, language: string) => {
  const formData = new FormData()
  formData.append("File", file)
  formData.append("FileName", fileName)
  formData.append("FileType", language)

  try {
    const response = await axios.post(`${API_BASE_URL}/CodeFile/${fileId}/version`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error: any) {
    console.error("Failed to upload file version:", error.response?.data ?? error)
    throw error
  }
}

// Content Fetching
export const fetchFileContent = async (filePath: string): Promise<string> => {
  try {
    console.log("Fetching file content from:", filePath);
    
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error("Failed to fetch file content")
    }
    return await response.text()
  } catch (error) {
    console.error("Error fetching file content:", error)
    throw error
  }
}
