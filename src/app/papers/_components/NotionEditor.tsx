"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Descendant, Text, Element as SlateElement } from "slate";
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
import Link from "@yoopta/link";
import Callout from "@yoopta/callout";
import Table from "@yoopta/table";
import Embed from "@yoopta/embed";
import { useSummaryStore } from "@/store/summaryStore";
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

const isText = (node: Descendant): node is Text => {
  return !("children" in node);
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

const NotionEditor = ({
  initialMarkdownUrl,
}: {
  initialMarkdownUrl: string;
}) => {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [markdownUrl] = useState<string>(initialMarkdownUrl);
  const selectionRef = useRef(null);
  const { setMarkdownContent, setTitle } = useSummaryStore();

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
    // .extend({
    //   elementProps: {
    //     image: (props) => {
    //       let src = props.src;

    //       // S3 이미지인 경우
    //       if (src?.includes("s3.ap-northeast-2.amazonaws.com")) {
    //         src = `/api/s3-proxy?url=${encodeURIComponent(src)}`;
    //       }

    //       // 기타 외부 이미지인 경우
    //       else if (src?.startsWith("http")) {
    //         src = `/api/image-proxy?url=${encodeURIComponent(src)}`;
    //       }

    //       return {
    //         ...props,
    //         src,
    //         crossOrigin: "anonymous",
    //         referrerPolicy: "no-referrer",
    //       };
    //     },
    //   },
    // }),
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

  const extractTitleFromYoopta = (yooptaContent: YooptaContentValue) => {
    try {
      const items = Object.values(yooptaContent);
      const titleItem = items.find((item) => item.meta?.order === 0);

      if (titleItem) {
        //console.log("제목 아이템:", titleItem);
        const element = titleItem.value?.[0] as SlateElement;
        const firstChild = element.children?.[0];
        const title = firstChild && isText(firstChild) ? firstChild.text : "";

        if (title) {
          //console.log("추출된 제목:", title);
          setTitle(title);
        }
      } else {
        console.log("meta.order가 0인 항목을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("제목 추출 중 오류:", error);
    }
  };

  const onChange = (
    newValue: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) => {
    setValue(newValue);
    console.log(options);

    try {
      const mdContent = markdown.serialize(editor, newValue || {});
      setMarkdownContent(mdContent);
      //console.log("변경된 내용을 마크다운으로 변환하여 store에 저장");

      extractTitleFromYoopta(newValue);
    } catch (error) {
      console.error("마크다운 변환 실패:", error);
    }
  };

  useEffect(() => {
    const loadMarkdownContent = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!markdownUrl) {
          throw new Error("마크다운 URL을 찾을 수 없습니다.");
        }
        //console.log("마크다운 URL:", markdownUrl);

        //const markdownContent = await fetchMarkdownFromUrl(markdownUrl);
        const markdownContent = await fetchMarkdownFromUrl(
          "https://paper-dev-test-magic-pdf-output.s3.ap-northeast-2.amazonaws.com/summaries/4452/2a3fawdf-2316-4ce8-bf08-4d0c48dcb949.md"
        );
        if (!markdownContent) {
          throw new Error("마크다운 내용이 비어있습니다.");
        }

        // console.log(
        //   "불러온 마크다운 내용:",
        //   markdownContent.substring(0, 100) + "..."
        // );

        const yooptaContent = markdown.deserialize(editor, markdownContent);
        setValue(yooptaContent);
        editor.setEditorValue(yooptaContent);

        setMarkdownContent(markdownContent);
        console.log("초기 마크다운을 store에 저장", markdownContent);
        console.log("에디터 값:", yooptaContent);

        extractTitleFromYoopta(yooptaContent);
      } catch (err) {
        console.error("마크다운 로드 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdownContent();
  }, [editor, selectionRef, markdownUrl, setMarkdownContent]);

  useEffect(() => {
    //console.log("에디터 value 변경됨:", value);
  }, [value]);

  return (
    <div style={editorStyles}>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        marks={MARKS}
        tools={TOOLS}
        onChange={onChange}
        placeholder="/'를 입력하여 명령어를 확인하세요..."
        autoFocus={true}
        style={{
          width: "100%",
          maxWidth: "100%",
          paddingBottom: "20px",
        }}
      />
    </div>
  );
};

export default NotionEditor;
