import { useNavigate } from "react-router-dom";
import { getUserFiles, deleteFile, renameFile } from "../services/codeFileService";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code } from 'lucide-react';
import { Skeleton, useTheme, IconButton, Tooltip, Typography, Box } from '@mui/material'; // Import Box
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Modal, Input } from "antd";

interface File {
  id: number;
  fileName: string;
  language: string;
}

const FileList: React.FC<{
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}> = ({ files, setFiles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileToUpdate, setFileToUpdate] = useState<Pick<File, 'id' | 'fileName'> | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const navigate = useNavigate();
  const theme = useTheme();

  const fetchFiles = async () => {
    try {
      const data = await getUserFiles();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileClick = (fileId: number) => {
    navigate(`/files/${fileId}`);
  };

  const handleDeleteFile = async (e: React.MouseEvent, fileId: number) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await deleteFile(fileId);
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFileName = async () => {
    if (!fileToUpdate || !newFileName) return;
    try {
      setIsLoading(true);
      await renameFile(fileToUpdate.id, newFileName);
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileToUpdate.id ? { ...file, fileName: newFileName } : file
        )
      );
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating file name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = (e: React.MouseEvent, file: Pick<File, 'id' | 'fileName'>) => {
    e.stopPropagation();
    setFileToUpdate(file);
    setNewFileName(file.fileName);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFileToUpdate(null);
    setNewFileName("");
  };

  if (isLoading) {
    return (
      <div className="divide-y">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="p-3 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Skeleton className="h-10 w-10 rounded" />
            <div className="flex-1">
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Typography variant="h6" sx={{ mt: 3, mb: 2, color: theme.palette.text.secondary }}>
        File List
      </Typography>
      <div className="divide-y" style={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 4 }}>
        {files.map((file) => (
          <motion.div
            key={file.id}
            className="p-3 flex items-center gap-3 hover:bg-action transition-colors"
            onClick={() => handleFileClick(file.id)}
            whileHover={{ backgroundColor: theme.palette.action.hover }}
          >
            <div className="p-2 rounded" style={{ backgroundColor: theme.palette.primary.light, opacity: 0.7 }}>
              <Code className="w-6 h-6" color={theme.palette.primary.dark} />
            </div>
            <div className="flex-1 min-w-0">
              <Typography variant="subtitle1" className="truncate" color={theme.palette.text.primary}>
                {file.fileName}
              </Typography>
              <Typography variant="caption" color={theme.palette.text.secondary}>
                Language: {file.language || 'Unknown'}
              </Typography>
            </div>
            <div className="flex gap-2">
              <Tooltip title="View File">
                <IconButton onClick={(e) => { e.stopPropagation(); handleFileClick(file.id); }}>
                  <VisibilityIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rename File">
                <IconButton onClick={(e) => showModal(e, { id: file.id, fileName: file.fileName })}>
                  <EditIcon color="secondary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete File">
                <IconButton onClick={(e) => handleDeleteFile(e, file.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            </div>
          </motion.div>
        ))}
        {files.length === 0 && (
          <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
            No files uploaded yet.
          </Typography>
        )}
      </div>

      <Modal
        title={`Rename File: ${fileToUpdate?.fileName}`}
        open={isModalVisible}
        onOk={handleUpdateFileName}
        onCancel={handleModalCancel}
      >
        <Input
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="Enter new file name"
        />
      </Modal>
    </motion.div>
  );
};

export default FileList;