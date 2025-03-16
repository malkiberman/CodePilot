import  { FC, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/login";
import Register from "../components/register";
import UploadFile from "../components/uploadFile";
import UserFiles from "../components/uploadFile";
import FileViewer from "../components/FileViewer";

const AppRoutes: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // בדוק אם יש טוקן ב-localStorage או sessionStorage
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Routes>
      {/* נתיב ללוגין */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/login" />} />
      
      {/* נתיב להרשמה */}
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/register" />} />

      {/* כל הדפים האחרים מוצגים רק אם המשתמש מחובר */}
      {isAuthenticated && (
        <>
          <Route path="/upload" element={<UploadFile />} />
          <Route path="/user-files" element={<UserFiles />} />
          <Route path="/file/:id" element={<FileViewer />} />
        </>
      )}

      {/* דף ברירת מחדל אם הנתיב לא נמצא */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/upload" : "/login"} />} />
    </Routes>
  );
};

export default AppRoutes;
