import { FC, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/login";
import Register from "../components/register";
import UserFiles from "../components/uploadFile";
import FileViewer from "../components/FileViewer";

const AppRoutes: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Routes>
      {/* עמוד התחברות */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/files" />} />
      
      {/* עמוד הרשמה */}
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/files" />} />

      {/* דפים שדורשים התחברות */}
      {isAuthenticated ? (
        <>
          <Route path="/files" element={<UserFiles />} />
         
          <Route path="/files/:fileId" element={<FileViewer />} />
        </>
      ) : (
        // אם המשתמש לא מחובר ומנסה להיכנס לעמודים פרטיים → נשלח אותו להתחברות
        <Route path="*" element={<Navigate to="/login" />} />
      )}

      {/* אם הנתיב לא קיים, ננווט לפי החיבור */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/files" : "/login"} />} />
    </Routes>
  );
};

export default AppRoutes;
