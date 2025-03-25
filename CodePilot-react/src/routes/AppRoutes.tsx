import { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/login";
import Register from "../components/register";
import UserFiles from "../components/uploadFile";
import FileViewer from "../components/FileViewer";

interface AppRoutesProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const AppRoutes: FC<AppRoutesProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/files" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/files" />} />
      <Route path="/files" element={isAuthenticated ? <UserFiles /> : <Navigate to="/login" />} />
      <Route path="/files/:fileId" element={isAuthenticated ? <FileViewer /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/files" : "/login"} />} />
    </Routes>
  );
};

export default AppRoutes;
