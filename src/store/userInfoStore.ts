import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserInfo {
  username: string;
  profileImageUrl: string;
  interests: string[];
}

interface UserInfoState {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  updateUsername: (username: string) => void;
  updateProfileImageUrl: (profileImageUrl: string) => void;
  updateInterests: (interests: string[]) => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  clearUserInfo: () => void;
  isUserInfoComplete: () => boolean;
}

export const useUserInfoStore = create<UserInfoState>()(
  persist(
    (set, get) => ({
      userInfo: null,

      setUserInfo: (userInfo) => set({ userInfo }),

      updateUsername: (username) =>
        set((state) => ({
          userInfo: state.userInfo
            ? { ...state.userInfo, username }
            : { username, profileImageUrl: "", interests: [] },
        })),

      updateProfileImageUrl: (profileImageUrl) =>
        set((state) => ({
          userInfo: state.userInfo
            ? { ...state.userInfo, profileImageUrl }
            : { username: "", profileImageUrl, interests: [] },
        })),

      updateInterests: (interests) => {
        set((state) => ({
          userInfo: state.userInfo
            ? { ...state.userInfo, interests }
            : { username: "", profileImageUrl: "", interests },
        }));
      },

      addInterest: (interest) =>
        set((state) => {
          if (!state.userInfo) {
            return {
              userInfo: {
                username: "",
                profileImageUrl: "",
                interests: [interest],
              },
            };
          }

          const newInterests = state.userInfo.interests.includes(interest)
            ? state.userInfo.interests
            : [...state.userInfo.interests, interest];

          return {
            userInfo: { ...state.userInfo, interests: newInterests },
          };
        }),

      removeInterest: (interest) =>
        set((state) => ({
          userInfo: state.userInfo
            ? {
                ...state.userInfo,
                interests: state.userInfo.interests.filter(
                  (i) => i !== interest
                ),
              }
            : null,
        })),

      clearUserInfo: () => set({ userInfo: null }),

      isUserInfoComplete: () => {
        const { userInfo } = get();
        return !!(
          userInfo &&
          userInfo.username &&
          userInfo.profileImageUrl &&
          userInfo.interests.length > 0
        );
      },
    }),
    {
      name: "userinfo-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ userInfo: state.userInfo }),
    }
  )
);
