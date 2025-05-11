import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "react-toastify";

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
        <div className="w-full h-[4.375rem] px-8 xl:px-[20rem] md:px-[5rem] bg-[#1F325C] flex justify-between items-center">
          <Link href={"/"}>
            <Image
              src="/images/논문한입title.png"
              alt="logo"
              width={120}
              height={120}
              priority
            />
          </Link>
          <div className="flex items-center justify-start gap-[5rem] pr-8">
            <Link href={"/"}>
              <h1 className="text-[#fffef8] text-[1.125rem] font-semibold">
                Home
              </h1>
            </Link>
            <Link href={"/papers"}>
              <h1 className="text-[#fffef8] text-[1.125rem] font-semibold">
                논문 둘러보기
              </h1>
            </Link>
            <Link href={"/papers/upload"}>
              <h1 className="text-[#fffef8] text-[1.125rem] font-semibold">
                논문 요약하기
              </h1>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-[1.25rem]">
            <Link href={"/login"}>
              <h1 className="text-[#fffef8] text-[1.125rem] font-semibold">
                Login
              </h1>
            </Link>
          </div>
        </div>
        <main className="flex-1">
          {children} <ToastContainer position="top-center" autoClose={2000} />
        </main>
        <footer className="w-full h-[4.375rem] px-[20rem] bg-[#1F325C] flex justify-between items-center"></footer>
      </body>
    </html>
  );
}
