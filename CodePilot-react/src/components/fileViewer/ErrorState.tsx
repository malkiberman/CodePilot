// src/components/ErrorState.tsx
import React from "react";

interface ErrorStateProps {
  error: string | null;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="error-state">
      <h2>אירעה שגיאה</h2>
      <p>{error || "אירעה שגיאה לא ידועה."}</p>
    </div>
  );
};