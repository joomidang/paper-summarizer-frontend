import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface KeywordState {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

export const useKeywordStore = create<KeywordState>()(
  persist(
    (set) => ({
      keyword: "",
      setKeyword: (keyword) => set({ keyword }),
    }),
    {
      name: "keyword-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ keyword: state.keyword }),
    }
  )
);
