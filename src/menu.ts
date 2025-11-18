import { create } from "zustand";

type GenericMenuState = {
    isOpen: boolean;
    toggleMenu: () => void;
    openMenu: () => void;
    closeMenu: () => void;
}

type OverviewMenuState = {
    isOpen: boolean;
    isLocked: boolean;
    toggleLockMenu: () => void;
    toggleMenu: () => void;
    openMenu: () => void;
    closeMenu: () => void;
    lockMenu: () => void;
    unlockMenu: () => void;
}

export const useHomeMenu = create<GenericMenuState>((set) => ({
    isOpen: false,
    toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
    openMenu: () => set({ isOpen: true }),
    closeMenu: () => set({ isOpen: false }),
}));

export const useOverviewMenu = create<OverviewMenuState>((set) => ({
    isOpen: false,
    isLocked: false,
    toggleLockMenu: () => set((state) => ({ isLocked: !state.isLocked })),
    toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
    openMenu: () => set({ isOpen: true }),
    closeMenu: () => set({ isOpen: false }),
    lockMenu: () => set({ isLocked: true }),
    unlockMenu: () => set({ isLocked: false }),
}))

export const useSettingsMenu = create<GenericMenuState>((set) => ({
    isOpen: false,
    toggleMenu: () => set((state) => ({ isOpen: !state.isOpen})),
    openMenu: () => set({ isOpen: true }),
    closeMenu: () => set({ isOpen: false }),
}));

export const useClientMenu = create<GenericMenuState>((set) => ({
    isOpen: false,
    toggleMenu: () => set((state) => ({ isOpen: !state.isOpen})),
    openMenu: () => set({ isOpen: true }),
    closeMenu: () => set({ isOpen: false }),
}));

export const useBlogCreationMenu = create<GenericMenuState>((set) => ({
    isOpen: false,
    toggleMenu: () => set((state) => ({ isOpen: !state.isOpen})),
    openMenu: () => set({ isOpen: true }),
    closeMenu: () => set({ isOpen: false }),
}));

export const useGeneralMenu = create<GenericMenuState>((set) => ({
    isOpen: false,
    toggleMenu: () => set((state) => ({ isOpen: !state.isOpen})),
    openMenu: () => set({ isOpen: true }),
    closeMenu: () => set({ isOpen: false }),
}));