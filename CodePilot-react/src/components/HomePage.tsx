import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";

const codeSnippets = [
  "git commit -m 'Initial commit'",
  "npm install @mui/material",
  "docker build -t myapp .",
  "yarn start",
  "npx eslint . --fix",
];

const AnimatedShapes = () => {
  const theme = useTheme();

  const shapes = [
    { top: "10%", left: "15%", size: 240, delay: 0 },
    { top: "25%", left: "70%", size: 300, delay: 2 },
    { top: "55%", left: "40%", size: 280, delay: 4 },
    { top: "75%", left: "10%", size: 200, delay: 6 },
  ];

  return (
    <>
      {shapes.map((shape, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: shape.top,
            left: shape.left,
            width: shape.size,
            height: shape.size,
            borderRadius: "50%",
            backgroundColor: theme.palette.secondary.main,
            opacity: 0.08,
            animation: `float ${30 + shape.delay}s ease-in-out ${shape.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0px) rotate(0deg);
            }
            100% {
              transform: translateY(-60px) rotate(10deg);
            }
          }
        `}
      </style>
    </>
  );
};



const TypingCode = () => {
  const [currentText, setCurrentText] = useState("");
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentSnippet = codeSnippets[snippetIndex];
    const delay = isDeleting ? 50 : 150;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentSnippet.length) {
        setCurrentText(currentSnippet.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentText(currentSnippet.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else {
        if (!isDeleting) {
          setTimeout(() => setIsDeleting(true), 1000);
        } else {
          setIsDeleting(false);
          setSnippetIndex((snippetIndex + 1) % codeSnippets.length);
          setCharIndex(0);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, snippetIndex]);

  return (
    <Typography
      variant="h4"
      sx={{
        fontFamily: "monospace",
        color: "#4CAF50",
        whiteSpace: "pre",
        minHeight: "2em",
      }}
    >
      {currentText}
      <span className="cursor">|</span>
      <style>
        {`
          .cursor {
            display: inline-block;
            animation: blink 1s step-end infinite;
          }

          @keyframes blink {
            from, to { opacity: 0; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </Typography>
  );
};

const Home = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        p: 4,
      }}
    >
      <AnimatedShapes />
      <Typography variant="h1" sx={{ color: theme.palette.primary.main, mb: 2 }}>
        CodePilot
      </Typography>
      <Typography variant="h5" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
        Smart Versioning. Visual Diff. Total Control.
      </Typography>
      <TypingCode />
    </Box>
  );
};

export default Home;
