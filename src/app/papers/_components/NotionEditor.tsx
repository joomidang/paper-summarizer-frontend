"use client";
import { Transforms } from 'slate';
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
import Link from "@yoopta/link";
import Callout from "@yoopta/callout";
import Table from "@yoopta/table";
import Embed from "@yoopta/embed";


// 마크다운에서 이미지 추출하는 함수
const extractImagesFromMarkdown = (markdown: string) => {
  // 정규식: ![대체텍스트](이미지URL) 형식 감지
  const regex = /!\[(.*?)\]\((.*?)\)/g;
  const images = [];
  let match;
  
  while ((match = regex.exec(markdown)) !== null) {
    images.push({
      alt: match[1],
      url: match[2]
    });
  }
  
  console.log("추출된 이미지:", images);
  return images;
};

// 마크다운 내용을 이미지 위치 정보와 함께 파싱
const parseMarkdownWithImagePositions = (markdown: string) => {
  const lines = markdown.split('\n');
  const result = [];
  const imagePositionMap = {}; // 이미지 URL을 키로, 위치 정보를 값으로 저장
  
  let currentPosition = 0;
  
  // 각 라인을 순회하면서 텍스트와 이미지 정보 추출
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 이미지 태그 찾기
    const imageMatches = line.match(/!\[(.*?)\]\((.*?)\)/g);
    
    if (imageMatches) {
      // 이미지가 있는 경우
      let processedLine = line;
      let offset = 0;
      
      for (const imgMatch of imageMatches) {
        // 이미지 태그 분석
        const altMatch = imgMatch.match(/!\[(.*?)\]/);
        const urlMatch = imgMatch.match(/\((.*?)\)/);
        
        if (urlMatch) {
          const imgUrl = urlMatch[1];
          const imgAlt = altMatch ? altMatch[1] : '';
          
          // 이미지 위치 정보 저장 (라인 번호와 이미지 앞의 텍스트)
          imagePositionMap[imgUrl] = {
            lineIndex: i,
            precedingText: processedLine.substring(0, processedLine.indexOf(imgMatch, offset)),
            alt: imgAlt
          };
          
          offset = processedLine.indexOf(imgMatch, offset) + imgMatch.length;
        }
      }
    }
    
    // 텍스트 노드 추가
    result.push({
      type: 'text',
      content: line,
      position: currentPosition
    });
    
    currentPosition++;
  }
  
  return {
    parsedContent: result,
    imagePositions: imagePositionMap
  };
};
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
    Divider,
    Link,
    Callout,
    Table,
    Embed,
    Image.extend({
      elementProps: {
        image: (props) => {
          let src = props.src;

          return {
            ...props,
            src,
            crossOrigin: "anonymous",
            referrerPolicy: "no-referrer",
            loading: "lazy",
            style: { maxWidth: "100%", display: "block" }, // 스타일 추가
            onLoad: () => console.log("이미지 로드 성공:", src),
            onError: (e) => console.error("이미지 로딩 오류:", e.target.src),
          };
        },
      },
    }),
  ];
  const ImagePlugin = plugins.find(p => p.id === 'Image');
  // Slate Transforms API를 사용한 이미지 노드 삽입 함수

