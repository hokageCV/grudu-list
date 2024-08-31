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
                    className="border border-gray-300 rounded-lg px-3 py-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
                    placeholder="Enter new task list name"
                  />
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => editTaskListMutation.mutate({ taskListId: taskList.id, newName: newTaskListName })}
                      className="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg shadow transition duration-150 ease-in-out"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditTaskListId(null)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg shadow transition duration-150 ease-in-out"
                    >
                      Cancel
                    </button>
                  </div>
                </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{taskList.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">Task List ID: {taskList.id}</p>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => router.push(`/tasklist/${taskList.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow transition duration-150 ease-in-out"
                      >
                        View Tasks
                      </button>
                      <button
                        onClick={() => handleEditTaskList(taskList.id, taskList.name)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-5 py-2 rounded-lg shadow transition duration-150 ease-in-out"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTaskList(taskList.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg shadow transition duration-150 ease-in-out"
                      >
                        Delete
                      </button>
                    </div>
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
