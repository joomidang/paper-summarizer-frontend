"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const GithubCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("GitHub 인증 코드 처리 중...");
        const code = searchParams.get("code");
        console.log("GitHub 인증 코드:", code);

        if (!code) {
          console.log("code가 없습니다.");
          router.replace("/");
          return;
        }

        const response = await fetch(`/api/auth/github/callback?code=${code}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("백엔드 응답 상태:", response.status);

        if (response.ok) {
          console.log("인증 성공! 홈으로 이동합니다.");
          router.push("/");
        } else {
          console.error(
            "인증 실패:",
            await response.text().catch(() => "응답 내용 없음")
          );
          setError("인증에 실패했습니다. 다시 시도해주세요.");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (err) {
        console.error("인증 처리 중 오류 발생:", err);
        setError("인증 처리 중 오류가 발생했습니다.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {error ? (
        <div className="text-red-600 text-xl">{error}</div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-xl text-gray-700">GitHub 인증 완료 중...</p>
        </div>
      )}
    </div>
  );
};

export default GithubCallbackContent;
