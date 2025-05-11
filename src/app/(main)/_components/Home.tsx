"use client";
import { getCookie } from "@/app/utils/getCookie";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect } from "react";

const Home = () => {
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const accessTokenFromCookie = getCookie("accessToken");

    if (accessTokenFromCookie) {
      setAccessToken(accessTokenFromCookie);
    } else {
      console.log("No access token found in cookies");
    }
  }, [setAccessToken]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>home</h1>
      </main>
    </div>
  );
};

export default Home;
