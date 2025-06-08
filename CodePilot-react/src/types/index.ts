export interface User {
  id: number
  username: string
  email: string
}

export interface CodeFile {
  id: number
  fileName: string
  language: string
  filePath: string
  createdAt: string
  updatedAt: string
}

export interface FileVersion {
  versionId: number
  filePath: string
  createdAt: string
}

export interface FileData {
  id: number
  name: string
  filePath: string
  versions: FileVersion[]
}

export interface AuthResponse {
  data: string
  username?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
