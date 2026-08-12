import { create } from 'zustand'

interface AdminUiState {
  isSidebarCollapsed: boolean
  isMobileSidebarOpen: boolean

  toggleSidebar: () => void
  openMobileSidebar: () => void
  closeMobileSidebar: () => void
  toggleMobileSidebar: () => void
}

export const useAdminUiStore = create<AdminUiState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,

  toggleSidebar: () =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    })),

  openMobileSidebar: () =>
    set({
      isMobileSidebarOpen: true,
    }),

  closeMobileSidebar: () =>
    set({
      isMobileSidebarOpen: false,
    }),

  toggleMobileSidebar: () =>
    set((state) => ({
      isMobileSidebarOpen: !state.isMobileSidebarOpen,
    })),
}))