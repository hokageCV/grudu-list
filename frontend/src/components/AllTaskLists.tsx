"use client";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user-storage");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.state.user);
    }
  }, []);

  const { data: taskLists, isLoading, isError, refetch } = useQuery({
    queryKey: ["taskLists"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/groups/${groupID}/task_lists`, {
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

  if (isLoading) {
    return <div>Loading task lists...</div>;
  }

  if (isError) {
    return <div>Error loading task lists. Please try again.</div>;
  }

  return (
  <div className="p-4">
    <h2 className="text-2xl font-semibold mb-4">All Task Lists</h2>
    <CreateTaskList onTaskListCreated={refetch}/>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer" onClick={()=>router.push('/')}>
      {taskLists && taskLists.length > 0 ? (
        taskLists.map((taskList: any) => (
          <div
            key={taskList.id}
            className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 flex flex-col justify-between hover:bg-blue-200"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{taskList.name}</h3>
              <p className="text-sm text-gray-600">Task List ID: {taskList.id}</p>
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
