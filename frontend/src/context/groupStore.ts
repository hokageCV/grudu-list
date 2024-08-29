import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserType } from "./authStore";

type OwnerType = {
    id: string;
    name: string;
};

type TaskListType = {
    title: string;
    tasks: string[];
}

export type GroupType = {
    id: string;
    name: string;
    owner: OwnerType;
    tasklists: TaskListType[];
    memberships: UserType[];
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