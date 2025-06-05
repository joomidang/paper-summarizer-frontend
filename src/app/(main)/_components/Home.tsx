"use client";
import { getCookie } from "@/app/utils/getCookie";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Home = () => {
  const { setAccessToken } = useAuthStore();
  const router = useRouter();
  // const { data: userInfo } = useUserInfo();
  // const [isChecking] = useState(true);
  // const [hasHydrated] = useState(false);

  useEffect(() => {
    const accessTokenFromCookie = getCookie("accessToken");
    if (accessTokenFromCookie) {
      setAccessToken(accessTokenFromCookie);
    } else {
      console.log("No access token found in cookies");
      router.push("/login");
    }
  }, [setAccessToken, router]);

  // useEffect(() => {
  //   const unsubscribe = useUserInfoStore.persist.onFinishHydration(() => {
  //     setHasHydrated(true);
  //   });

  //   // 이미 하이드레이션이 완료된 경우
  //   if (useUserInfoStore.persist.hasHydrated()) {
  //     setHasHydrated(true);
  //   }

  //   return unsubscribe;
  // }, []);

  // useEffect(() => {
  //   if (!hasHydrated) return;
  //   console.log("userInfo:", userInfo);

  //   const checkUserInfo = () => {
  //     console.log("userInfo:", userInfo);
  //     if (
  //       !userInfo ||
  //       (!userInfo.username &&
  //         !userInfo.profileImageUrl &&
  //         userInfo.interests.length === 0)
  //     ) {
  //       router.push("/login");
  //       return;
  //     }
  //     setIsChecking(false);
  //   };

  //   checkUserInfo();
  // }, [userInfo, router, hasHydrated]);

  // if (!hasHydrated || isChecking) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div>Loading...</div>
  //     </div>
  //   );
  // }

  // if (isChecking) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div>Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>home</h1>
      </main>
    </div>
  );
};

export default Home;
