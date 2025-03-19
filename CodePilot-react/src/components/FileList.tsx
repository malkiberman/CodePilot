import { useNavigate } from "react-router-dom";
import { List, Button } from "antd";
import { getUserFiles } from "../services/codeFileService";
import { useEffect, useState } from "react";

const FileList: React.FC = () => {
  const [files, setFiles] = useState<{ id: number; fileName: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getUserFiles();  // לאחזר את הקבצים מהשירות
        setFiles(data);
      } catch (error) {
        console.error("שגיאה בקבלת קבצים:", error);
      }
    };
    fetchFiles();
  }, []);

  const handleFileClick = (fileId: number) => {
    navigate(`/files/${fileId}`);  // נווט לדף הצגת הקובץ
  };

  return (
    <div>
      <h2>📁 רשימת קבצים</h2>
      <List
        dataSource={files}
        renderItem={(file) => (
          <List.Item>
            {file.fileName}
            <Button type="link" onClick={() => handleFileClick(file.id)}>
              🔍 הצג קובץ
            </Button>
          </List.Item>
        )}
      />
    </div>
  );
};

export default FileList;
