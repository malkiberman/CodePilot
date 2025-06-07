import { useState } from "react";
import { Button, Spin, message, List, Typography, Drawer } from "antd";
import { RobotOutlined } from "@ant-design/icons";

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
const response = await fetch("https://codepilot-6qnc.onrender.com/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify("public class MyClass { }"), // כי השרת מקבל סטרינג ישיר
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setSuggestions(Array.isArray(data) ? data : data.suggestions || []);
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
      {/* כפתור צף בצד שמאל למטה */}
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
          disabled={!content}
        >
          לניתוח הקוד
        </Button>
      </div>

      {/* Drawer שמופיע עם ההצעות */}
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
