import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SummaryState {
  authorName: string;
  title: string;
  brief: string;
  markdownContent: string;
  tags: string[];
  setAuthorName: (authorName: string) => void;
  setTitle: (title: string) => void;
  setBrief: (brief: string) => void;
  setMarkdownContent: (content: string) => void;
  setTags: (tags: string[]) => void;
}

export const useSummaryStore = create<SummaryState>()(
  persist(
    (set) => ({
      authorName: "",
      title: "",
      brief: "",
      markdownContent: "",
      tags: [],
      setAuthorName: (authorName) => set({ authorName }),
      setTitle: (title) => set({ title }),
      setBrief: (brief) => set({ brief }),
      setMarkdownContent: (content) => set({ markdownContent: content }),
      setTags: (tags) => set({ tags }),
    }),
    {
      name: "summary-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        authorName: state.authorName,
        title: state.title,
        brief: state.brief,
        markdownContent: state.markdownContent,
        tags: state.tags,
      }),
    }
  )
);
