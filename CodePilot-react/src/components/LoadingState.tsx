// src/components/LoadingState.tsx
import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="loading-state">
      <p>טוען נתונים...</p>
      {/* אפשר להוסיף כאן ספינר או אינדיקטור טעינה */}
    </div>
  );
};