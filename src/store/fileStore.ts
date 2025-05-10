import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FileState {
  file: File | null;
  paperId: number;
  summaryId: number;
  markdownUrl: string;
  setFile: (file: File | null) => void;
  setPaperId: (paperId: number) => void;
  setSummaryId: (summaryId: number) => void;
  setMarkdownUrl: (markdownUrl: string) => void;
}

export const useFileStore = create<FileState>()(
  persist(
    (set) => ({
      file: null,
      paperId: 0,
      summaryId: 0,
      markdownUrl: "",
      setFile: (file) => set({ file }),
      setPaperId: (paperId) => set({ paperId }),
      setSummaryId: (summaryId) => set({ summaryId }),
      setMarkdownUrl: (markdownUrl) => set({ markdownUrl }),
    }),
    {
      name: "paper-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        paperId: state.paperId,
        summaryId: state.summaryId,
        markdownUrl: state.markdownUrl,
      }),
    }
  )
);
