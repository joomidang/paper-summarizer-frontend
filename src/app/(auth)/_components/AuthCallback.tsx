"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiUrl } from "./Login";

const AuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
              
      // 🔥 변경: URL에서 토큰 직접 확인
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");
      
      if (accessToken) {
        // 토큰이 URL에 있으면 직접 사용
        console.log("URL에서 토큰 발견, 직접 처리");
        
        // 쿠키에 저장
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`;
        if (refreshToken) {
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
        }
        
        console.log("인증 성공! 홈으로 이동합니다.");
        router.push("/");
        return;
      }


        console.log("GitHub 인증 코드 처리 중...");
        const code = searchParams.get("code");
        console.log("GitHub 인증 코드:", code);

        if (!code) {
          throw new Error("인증 코드를 찾을 수 없습니다");
        }

        const response = await fetch(
          `${apiUrl}/api/auth/github/callback?code=${code}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        console.log("백엔드 응답 상태:", response.status);

        const cookies = document.cookie;
        console.log("응답 후 쿠키:", cookies);

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
  }, [router, apiUrl, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {error ? (
        <div className="text-red-600 text-xl">{error}</div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#2A437B] border-t-transparent rounded-full mb-4"></div>
          <p className="text-xl text-gray-700">GitHub 인증 처리 중입니다...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
