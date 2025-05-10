import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SummaryState {
  title: string;
  brief: string;
  markdownContent: string;
  tags: string[];
  setTitle: (title: string) => void;
  setBrief: (brief: string) => void;
  setMarkdownContent: (content: string) => void;
  setTags: (tags: string[]) => void;
}

export const useSummaryStore = create<SummaryState>()(
  persist(
    (set) => ({
      title: "",
      brief: "",
      markdownContent: "",
      tags: [],
      setTitle: (title) => set({ title }),
      setBrief: (brief) => set({ brief }),
      setMarkdownContent: (content) => set({ markdownContent: content }),
      setTags: (tags) => set({ tags }),
    }),
    {
      name: "summary-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        title: state.title,
        brief: state.brief,
        markdownContent: state.markdownContent,
        tags: state.tags,
      }),
    }
  )
);
