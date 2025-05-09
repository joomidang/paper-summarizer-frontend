"use client";
import Image from "next/image";
import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useFileStore } from "@/store/fileStore";
import { useAuthStore } from "@/store/authStore";
import { apiUrl } from "@/app/(auth)/_components/Login";
import { useRouter } from "next/navigation";

const PaperUpload = () => {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { file, setFile, setPaperId } = useFileStore();
  const { accessToken } = useAuthStore();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type === "application/pdf" ||
        droppedFile.name.endsWith(".tex"))
    ) {
      setFile(droppedFile);
    } else {
      toast.error("PDF 또는 LaTeX 파일 형식만 업로드할 수 있습니다.");
    }
    //esLint-disabled-next-line
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log(selectedFile);
    }
  };

  const handleUploadPaperBtn = async (
    e: React.MouseEvent<HTMLButtonElement>,
    file: File,
    accessToken: string
  ) => {
    e.preventDefault();
    console.log("논문 업로드");
    const formData = new FormData();
    formData.append("file", file);
    if (file?.name) formData.append("title", file.name);

    try {
      const response = await fetch(`${apiUrl}/api/papers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "서버 오류가 발생했습니다." }));
        throw new Error(errorData.message || `HTTP 오류: ${response.status}`);
      }

      const result = await response.json();
      console.log("업로드 성공:", result);
      if (result) {
        console.log(result.data.id);
        setPaperId(result.data.id);
      }
      router.push("/papers/upload/analyze");
      toast.success("논문 업로드가 성공적으로 완료되었습니다.");
      return result;
    } catch (error) {
      console.error("업로드 오류:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#fcfbf6] py-12">
      <div
        className={`xl:w-[80rem] w-[56.25rem] min-h-[25rem] flex flex-col justify-center items-center p-12 border-2 border-dashed rounded-xl transition-colors bg-transparent ${
          isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h1 className="text-2xl font-semibold mb-2 text-center">
          요약하고 싶은 논문 파일을 끌어다 놓으세요
        </h1>
        <h3 className="text-gray-500 mb-8 text-center">
          지원 파일 형식: PDF, LaTex
        </h3>
        <label className="cursor-pointer bg-[#3b5998] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#2d4373] transition-colors">
          파일 선택하기
          <input
            type="file"
            className="hidden"
            accept=".pdf,.tex"
            onChange={handleFileSelect}
          />
        </label>
      </div>
      {file && (
        <div className="xl:w-[80rem] w-[56.25rem] min-h-[6.25rem] flex items-center justify-between bg-[#c9d7f5] rounded-lg px-6 py-3 mt-6">
          <div className="flex items-center gap-2">
            <Image
              src={"/images/CheckMark.png"}
              alt="체크마크"
              priority
              width={28}
              height={28}
            />
            <span className="text-[#3b5998] font-medium">
              업로드 가능한 형식입니다.
            </span>
          </div>
          <span className="text-[#3b5998] font-medium truncate max-w-[900px]">
            {file.name}
          </span>
        </div>
      )}
      {/* TODO: 스타일 수정 필요 */}
      <button
        className={`xl:w-[80rem] w-[56.25rem] mt-8 px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
          file
            ? "bg-[#3b5998] hover:bg-[#2d4373] text-white"
            : "bg-gray-300 text-white cursor-not-allowed"
        }`}
        disabled={!file}
        onClick={(e) =>
          handleUploadPaperBtn(e, file as File, accessToken as string)
        }
      >
        업로드 및 분석 시작
      </button>
    </div>
  );
};

export default PaperUpload;
