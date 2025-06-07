import { useState } from "react";
import { Button, Spin, message, List, Typography } from "antd";

interface Props {
  content: string | null;
}

const FileAnalyzer: React.FC<Props> = ({ content }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const analyzeFile = async () => {
    if (!content) {
      message.warning("No content to analyze");
      return;
    }

    setLoading(true);
    setSuggestions([]);

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error: any) {
      console.error("Error analyzing file:", error);
      message.error("Failed to analyze file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <Button type="primary" onClick={analyzeFile} disabled={!content}>
        Analyze with AI
      </Button>

      {loading && <Spin style={{ marginLeft: 16 }} />}

      {suggestions.length > 0 && (
        <List
          header={<Typography.Title level={5}>AI Suggestions</Typography.Title>}
          bordered
          dataSource={suggestions}
          renderItem={(item) => <List.Item>{item}</List.Item>}
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default FileAnalyzer;
