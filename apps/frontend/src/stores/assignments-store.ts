import { create } from "zustand";
import type { AssignmentStatus } from "@/types/domain";

export interface AssignmentListItem {
  id: string;
  title: string;
  subject: string;
  assignedOn: string;
  dueDate: string;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
  hasStudyMaterial: boolean;
}

interface AssignmentsState {
  items: AssignmentListItem[];
  setItems: (items: AssignmentListItem[]) => void;
  addItem: (item: AssignmentListItem) => void;
  updateItem: (id: string, patch: Partial<AssignmentListItem>) => void;
  removeItem: (id: string) => void;
}

export const useAssignmentsStore = create<AssignmentsState>()((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => ({
      items: [item, ...state.items.filter((a) => a.id !== item.id)],
    })),
  updateItem: (id, patch) =>
    set((state) => ({
      items: state.items.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((a) => a.id !== id),
    })),
}));
