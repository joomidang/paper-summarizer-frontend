// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// //import { apiUrl } from "../_components/Login";

// export default function GithubCallbackPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const code = searchParams.get("code");
//     if (!code) {
//       // code 없으면 홈으로
//       router.replace("/");
//       console.log("code가 없습니다.");
//       return;
//     }

//     fetch(`/api/auth/github/callback?code=${code}`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//     })
//       .then(async (res) => {
//         if (res.ok) {
//           router.replace("/");
//         } else {
//           alert("로그인 실패");
//           router.replace("/login");
//         }
//       })
//       .catch(() => {
//         alert("로그인 실패");
//         router.replace("/login");
//       });
//   }, [router, searchParams]);

//   return (
//     <div className="min-h-screen flex justify-center items-center">
//       로그인 중입니다...
//     </div>
//   );
// }
// /app/callback/page.tsx
"use client";

import React, { Suspense } from "react";
import GithubCallbackContent from "../_components/GithubCallbackContent";

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin w-12 h-12 border-4 border-[#2A437B] border-t-transparent rounded-full mb-4"></div>
            <p className="text-xl text-gray-700">
              GitHub 인증 처리 중입니다...
            </p>
          </div>
        </div>
      }
    >
      <GithubCallbackContent />
    </Suspense>
  );
}
