// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// const vercelUrl = "https://paper-summarizer-frontend.vercel.app";

// const GithubCallbackContent = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     const handleAuthCallback = async () => {
//       try {
//         console.log("GitHub 인증 코드 처리 중...");
//         const code = searchParams.get("code");
//         console.log("GitHub 인증 코드:", code);

//         if (!code) {
//           console.log("code가 없습니다.");
//           router.replace("/");
//           return;
//         }

//         const response = await fetch(
//           `${vercelUrl}/api/auth/github/callback?code=${code}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//           }
//         );

//         console.log("백엔드 응답 상태:", response.status);

//         if (response.ok) {
//           console.log("인증 성공! 홈으로 이동합니다.");
//           router.push("/");
//         } else {
//           console.error(
//             "인증 실패:",
//             await response.text().catch(() => "응답 내용 없음")
//           );
//           setError("인증에 실패했습니다. 다시 시도해주세요.");
//           setTimeout(() => {
//             router.push("/login");
//           }, 3000);
//         }
//       } catch (err) {
//         console.error("인증 처리 중 오류 발생:", err);
//         setError("인증 처리 중 오류가 발생했습니다.");
//         setTimeout(() => {
//           router.push("/login");
//         }, 3000);
//       }
//     };

//     handleAuthCallback();
//   }, [router, searchParams]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//       {error ? (
//         <div className="text-red-600 text-xl">{error}</div>
//       ) : (
//         <div className="flex flex-col items-center">
//           <p className="text-xl text-gray-700">GitHub 인증 완료 중...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GithubCallbackContent;

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const GithubCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  const getApiEndpoint = (code: string) => {
    if (process.env.NODE_ENV === "production") {
      return `https://paper-summarizer-frontend.vercel.app/api/auth/github/callback?code=${code}`;
    } else {
      return `http://localhost:8080/api/auth/github/callback?code=${code}`;
    }
  };

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

        const endpoint = getApiEndpoint(code);

        console.log("API 호출 URL:", endpoint);
        console.log("현재 환경:", process.env.NODE_ENV);

        const response = await fetch(endpoint, {
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
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <div className="text-gray-500">
            3초 후 로그인 페이지로 이동합니다...
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-xl text-gray-700">GitHub 인증 완료 중...</p>
          <p className="text-sm text-gray-500 mt-2">
            환경: {process.env.NODE_ENV === "production" ? "배포" : "개발"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {process.env.NODE_ENV === "production"
              ? "프록시를 통해 백엔드 호출 중..."
              : "백엔드 직접 호출 중..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default GithubCallbackContent;
