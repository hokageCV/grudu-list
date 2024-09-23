"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { QueryClient, QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import { UserType } from "@/context/authStore";
import { BASE_URL } from "@/constant/constants";
import { useParams, useRouter } from "next/navigation";
import CreateTaskList from "@/app/group/[...groupID]/CreateTaskList";

import EditIcon from "@/assets/pngs/edit.png";
import DeleteIcon from "@/assets/pngs/delete.png";
import Breadcrumbs from "../../../components/BreadCrumbs";
import Image from "next/image";

const breadcrumbs = [
  { label: 'Home', href: '/home' },
  { label: 'Groups', href: '/group' },
  { label: 'TaskLists', href: '' }
];

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
  const [userRole, setUserRole] = useState<string | null>(null);
  const { groupID } = useParams();
  const router = useRouter();

  const [editTaskListId, setEditTaskListId] = useState<string | null>(null);
  const [newTaskListName, setNewTaskListName] = useState<string>("");

  const fetchUserRole = useCallback(async () => {
    if (groupID && user) {
      try {
        const response = await fetch(`${BASE_URL}/groups/${groupID[0]}/memberships`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'uid': user?.uid || '',
            'client': user?.client || '',
            'access-token': user?.accessToken || '',
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const userMembership = data.find(
          (membership: { user_id: string }) => membership.user_id === user?.id
        );
        setUserRole(userMembership.role);
      } 
      catch (error) {
        console.error('Failed to fetch membership role:', error);
      }
    }
  }, [groupID, user]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user-storage");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.state.user);
    }
  }, []);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  const { data: taskLists, isLoading, isError, refetch } = useQuery({
    queryKey: ["taskLists", groupID],
    queryFn: async () => {
      if (!groupID || !user) throw new Error("Group ID or User is missing");
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

  const handleTaskListClick = (taskListId: string) => {
    router.push(`/tasklist/${taskListId}?role=${encodeURIComponent(userRole || '')}`);
  };

  const isOwnerOrEditor = userRole === 'owner' || userRole === 'editor';

  const renderedTaskLists = useMemo(() => {
    if (!taskLists || taskLists.length === 0) {
      return <p className="text-black">No task lists found</p>;
    }
    return taskLists.map((taskList: { id: string; name: string }) => (
      <div
        key={taskList.id}
        className="bg-card shadow-lg rounded-lg border border-orange-300 p-6 flex flex-col justify-between cursor-pointer"
        onClick={() => handleTaskListClick(taskList.id)}
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
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editTaskListMutation.mutate({
                      taskListId: taskList.id,
                      newName: newTaskListName,
                    });
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg shadow transition duration-150 ease-in-out"
                >
                  Save
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditTaskListId(null);
                  }}
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
              {
                isOwnerOrEditor && (
                  <div className="flex space-x-4 items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTaskList(taskList.id, taskList.name);
                      }}
                      className="flex items-center justify-center"
                    >
                      <Image
                        src={EditIcon}
                        alt="Edit"
                        width={20}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTaskList(taskList.id);
                      }}
                      className="flex items-center justify-center"
                    >
                      <Image
                        src={DeleteIcon}
                        alt="Delete"
                        width={21}
                        className="mt-[1.5px]"
                      />
                    </button>
                  </div>
                )
              }
            </>
          )}
        </div>
      </div>
    ));
  }, [taskLists, editTaskListId, newTaskListName, userRole, editTaskListMutation, deleteTaskListMutation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] bg-[#fff0b5]">
        <div className="text-black text-lg font-semibold">Loading task lists...</div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] bg-[#fff0b5]">
        <div className="text-black text-lg font-semibold">Error loading task lists. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="sm:flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-primary">All Task Lists</h2>
        {
          userRole === 'owner' ? (
            <button
              className="px-4 py-2 bg-[#2f27ce] text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition duration-300"
              onClick={() => router.push(`/members/add/${groupID}`)}
            >
              Add New Member
            </button>
          ) : <></>
        }
      </div>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <CreateTaskList onTaskListCreated={refetch} />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderedTaskLists}
      </div>
    </div>
  );
}