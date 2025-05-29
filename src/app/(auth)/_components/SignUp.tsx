"use client";

import { getCookie } from "@/app/utils/getCookie";
import { useUserInfoStore } from "@/store/userInfoStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiUrl } from "./Login";

const SignUp = () => {
  const { userInfo, addInterest, removeInterest } = useUserInfoStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      addInterest(input.trim());
      setInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    removeInterest(tag);
  };

  const handleSignUp = async () => {
    if (!userInfo) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${apiUrl}/api/users/me/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("accessToken")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: userInfo.username,
          profileImageUrl: userInfo.profileImageUrl,
          interests: userInfo.interests,
        }),
      });
      if (!res.ok) throw new Error("프로필 등록 실패");
      setMessage("프로필이 성공적으로 등록되었습니다!");
      toast.success("프로필이 성공적으로 등록되었습니다!");
      router.push("/");
    } catch (err) {
      console.error(err);
      setMessage("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !userInfo?.username ||
    !userInfo?.profileImageUrl ||
    !userInfo?.interests ||
    userInfo.interests.length === 0 ||
    loading;

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="w-[80rem] h-px bg-[#000000] mt-[6.25rem] mb-12" />
        <h1 className="font-bold text-4xl text-[#2A437B] mb-10">회원가입</h1>
        <h2 className="text-[#5F5F5F] font-bold text-xl mb-7">
          회원님의 추가 정보를 기입해주세요.
        </h2>

        <div className="flex flex-col gap-10 w-full max-w-2xl items-center justify-center mb-8">
          <div className="flex flex-col gap-2 w-full items-center">
            <label className="text-2xl font-bold mb-2">닉네임</label>
            <input
              type="text"
              className="w-full max-w-xl border rounded-full px-6 py-3 text-lg outline-none focus:outline-none focus:ring-0 bg-white"
              placeholder="닉네임을 입력하세요"
              value={userInfo?.username ?? ""}
              onChange={(e) =>
                useUserInfoStore.getState().updateUsername(e.target.value)
              }
            />
          </div>

          <div className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-bold mb-2">
              나의 연구 분야 및 관심사
            </h2>
            <p className="text-gray-400 mb-6 text-center">
              내 연구 분야 및 관심사를 입력하고 엔터키를 누르면 등록됩니다.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {(userInfo?.interests ?? []).map((tag, idx) => (
                <button
                  key={tag + idx}
                  className="bg-[#495A87] text-white px-6 py-2 mb-6 rounded-full text-lg font-semibold focus:outline-none relative"
                  onClick={() => handleRemoveTag(tag)}
                  type="button"
                  title="클릭 시 삭제"
                >
                  {tag}
                </button>
              ))}
            </div>
            <input
              className="w-full max-w-xl border rounded-full px-6 py-3 text-lg outline-none focus:outline-none focus:ring-0 bg-white"
              type="text"
              placeholder="연구 분야 또는 관심사를 입력하세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <label className="text-2xl font-bold mb-2">프로필 이미지</label>
          <input
            type="file"
            accept="image/*"
            className="block w-40 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#495A87] file:text-white hover:file:bg-[#223366]"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (typeof reader.result === "string") {
                    useUserInfoStore
                      .getState()
                      .updateProfileImageUrl(reader.result);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {userInfo?.profileImageUrl && (
            <Image
              src={userInfo.profileImageUrl}
              alt="프로필 미리보기"
              className="w-20 h-20 rounded-full object-cover border mt-2"
              width={80}
              height={80}
            />
          )}
        </div>
        <div className="mt-10 mb-52 ">
          <button
            className={`xl:w-[56.25rem] w-[30rem] mt-8 px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
              isDisabled
                ? "bg-gray-300 text-white cursor-not-allowed"
                : "bg-[#3b5998] hover:bg-[#2d4373] text-white"
            }`}
            disabled={isDisabled}
            onClick={handleSignUp}
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>
          {message && (
            <div className="mt-4 text-center text-sm text-[#2A437B]">
              {message}
            </div>
          )}
        </div>
        <div className="w-[80rem] h-px bg-[#000000] mt-12 mb-[6.25rem]" />
      </div>
    </div>
  );
};

export default SignUp;
// "use client";

// import { apiUrl } from "@/app/contexts/AuthContext";
// import { getCookie } from "@/app/utils/getCookie";
// import { useUserInfoStore } from "@/store/userInfoStore";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { toast } from "react-toastify";

// const SignUp = () => {
//   const { userInfo, addInterest, removeInterest } = useUserInfoStore();
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const router = useRouter();

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && input.trim()) {
//       addInterest(input.trim());
//       setInput("");
//     }
//   };

//   const handleRemoveTag = (tag: string) => {
//     removeInterest(tag);
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       // 미리보기를 위한 데이터 URL 생성
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (typeof reader.result === "string") {
//           useUserInfoStore.getState().updateProfileImageUrl(reader.result);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSignUp = async () => {
//     if (!userInfo) return;
//     setLoading(true);
//     setMessage("");

//     try {
//       const profileRes = await fetch(`${apiUrl}/api/users/me/profile`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${getCookie("accessToken")}`,
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           username: userInfo.username,
//           interests: userInfo.interests,
//         }),
//       });

//       if (!profileRes.ok) {
//         const errorData = await profileRes.text();
//         console.error("프로필 업데이트 실패:", errorData);
//         throw new Error("프로필 정보 등록에 실패했습니다.");
//       }

//       let imageUploadSuccess = true;
//       if (selectedFile) {
//         try {
//           const formData = new FormData();
//           formData.append("image", selectedFile);

//           const imageRes = await fetch(`${apiUrl}/api/users/me/profile/image`, {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${getCookie("accessToken")}`,
//             },
//             credentials: "include",
//             body: formData,
//           });

//           if (!imageRes.ok) {
//             imageUploadSuccess = false;
//             const errorData = await imageRes.text();
//             console.warn("프로필 이미지 업로드 실패:", errorData);
//           }
//         } catch (imageError) {
//           imageUploadSuccess = false;
//           console.warn("프로필 이미지 업로드 에러:", imageError);
//         }
//       }

//       // 결과에 따른 메시지 표시
//       if (!imageUploadSuccess && selectedFile) {
//         setMessage("프로필 정보는 저장되었지만 이미지 업로드에 실패했습니다.");
//         toast.warning(
//           "프로필 정보는 저장되었지만 이미지 업로드에 실패했습니다."
//         );
//       } else {
//         setMessage("프로필이 성공적으로 등록되었습니다!");
//         toast.success("프로필이 성공적으로 등록되었습니다!");
//       }

//       router.push("/");
//     } catch (err) {
//       console.error(err);
//       setMessage("오류가 발생했습니다. 다시 시도해주세요.");
//       toast.error("오류가 발생했습니다. 다시 시도해주세요.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isDisabled =
//     !userInfo?.username ||
//     !userInfo?.profileImageUrl ||
//     !userInfo?.interests ||
//     userInfo.interests.length === 0 ||
//     loading;

//   return (
//     <div>
//       <div className="flex flex-col items-center">
//         <div className="w-[80rem] h-px bg-[#000000] mt-[6.25rem] mb-12" />
//         <h1 className="font-bold text-4xl text-[#2A437B] mb-10">회원가입</h1>
//         <h2 className="text-[#5F5F5F] font-bold text-xl mb-7">
//           회원님의 추가 정보를 기입해주세요.
//         </h2>

//         <div className="flex flex-col gap-10 w-full max-w-2xl items-center justify-center mb-8">
//           <div className="flex flex-col gap-2 w-full items-center">
//             <label className="text-2xl font-bold mb-2">닉네임</label>
//             <input
//               type="text"
//               className="w-full max-w-xl border rounded-full px-6 py-3 text-lg outline-none focus:outline-none focus:ring-0 bg-white"
//               placeholder="닉네임을 입력하세요"
//               value={userInfo?.username ?? ""}
//               onChange={(e) =>
//                 useUserInfoStore.getState().updateUsername(e.target.value)
//               }
//             />
//           </div>

//           <div className="flex flex-col items-center w-full">
//             <h2 className="text-2xl font-bold mb-2">
//               나의 연구 분야 및 관심사
//             </h2>
//             <p className="text-gray-400 mb-6 text-center">
//               내 연구 분야 및 관심사를 입력하고 엔터키를 누르면 등록됩니다.
//             </p>
//             <div className="flex flex-wrap gap-4 justify-center">
//               {(userInfo?.interests ?? []).map((tag, idx) => (
//                 <button
//                   key={tag + idx}
//                   className="bg-[#495A87] text-white px-6 py-2 mb-6 rounded-full text-lg font-semibold focus:outline-none relative"
//                   onClick={() => handleRemoveTag(tag)}
//                   type="button"
//                   title="클릭 시 삭제"
//                 >
//                   {tag}
//                 </button>
//               ))}
//             </div>
//             <input
//               className="w-full max-w-xl border rounded-full px-6 py-3 text-lg outline-none focus:outline-none focus:ring-0 bg-white"
//               type="text"
//               placeholder="연구 분야 또는 관심사를 입력하세요"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />
//           </div>
//         </div>
//         <div className="flex flex-col items-center gap-2 w-full">
//           <label className="text-2xl font-bold mb-2">프로필 이미지</label>
//           <input
//             type="file"
//             accept="image/*"
//             className="block w-40 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#495A87] file:text-white hover:file:bg-[#223366]"
//             onChange={handleFileChange}
//           />
//           {userInfo?.profileImageUrl && (
//             <Image
//               src={userInfo.profileImageUrl}
//               alt="프로필 미리보기"
//               className="w-20 h-20 rounded-full object-cover border mt-2"
//               width={80}
//               height={80}
//             />
//           )}
//         </div>
//         <div className="mt-10 mb-52 ">
//           <button
//             className={`xl:w-[56.25rem] w-[30rem] mt-8 px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
//               isDisabled
//                 ? "bg-gray-300 text-white cursor-not-allowed"
//                 : "bg-[#3b5998] hover:bg-[#2d4373] text-white"
//             }`}
//             disabled={isDisabled}
//             onClick={handleSignUp}
//           >
//             {loading ? "처리 중..." : "회원가입"}
//           </button>
//           {message && (
//             <div className="mt-4 text-center text-sm text-[#2A437B]">
//               {message}
//             </div>
//           )}
//         </div>
//         <div className="w-[80rem] h-px bg-[#000000] mt-12 mb-[6.25rem]" />
//       </div>
//     </div>
//   );
// };

// export default SignUp;
