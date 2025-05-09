"use client";

import React, { useMemo, useState } from "react";
import YooptaEditor, {
  createYooptaEditor,
  YooEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from "@yoopta/editor";

// 기본 플러그인
import Paragraph from "@yoopta/paragraph";

// 헤딩 플러그인
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";

// 리스트 플러그인
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";

// 인용구 및 코드 플러그인
import Blockquote from "@yoopta/blockquote";
import Code from "@yoopta/code";

// 미디어 및 구분선 플러그인
import File from "@yoopta/file";
import Divider from "@yoopta/divider";
import Image from "@yoopta/image";

// 마크(텍스트 스타일)
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";

// 도구(툴) - 노션 스타일 액션 메뉴 및 툴바
import ActionMenu, { DefaultActionMenuRender } from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";

// 에디터 스타일 정의
const editorStyles: React.CSSProperties = {
  padding: "20px",
  minHeight: "100vh",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#37352f",
};

const NotionEditor: React.FC = () => {
  // 에디터 인스턴스 생성
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();

  // 모든 플러그인 통합
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

  // 텍스트 마크(스타일) 정의
  const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

  // 도구(툴) 정의 - 노션 스타일 액션 메뉴 및 툴바 설정
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
    console.log("Editor content changed:", newValue);
  };

  return (
    <div style={editorStyles}>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        marks={MARKS}
        tools={TOOLS}
        value={value}
        onChange={onChange}
        placeholder="/'를 입력하여 명령어를 확인하세요..."
        autoFocus={true}
      />
    </div>
  );
};

export default NotionEditor;
