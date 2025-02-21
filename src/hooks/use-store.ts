import { StoreResponse } from "@/types/store-response";
import { create } from "zustand";

// Zustand Store
interface StoreResponseState {
    store: StoreResponse | null;
    setStore: (data: StoreResponse) => void;
}

export const useStoreResponse = create<StoreResponseState>((set) => ({
    store: null,
    setStore: (data) => set({ store: data }),
}));