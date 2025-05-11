"use client";

import React, { useEffect, useMemo, useState } from "react";
import YooptaEditor, {
  createYooptaEditor,
  YooEditor,
  YooptaContentValue,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import Blockquote from "@yoopta/blockquote";
import Code from "@yoopta/code";
import File from "@yoopta/file";
import Divider from "@yoopta/divider";
import Image from "@yoopta/image";
import { markdown } from "@yoopta/exports";
import Link from "@yoopta/link";
import Callout from "@yoopta/callout";
import Table from "@yoopta/table";
import Embed from "@yoopta/embed";

const editorStyles: React.CSSProperties = {
  padding: "20px",
  maxWidth: "100%",
  minHeight: "100vh",
  fontFamily: "pretendard",
  fontSize: "18px",
  lineHeight: "1.5",
  color: "#37352f",
  overflowY: "auto",
};

const fetchMarkdownFromUrl = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 텍스트로 응답 받기
    const markdownContent = await response.text();
    return markdownContent;
  } catch (error) {
    console.error("마크다운 파일 가져오기 실패:", error);
    throw error;
  }
};

const Summary = ({ initialMarkdownUrl }: { initialMarkdownUrl: string }) => {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const [, setValue] = useState<YooptaContentValue>();
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [markdownUrl] = useState<string>(initialMarkdownUrl);

  const plugins = [
    Paragraph,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
    NumberedList,
    BulletedList,
    TodoList,
    Blockquote,
    Code,
    File,
    Image,
    Divider,
    Link,
    Callout,
    Table,
    Embed,
    Image,
  ];

  // Summary 컴포넌트 내부
  useEffect(() => {
    const loadMarkdownContent = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!markdownUrl) {
          setLoading(false);
          return; // URL이 없으면 조기 리턴
        }

        const markdownContent = await fetchMarkdownFromUrl(markdownUrl);
        if (!markdownContent) {
          throw new Error("마크다운 내용이 비어있습니다.");
        }

        const yooptaContent = markdown.deserialize(editor, markdownContent);
        setValue(yooptaContent);
        editor.setEditorValue(yooptaContent);
      } catch (err) {
        console.error("마크다운 로드 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdownContent();
  }, [editor, markdownUrl]); // initialMarkdownUrl 대신 markdownUrl을 직접 사용하고 의존성에 추가

  return (
    <div style={editorStyles}>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        readOnly={true}
        style={{
          width: "100%",
          maxWidth: "100%",
          paddingBottom: "20px",
          pointerEvents: "none", // 클릭 이벤트 차단
          userSelect: "text", // 텍스트 선택만 허용
        }}
      />
    </div>
  );
};

export default Summary;
