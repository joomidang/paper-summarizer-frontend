"use client";

import React, { useMemo, useState } from "react";
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

const editorStyles: React.CSSProperties = {
  padding: "20px",
  minHeight: "100vh",
  //fontFamily: "Inter, sans-serif",
  fontFamily: "pretendard",
  fontSize: "18px",
  lineHeight: "1.5",
  color: "#37352f",
};

const NotionEditor: React.FC = () => {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();

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
