"use client";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect } from "react";

const Home = () => {
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split("=");
        if (cookieName === name) {
          return decodeURIComponent(cookieValue);
        }
      }
      return null;
    };

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
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <h1>footer</h1>
      </footer>
    </div>
  );
};

export default Home;
