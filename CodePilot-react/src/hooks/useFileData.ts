"use client"

import { useState, useEffect } from "react"
import { getFileById, getFileVersions, fetchFileContent } from "../services/fileService"
import type { FileData } from "../types"

export const useFileData = (fileId: string | undefined) => {
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [displayedContent, setDisplayedContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!fileId) {
        setError("No file ID provided")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const numericFileId = Number.parseInt(fileId, 10)
        if (isNaN(numericFileId)) {
          setError("Invalid file ID")
          return
        }

        // Fetch file info and versions in parallel
        const [fileResponse, versionsResponse] = await Promise.all([
          getFileById(numericFileId),
          getFileVersions(numericFileId),
        ])

        const versions =
          versionsResponse?.map((version: any) => ({
            versionId: version.versionId,
            filePath: version.filePath,
            createdAt: version.createdAt,
          })) || []

        const newFileData: FileData = {
          id: numericFileId,
          name: fileResponse.fileName,
          filePath: fileResponse.filePath,
          versions: versions,
        }

        setFileData(newFileData)

        // תמיד טוען את הקובץ המקורי כברירת מחדל, לא את הגרסה האחרונה
        const content = await fetchFileContent(fileResponse)
        setDisplayedContent(content)
      } catch (error: any) {
        console.error("Error loading file data:", error)
        setError("Failed to load file data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    fileData,
    displayedContent,
    setDisplayedContent,
    loading,
    error,
    fetchFileContent,
  }
}
