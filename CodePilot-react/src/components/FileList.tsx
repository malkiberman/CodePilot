import { useNavigate } from "react-router-dom";
import { getUserFiles, deleteFile, renameFile } from "../services/codeFileService";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code } from 'lucide-react';
import { Skeleton } from '@mui/material';
import { Button, Modal, Input } from "antd";


const FileList: React.FC<{ 
  files: { id: number; fileName: string; language: string }[]; 
  setFiles: React.Dispatch<React.SetStateAction<{ id: number; fileName: string; language: string }[]>>;
}> = ({ files, setFiles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileToUpdate, setFileToUpdate] = useState<{ id: number; fileName: string } | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  
  const navigate = useNavigate();
  const fetchFiles = async () => {
    try {
      const data = await getUserFiles();
      setFiles(data);
    } catch (error) {
      console.error("שגיאה בקבלת קבצים:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchFiles();
  }, []); // ✅ תלות ריקה: רק בפעם הראשונה
  
  const handleFileClick = (fileId: number) => {
    navigate(`/files/${fileId}`);
  };

  const handleDeleteFile = async (e: React.MouseEvent, fileId: number) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await deleteFile(fileId);
      await fetchFiles(); // מרענן את הרשימה
      setIsLoading(false);
      setFiles((prevFiles) => prevFiles.filter(file => file.id !== fileId));
    } catch (error) {
      console.error("שגיאה במחיקת הקובץ:", error);
    }
  };

  const handleUpdateFileName = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fileToUpdate || !newFileName) return;
    try {
      setIsLoading(true);
      await renameFile(fileToUpdate.id, newFileName);
      await fetchFiles(); // מרענן את הרשימה
      setIsLoading(false);
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileToUpdate.id ? { ...file, fileName: newFileName } : file
        )
      );
      setIsModalVisible(false);
    } catch (error) {
      console.error("שגיאה בעדכון שם הקובץ:", error);
    }
  };

  const showModal = (e: React.MouseEvent, file: { id: number; fileName: string }) => {
    e.stopPropagation();
    setFileToUpdate(file);
    setNewFileName(file.fileName);
    setIsModalVisible(true);
  };

  if (isLoading) {
    return (
      <div className="divide-y">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2>📁 רשימת קבצים</h2>
      <div className="divide-y">
        {files.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleFileClick(file.id)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded">
                <Code className="w-6 h-6 text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{file.fileName}</span>
                </div>
              </div>
              <div>
                <Button type="link" onClick={() => handleFileClick(file.id)}>
                  🔍 הצג קובץ
                </Button>
                <Button type="link" danger onClick={(e) => handleDeleteFile(e, file.id)}>
                  🗑️ מחק
                </Button>
                <Button type="link" onClick={(e) => showModal(e, file)}>
                  ✏️ עדכן שם
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for updating file name */}
      <Modal
        title="עדכון שם קובץ"
        open={isModalVisible}
        onOk={handleUpdateFileName}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="הכנס שם חדש"
        />
      </Modal>
    </div>
  );
};

export default FileList;
