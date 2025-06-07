import React, { useState } from "react";
import { Button, Spin, message, List, Typography, Drawer } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import axios from "axios";

interface Props {
  content: string | null;
}

const FileAnalyzer: React.FC<Props> = ({ content }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

 const analyzeFile = async () => {
  if (!content) {
    message.warning("No content to analyze");
    return;
  }

  setLoading(true);
  setSuggestions([]);

  try {
      const token = sessionStorage.getItem("token");

    const response = await axios.post(
      "https://codepilot-6qnc.onrender.com/api/Ai/analyze",
      { content }, // שולח כאובייקט – אם השרת מצפה למבנה כזה
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const data = response.data;
    setSuggestions([data]);
    setOpen(true);
  } catch (error: any) {
    console.error("Error analyzing file:", error);
    message.error("Failed to analyze file");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        <Button
          type="primary"
          shape="round"
          icon={<RobotOutlined />}
          size="large"
          onClick={analyzeFile}
          disabled={!content || loading}
        >
          לניתוח הקוד
        </Button>
      </div>

      <Drawer
        title="הצעות מבוססות AI"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        width={350}
      >
        {loading ? (
          <Spin />
        ) : suggestions.length > 0 ? (
          <List
            bordered
            dataSource={suggestions}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        ) : (
          <Typography.Text type="secondary">
            אין הצעות להצגה.
          </Typography.Text>
        )}
      </Drawer>
    </>
  );
};

export default FileAnalyzer;
