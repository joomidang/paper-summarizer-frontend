// components/ProfileEditModal.tsx

"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { UserInfo } from "@/types/userInfoType";
import { getCookie } from "@/app/utils/getCookie";
import { apiUrl } from "@/app/(auth)/_components/Login";

interface ProfileEditModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  userInfo: UserInfo;
  onSave: (updatedInfo: Partial<UserInfo>) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onRequestClose,
  userInfo,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    username: userInfo?.username || "",
    interests: userInfo?.interests || [],
  });
  const [isModalReady, setIsModalReady] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>(
    userInfo?.profileImageUrl || "/images/default-profile.png"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [interestInput, setInterestInput] = useState("");

  // userInfo가 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username || "",
        interests: userInfo.interests || [],
      });
      setPreviewImage(
        userInfo.profileImageUrl || "/images/default-profile.png"
      );
    }
  }, [userInfo]);

  // 모달 설정
  useEffect(() => {
    if (typeof window !== "undefined") {
      Modal.setAppElement("body");
      setIsModalReady(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 업로드 (별도 API)
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile); // "image" → "file"로 변경

      const response = await fetch(`${apiUrl}/api/users/me/profile/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("accessToken")}`,
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("이미지 업로드 실패");
      }

      const result = await response.json();
      console.log("이미지 업로드 성공:", result);

      // 업로드 성공 시 파일 선택 초기화
      setSelectedFile(null);

      // 부모 컴포넌트에 알려서 userInfo 새로고침
      await onSave({ profileImageUrl: result.profileImageUrl });
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      // 실패 시 원래 이미지로 복원
      setPreviewImage(
        userInfo?.profileImageUrl || "/images/default-profile.png"
      );
      setSelectedFile(null);
    } finally {
      setIsImageUploading(false);
    }
  };

  // 관심사 추가
  const handleAddInterest = () => {
    if (
      interestInput.trim() &&
      !formData.interests.includes(interestInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()],
      }));
      setInterestInput("");
    }
  };

  // 관심사 삭제
  const handleRemoveInterest = (interestToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter(
        (interest) => interest !== interestToRemove
      ),
    }));
  };

  // 관심사 입력 시 엔터키 처리
  const handleInterestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInterest();
    }
  };

  // 프로필 정보 업데이트 (닉네임, 관심사만)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API 호출 (이미지 제외)
      const response = await fetch(`${apiUrl}/api/users/me/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getCookie("accessToken")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          interests: formData.interests,
        }),
      });

      if (!response.ok) {
        throw new Error("프로필 업데이트 실패");
      }

      // 성공 시 부모 컴포넌트에 알리고 모달 닫기
      await onSave(formData);
      onRequestClose();
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      // 에러 처리 (토스트 메시지 등)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // 폼 데이터 초기화
    setFormData({
      username: userInfo?.username || "",
      interests: userInfo?.interests || [],
    });
    setPreviewImage(userInfo?.profileImageUrl || "/images/default-profile.png");
    setSelectedFile(null);
    setInterestInput("");
    onRequestClose();
  };

  if (!isModalReady) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="프로필 편집"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "0",
          border: "none",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
        },
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">프로필 편집</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 프로필 이미지 섹션 (별도 처리) */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-4">프로필 이미지</h3>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Image
                src={previewImage}
                alt="프로필 이미지 미리보기"
                width={100}
                height={100}
                className="rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-profile.png";
                }}
              />
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-[#1A2747] text-white rounded-full p-2 cursor-pointer hover:bg-[#223366] transition-colors"
              >
                📷
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className="flex flex-col items-center space-y-2">
                <p className="text-sm text-gray-600">
                  선택된 파일: {selectedFile.name}
                </p>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={isImageUploading}
                  className="px-4 py-2 bg-[#2353bb] text-white rounded-md hover:bg-[#223366] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isImageUploading ? "업로드 중..." : "이미지 업로드"}
                </button>
              </div>
            )}

            <p className="text-sm text-gray-500 text-center">
              이미지를 선택한 후 &quot;이미지 업로드&quot; 버튼을 눌러주세요
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 사용자 이름 */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              사용자 이름
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A2747] focus:border-transparent"
              placeholder="사용자 이름을 입력하세요"
              required
            />
          </div>

          {/* 관심사 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              나의 연구 분야 및 관심사
            </label>
            <p className="text-xs text-gray-500">
              관심사를 입력하고 엔터키를 누르면 추가됩니다. 태그를 클릭하면
              삭제됩니다.
            </p>

            {/* 현재 관심사 목록 */}
            {formData.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.interests.map((interest, index) => (
                  <button
                    key={`${interest}-${index}`}
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="bg-[#1A2747] text-white px-3 py-1 rounded-full text-sm hover:bg-[#223366] transition-colors"
                    title="클릭하여 삭제"
                  >
                    {interest} ×
                  </button>
                ))}
              </div>
            )}

            {/* 관심사 입력 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={handleInterestKeyDown}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A2747] focus:border-transparent"
                placeholder="관심사를 입력하세요"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                disabled={!interestInput.trim()}
                className="px-4 py-2 bg-[#1A2747] text-white rounded-md hover:bg-[#223366] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                추가
              </button>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.username.trim()}
              className="px-4 py-2 bg-[#1A2747] text-white rounded-md hover:bg-[#223366] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "저장 중..." : "프로필 저장"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;
