"use client";
import React from "react";

//export const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const apiUrl =
  process.env.NODE_ENV === "production"
    ? "/api/proxy" // 🔥 프로덕션: Vercel 프록시 사용
    : "https://ec2-43-202-9-100.ap-northeast-2.compute.amazonaws.com"; // 개발환경: 로컬 백엔드

const Login = () => {
  const handleGithubLoginBtn = async () => {
    window.location.href = `https://ec2-43-202-9-100.ap-northeast-2.compute.amazonaws.com/api/auth/github`;
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="w-[80rem] h-px bg-[#000000] mt-[6.25rem] mb-12" />
        <h1 className="font-[HakgyoansimMulgyeol] text-[3.75rem] text-[#2A437B] mb-10">
          논문한입
        </h1>
        <h2 className="text-[#5F5F5F] font-bold text-3xl mb-7">
          논문의 본질을 이해하는 가장 빠른 방법
        </h2>
        <div className="mt-10 mb-52 ">
          <button
            onClick={handleGithubLoginBtn}
            className="w-[23rem] flex items-center gap-6 bg-[#24292F] hover:bg-[#2c3238] text-white py-3 px-6 rounded-lg transition-colors duration-300 shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="pl-14 font-medium text-base text-center">
              GitHub로 로그인
            </span>
          </button>
        </div>
        <div className="w-[80rem] h-px bg-[#000000] mt-12 mb-[6.25rem]" />
      </div>
    </div>
  );
};

export default Login;