// insertImage 함수 수정
const insertImage = (url: string, alt: string = "") => {
  try {
    // 에디터 포커스
    editor.focus();
    
    // 이미지 플러그인의 명령어 사용
    if (ImagePlugin && typeof ImagePlugin.commands?.insert === 'function') {
      // 이미지 삽입 명령어 사용
      ImagePlugin.commands.insert(editor, { 
        src: url, 
        alt: alt || "" 
      });
      console.log("이미지 플러그인 명령어로 삽입 성공:", url);
    } else {
      console.warn("이미지 플러그인 명령어를 찾을 수 없음");
      
      // 대체 방법: 이미지 노드를 직접 생성하여 콘텐츠에 추가
      if (value) {
        const updatedContent = {...value};
        const imageId = `image-${Date.now()}`;
        
        // Yoopta 형식의 이미지 노드 추가
        updatedContent[imageId] = {
          id: imageId,
          type: "Image",
          value: [{
            id: `${imageId}-inner`,
            type: "image",
            props: {
              nodeType: "void",
              src: url,
              alt: alt || "",
              fit: "contain"
            },
            children: [{ text: "" }]
          }],
          meta: {
            order: Object.keys(updatedContent).length,
            depth: 0
          }
        };
        
        setValue(updatedContent);
        editor.setEditorValue(updatedContent);
      }
    }
  } catch (err) {
    console.error("이미지 삽입 오류:", err);
  }
};
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
      
      // 마크다운에서 이미지 추출 및 위치 정보 파싱
      const images = extractImagesFromMarkdown(markdownContent);
      const { imagePositions } = parseMarkdownWithImagePositions(markdownContent);
      console.log("이미지 위치 정보:", imagePositions);
      
      // 마크다운을 Yoopta 에디터 형식으로 변환
      const yooptaContent = markdown.deserialize(editor, markdownContent);
      setValue(yooptaContent);
      console.log("에디터 값:", yooptaContent);
      editor.setEditorValue(yooptaContent);
      
      // JSON을 문자열로 변환하여 이미지 존재 여부 확인
      const contentString = JSON.stringify(yooptaContent);
      const hasImages = contentString.includes("type\":\"image");
      
      // 이미지가 없고 추출된 이미지가 있으면 원래 위치에 삽입
      if (!hasImages && images.length > 0) {
        setTimeout(() => {
          console.log("이미지 원래 위치에 삽입 시작");
          
          // Yoopta 콘텐츠에 있는 노드들을 찾아서 매핑
          const contentEntries = Object.entries(yooptaContent);
          const nodesByPosition = {};
          
          // 각 노드의 내용과 위치를 추적
          contentEntries.forEach(([id, node]) => {
            if (node.meta) {
              const order = node.meta.order;
              nodesByPosition[order] = {
                id,
                node
              };
            }
          });
          
          // 이미지 위치 정보를 기반으로 삽입
          if (ImagePlugin && typeof ImagePlugin.commands?.insert === 'function') {
            // 마크다운 라인 번호를 Yoopta 노드 순서와 매핑
            const lineToOrderMap = {};
            let currentLine = 0;
            
            Object.values(nodesByPosition).forEach((item, index) => {
              // 노드 내용을 확인하여 어떤 라인에 해당하는지 추적
              const nodeContent = JSON.stringify(item.node);
              const lineCount = (nodeContent.match(/\\n/g) || []).length + 1;
              
              for (let i = 0; i < lineCount; i++) {
                lineToOrderMap[currentLine + i] = index;
              }
              
              currentLine += lineCount;
            });
            
            // 이미지 삽입을 위한 데이터 구성
            const imageInsertData = images.map(img => {
              const posInfo = imagePositions[img.url];
              let targetPosition = 0;
              
              if (posInfo) {
                // 이미지가 있던 라인에 해당하는 Yoopta 노드 찾기
                targetPosition = lineToOrderMap[posInfo.lineIndex] || 0;
              }
              
              return {
                img,
                position: targetPosition
              };
            });
            
            // 위치 기준으로 정렬 (원래 순서 유지)
            imageInsertData.sort((a, b) => a.position - b.position);
            
            // 이미지를 해당 위치에 삽입
            let updatedContent = {...yooptaContent};
            
            imageInsertData.forEach((data, index) => {
              // 이미지 삽입 위치 다음에 새 노드로 삽입
              const imageId = `image-${Date.now()}-${index}`;
              const targetOrder = data.position + index; // 이미지 삽입으로 인한 오프셋 조정
              
              // 새 이미지 노드 생성
              updatedContent[imageId] = {
                id: imageId,
                type: "Image",
                value: [{
                  id: `${imageId}-inner`,
                  type: "image",
                  props: {
                    nodeType: "void",
                    src: data.img.url,
                    alt: data.img.alt || "",
                    fit: "contain"
                  },
                  children: [{ text: "" }]
                }],
                meta: {
                  order: targetOrder + 1, // 바로 다음 위치에 삽입
                  depth: 0
                }
              };
              
              // 이후 노드들의 order 값 증가
              Object.values(updatedContent).forEach(node => {
                if (node.meta && node.meta.order > targetOrder) {
                  node.meta.order++;
                }
              });
              
              console.log(`이미지 ${index + 1}/${images.length} 원래 위치(${targetOrder})에 삽입: ${data.img.url}`);
            });
            
            // 업데이트된 콘텐츠 설정
            setValue(updatedContent);
            editor.setEditorValue(updatedContent);
            console.log("모든 이미지 원래 위치에 삽입 완료");
          } else {
            console.warn("이미지 플러그인 명령어를 찾을 수 없음, 기본 방식으로 삽입");
            
            // 기본 방식으로 이미지 삽입
            const updatedContent = {...yooptaContent};
            
            images.forEach((img, index) => {
              const imageId = `image-${Date.now()}-${index}`;
              
              updatedContent[imageId] = {
                id: imageId,
                type: "Image", 
                value: [{
                  id: `${imageId}-inner`,
                  type: "image",
                  props: {
                    nodeType: "void",
                    src: img.url,
                    alt: img.alt || "",
                    fit: "contain"
                  },
                  children: [{ text: "" }]
                }],
                meta: {
                  order: Object.keys(updatedContent).length,
                  depth: 0
                }
              };
              
              console.log(`이미지 ${index + 1}/${images.length} 추가: ${img.url}`);
            });
            
            setValue(updatedContent);
            editor.setEditorValue(updatedContent);
            console.log("이미지 삽입 완료");
          }
        }, 800);
      }
    } catch (err) {
      console.error("마크다운 로드 오류:", err);
      setError(err.message);
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
        value={value}
        onChange={onChange}
        placeholder="/'를 입력하여 명령어를 확인하세요..."
        autoFocus={true}
        style={{
          width: "100%",
          maxWidth: "100%",
          paddingBottom: "20px", // 원하는 값으로 조정
        }}
      />
    </div>
  );
};

export default NotionEditor;
