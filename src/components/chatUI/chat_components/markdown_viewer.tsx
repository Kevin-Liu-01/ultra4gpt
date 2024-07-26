import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  const [text, setText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (text.length < markdown.length) {
      intervalRef.current = setInterval(() => {
        setText((prevText) => {
          const newText =
            prevText +
            markdown.substring(prevText.length, prevText.length + 10);
          if (newText.length >= markdown.length) {
            clearInterval(intervalRef.current!);
          }
          return newText;
        });
      }, 0); // Adjust the interval delay as needed
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [markdown]);

  return <Markdown>{text}</Markdown>;
}
