"use client";
import { getCookie } from "@/app/utils/getCookie";
import { usePopularSummaries } from "@/hooks/usePaperData";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import PopularSummary from "./PopularSummary";

const Home = () => {
  const { setAccessToken } = useAuthStore();
  const router = useRouter();
  const { data: popularSummaries } = usePopularSummaries();

  useEffect(() => {
    const accessTokenFromCookie = getCookie("accessToken");
    if (accessTokenFromCookie) {
      setAccessToken(accessTokenFromCookie);
    } else {
      console.log("No access token found in cookies");
      router.push("/login");
    }
  }, [setAccessToken, router]);

  useEffect(() => {
    console.log(popularSummaries);
  }, [popularSummaries]);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen">
      <main className="flex flex-col items-center justify-center">
        <div className="min-w-screen min-h-[20rem] bg-[#F6F5F1] flex items-center justify-center">
          <div className="flex items-center justify-between max-w-[80rem] w-full px-24">
            <div className="flex flex-col items-start justify-center gap-5">
              <h1 className="text-4xl font-bold">복잡한 연구, 명쾌한 요약!</h1>
              <h2 className="text-3xl font-semibold">
                논문의 본질을 이해하는 가장 빠른 방법
              </h2>
            </div>
            <Image
              src="/images/paperImage.png"
              alt="home-bg"
              width={250}
              height={250}
            />
          </div>
        </div>
        <div className="w-[80rem] flex flex-col items-center justify-center mt-1 mb-10">
          <div className="w-full">
            <h1 className="font-bold text-3xl my-5">인기 논문</h1>
            <div className="max-w-7xl mx-auto grid grid-cols-2 gap-6 mt-6">
              {popularSummaries
                ?.sort(
                  (a: PopularSummary, b: PopularSummary) =>
                    (b.popularityScore || 0) - (a.popularityScore || 0)
                )
                .map((summary: PopularSummary) => (
                  <PopularSummary key={summary.summaryId} summary={summary} />
                ))}
            </div>
          </div>
          {/* <div className="w-full">
            <h1 className="font-bold text-3xl my-5">추천 논문</h1>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default Home;
