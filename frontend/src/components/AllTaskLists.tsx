"use client";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import { UserType } from "@/context/authStore";
import { BASE_URL } from "@/constant/constants";
import { useParams } from "next/navigation";
import CreateTaskList from "@/components/CreateTaskList";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient();

export default function AllTaskLists() {
  return (
    <QueryClientProvider client={queryClient}>
      <AllTaskListsContent />
    </QueryClientProvider>
  );
}

function AllTaskListsContent() {
  const [user, setUser] = useState<UserType | null>(null);
  const { groupID } = useParams();
  const router = useRouter();
  const [editTaskListId, setEditTaskListId] = useState<string | null>(null);
  const [newTaskListName, setNewTaskListName] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user-storage");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.state.user);
    }
  }, []);

  const { data: taskLists, isLoading, isError, refetch } = useQuery({
    queryKey: ["taskLists", groupID],
    queryFn: async () => {
      if (!groupID) return;
      const response = await fetch(`${BASE_URL}/groups/${groupID[0]}/task_lists`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'uid': user?.uid || '',
          'client': user?.client || '',
          'access-token': user?.accessToken || '',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task lists");
      }

      return await response.json();
    },
    enabled: !!user && !!groupID,
  });

  const deleteTaskListMutation = useMutation({
    mutationFn: async (taskListId: string) => {
      const response = await fetch(`${BASE_URL}/groups/${groupID[0]}/task_lists/${taskListId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'uid': user?.uid || '',
          'client': user?.client || '',
          'access-token': user?.accessToken || '',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task list");
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const editTaskListMutation = useMutation({
    mutationFn: async ({ taskListId, newName }: { taskListId: string; newName: string }) => {
      const response = await fetch(`${BASE_URL}/groups/${groupID[0]}/task_lists/${taskListId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'uid': user?.uid || '',
          'client': user?.client || '',
          'access-token': user?.accessToken || '',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit task list");
      }
      return response.json();
    },
    onSuccess: () => {
      setEditTaskListId(null);
      setNewTaskListName("");
      refetch();
    },
  });

  const handleEditTaskList = (taskListId: string, name: string) => {
    setEditTaskListId(taskListId);
    setNewTaskListName(name);
  };

  const handleDeleteTaskList = (taskListId: string) => {
    deleteTaskListMutation.mutate(taskListId);
  };

  if (isLoading) {
    return <div>Loading task lists...</div>;
  }

  if (isError) {
    return <div>Error loading task lists. Please try again.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Task Lists</h2>
      <CreateTaskList onTaskListCreated={refetch} />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer">
        {taskLists && taskLists.length > 0 ? (
          taskLists.map((taskList: any) => (
            <div
              key={taskList.id}
              className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 flex flex-col justify-between"
            >
              <div>
                {editTaskListId === taskList.id ? (
                  <>
                    <input
                      type="text"
                      value={newTaskListName}
                      onChange={(e) => setNewTaskListName(e.target.value)}
                      className="border rounded px-2 py-1 mb-2"
                    />
                    <button
                      onClick={() => editTaskListMutation.mutate({ taskListId: taskList.id, newName: newTaskListName })}
                      className="bg-green-500 text-white px-4 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditTaskListId(null)}
                      className="bg-red-500 text-white px-4 py-1 rounded ml-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{taskList.name}</h3>
                    <p className="text-sm text-gray-600">Task List ID: {taskList.id}</p>
                    <button
                      onClick={() => handleEditTaskList(taskList.id, taskList.name)}
                      className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTaskList(taskList.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded mt-2 ml-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No task lists found</p>
        )}
      </div>
    </div>
  );
}
