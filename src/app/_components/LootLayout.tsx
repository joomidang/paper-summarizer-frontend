// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import { getCookie } from "@/app/utils/getCookie";

// const LootLayout = () => {
//   const accessToken =
//     typeof window !== "undefined" ? getCookie("accessToken") : null;
//   return (
//     <div className="w-full h-[4.375rem] px-8 xl:px-[20rem] md:px-[5rem] bg-[#1F325C] flex justify-between items-center">
//       <Link href={"/"}>
//         <Image
//           src="/images/논문한입title.png"
//           alt="logo"
//           width={120}
//           height={120}
//           priority
//         />
//       </Link>
//       <div className="flex items-center justify-start gap-[5rem] pr-8">
//         <Link href={"/"}>
//           <h1 className="text-[#fffef8] text-[1.125rem] font-semibold">Home</h1>
//         </Link>
//         <Link href={"/papers"}>
//           <h1 className="text-[#fffef8] text-[1.125rem] font-semibold">
//             논문 둘러보기
//           </h1>
//         </Link>
//         <Link href={"/papers/upload"}>
//           <h1 className="text-[#fffef8] text-[1.125rem] font-semibold">
//             논문 요약하기
//           </h1>
//         </Link>
//       </div>
//       <div className="flex items-center justify-center gap-[1.25rem]">
//         <Link href={"/login"}>
//           <h1
//             className={`text-[#fffef8] text-[1.125rem] font-semibold ${
//               accessToken ? " invisible" : ""
//             }`}
//           >
//             Login
//           </h1>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default LootLayout;

"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getCookie } from "@/app/utils/getCookie";
import { apiUrl } from "../(auth)/_components/Login";

const LootLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogoutBtn = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/auth/withdraw`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //TODO: OAuth 서버로부터 발급받은 코드?
          authorizationCode: "",
        }),
      });
      if (!res.ok) throw new Error("로그아웃 실패");
      const response = await res.json();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    setIsLoggedIn(!!accessToken);
  }, []);

  return (
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
          <h1 className="text-[#fffef8] text-[1.125rem] font-semibold">Home</h1>
        </Link>
        <Link href={"/papers/browsing"}>
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
        {/*Todo: 로그아웃 기능 추가 */}
        {!isLoggedIn ? (
          <Link href={"/login"}>
            <h1 className="text-[#fffef8] text-[1.125rem] font-semibold">
              Login
            </h1>
          </Link>
        ) : (
          <button
            onClick={handleLogoutBtn}
            className="text-[#fffef8] text-[1.125rem] font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default LootLayout;
