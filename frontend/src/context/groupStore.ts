import { create } from "zustand";
import { persist } from "zustand/middleware";

type OwnerType = {
    id: string;
    name: string;
};

export type GroupType = {
    id: string;
    name: string;
    owner: OwnerType;
};

type GroupStore = {
    groups: GroupType[];
    setGroups: (newGroups: GroupType[]) => void;
}

export const useGroupStore = create<GroupStore>()(
    persist(
        (set)=>({
            groups: [],
            setGroups: (newGroups) => set({groups:newGroups}),
        }),
        {
            name: 'group-storage'
        }
    )
)