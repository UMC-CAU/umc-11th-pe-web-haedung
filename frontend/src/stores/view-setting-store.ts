import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type MovieSortBy = "releaseDate" | "title";

interface ViewSettingStore {
  sortBy: MovieSortBy;
  setSortBy: (sortBy: MovieSortBy) => void;
}

export const useViewSettingStore = create<ViewSettingStore>()(
  persist(
    (set) => ({
      sortBy: "releaseDate",
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    {
      name: "umcine-view-setting",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sortBy: state.sortBy,
      }),
    },
  ),
);
