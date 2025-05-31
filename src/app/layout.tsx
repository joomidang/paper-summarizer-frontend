import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import LootLayout from "./_components/LootLayout";
import Providers from "./components/Providers";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "논문한입 | 논문의 본질을 이해하는 가장 빠른 방법",
  description: "AI 논문 요약 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pretendard.variable}>
      <body className={`${pretendard.className} min-h-screen flex flex-col`}>
        <Providers>
          <LootLayout />
          <main className="flex-1">
            {children}
            <ToastContainer position="top-center" autoClose={2000} />
          </main>
          <footer className="w-full h-[4.375rem] px-[20rem] bg-[#1F325C] flex justify-between items-center"></footer>
        </Providers>
      </body>
    </html>
  );
}
