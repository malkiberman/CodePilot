import { useState } from "react";
import { uploadFile } from "../services/codeFileService";


const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }


    try {
      const data = await uploadFile(file, file.name, "CSharp");
      setMessage(`File uploaded successfully! ID: ${data.fileId}`);
    } catch (error) {
      setMessage("File upload failed.");
    }
  };

  return (
    <div>
      <h2>Upload Code File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      
      <button onClick={handleFileUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadFile;
