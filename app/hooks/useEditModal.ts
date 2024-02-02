import { create, createStore } from "zustand";
import { SafeListing } from "../types";


interface EditModalStore {
  isOpen: boolean;
  listing: SafeListing;
  setListing: (listing: any) => void;
  onOpen: () => void;
  onClose: () => void;
}

const useEditModal = create<EditModalStore>((set) => ({
  isOpen: false,
  listing: {
    id: "",
    title: "",
    description: "",
    imageSrc: "",
    createdAt: "",
    category: "",
    roomCount: 0,
    bathroomCount: 0,
    guestCount: 0,
    locationValue: "",
    userId: "",
    price: 0,
  },
  setListing: (listing: any) => set({ listing: listing }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useEditModal;
