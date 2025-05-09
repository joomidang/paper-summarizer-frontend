"use client";
import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import { apiUrl } from "@/app/(auth)/_components/Login";
import { useFileStore } from "@/store/fileStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const PaperAnalyze = () => {
  const [progress, setProgress] = useState<number>(0);
  const [, setIsLoading] = useState<boolean>(false);
  const { paperId } = useFileStore();
  const hasRequestedRef = useRef<boolean>(false);
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const handleAnalyze = async () => {
    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + 2;
        return prev;
      });
    }, 100);

    try {
      const response = await fetch(`${apiUrl}/api/papers/${paperId}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          prompt: "test",
          language: "ko",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `API 요청 실패: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("분석 결과:", data);
      clearInterval(interval);
      setProgress(100);
      toast.success("분석이 완료되었습니다");
      router.push(`/papers/upload/edit/${paperId}`);
    } catch (error) {
      console.error("분석 중 오류 발생:", error);
      toast.error("분석 요청 중 오류가 발생했습니다");
      clearInterval(interval);
      setProgress(0);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    console.log("Analyzing with paperId:", paperId);
    handleAnalyze();
    return () => {
      console.log("Component unmounting");
    };
    //esLint-disabled-next-line
  }, []);

  return (
    <ProgressBar
      progress={progress}
      text="논문의 표와 그림을 추출하여 시작하고 있습니다..."
    />
  );
};

export default PaperAnalyze;
