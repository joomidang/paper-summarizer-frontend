"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import YooptaEditor, {
  createYooptaEditor,
  YooEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import Blockquote from "@yoopta/blockquote";
import Code from "@yoopta/code";
import File from "@yoopta/file";
import Divider from "@yoopta/divider";
import Image from "@yoopta/image";
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";
import ActionMenu, { DefaultActionMenuRender } from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import { markdown } from "@yoopta/exports";

const editorStyles: React.CSSProperties = {
  padding: "20px",
  minHeight: "100vh",
  fontFamily: "pretendard",
  fontSize: "18px",
  lineHeight: "1.5",
  color: "#37352f",
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

const NotionEditor: React.FC = () => {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markdownUrl, setMarkdownUrl] = useState<string>(
    "https://paper-dev-test-magic-pdf-output.s3.ap-northeast-2.amazonaws.com/summaries/4452/767d59df-2316-4ce8-bf08-4d0c48dcb949.md"
  );
  const selectionRef = useRef(null);

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
  ];

  // 텍스트 마크 스타일
  const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

  // 툴 - 노션 스타일 액션 메뉴 및 툴바 설정
  const TOOLS = {
    Toolbar: {
      tool: Toolbar,
      render: DefaultToolbarRender,
    },
    ActionMenu: {
      tool: ActionMenu,
      render: DefaultActionMenuRender,
    },
    LinkTool: {
      tool: LinkTool,
      render: DefaultLinkToolRender,
    },
  };

  const onChange = (
    newValue: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) => {
    setValue(newValue);
    console.log(options);
    //console.log("Editor content changed:", newValue, options);
  };

  useEffect(() => {
    const loadMarkdownContent = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!markdownUrl) {
          throw new Error("마크다운 URL을 찾을 수 없습니다.");
        }
        console.log("마크다운 URL:", markdownUrl);

        const markdownContent = await fetchMarkdownFromUrl(markdownUrl);
        if (!markdownContent) {
          throw new Error("마크다운 내용이 비어있습니다.");
        }

        console.log(
          "불러온 마크다운 내용:",
          markdownContent.substring(0, 100) + "..."
        );

        // 마크다운을 Yoopta 에디터 형식으로 변환
        const yooptaContent = markdown.deserialize(editor, markdownContent);
        setValue(yooptaContent);
        console.log("에디터 값:", yooptaContent);
        editor.setEditorValue(yooptaContent);
      } catch (err) {
        console.error("마크다운 로드 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdownContent();
  }, [editor, selectionRef, markdownUrl]);

  // 별도로 value 변경 확인
  useEffect(() => {
    console.log("에디터 value 변경됨:", value);
  }, [value]);

  return (
    <div style={editorStyles}>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        marks={MARKS}
        tools={TOOLS}
        //value={value}
        onChange={onChange}
        placeholder="/'를 입력하여 명령어를 확인하세요..."
        autoFocus={true}
      />
    </div>
  );
};

export default NotionEditor;
