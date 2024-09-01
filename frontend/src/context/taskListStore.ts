import { create } from "zustand";
import { persist } from "zustand/middleware";

type TaskListType = {
    id: number;
    name: string;
    group_id: number;
};

type TaskListStore = {
    taskList: TaskListType[];
    setTaskList: (newTaskList: TaskListType[]) => void;
}

export const useTaskListStore = create<TaskListStore>()(
    persist(
      (set) => ({
        taskList: [],
        setTaskList: (newTaskList) => set({ taskList: newTaskList }),
      }),
      {
        name: "tasklist-storage",
      }
    )
  );