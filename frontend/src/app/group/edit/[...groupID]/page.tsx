"use client";

import { useState, useEffect } from "react";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { BASE_URL } from "@/constant/constants";
import { UserType } from "@/context/authStore";

const queryClient = new QueryClient();

function EditGroupComponent() {
  const [groupName, setGroupName] = useState<string>("");
  const [user, setUser] = useState<UserType|null>(null);
  const router = useRouter();
  const { groupID } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem('user-storage');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.state.user);
    }
  }, []);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`${BASE_URL}/groups/${groupID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "uid": user?.uid || '',
            "access-token": user?.accessToken || '',
            "client": user?.client || '',
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch group data");
        }

        const data = await response.json();
        setGroupName(data.name);
        console.log("Fetched", data.name);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    if (user && groupID) {
      fetchGroup();
    }
  }, [groupID, user]);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (updatedName: string) => {
      const response = await fetch(`${BASE_URL}/groups/${groupID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
            "uid": user?.uid || '',
            "access-token": user?.accessToken || '',
            "client": user?.client || '',
        },
        body: JSON.stringify({ name: updatedName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update group");
      }

      return response.json();
    },
    onSuccess: () => {
      router.push("/group");
    },
  });

  const handleSave = () => {
    if (groupName.trim()) {
      mutate(groupName);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Group</h1>
      <input
        type="text"
        className="input input-bordered w-full mb-4"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group name"
      />
      <div className="flex justify-end space-x-2">
        <button 
          className="btn" 
          onClick={() => router.push("/group")}
          disabled={isPending}
        >
          Cancel
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
      {isError && <p className="text-red-500 mt-2">Failed to update group. Please try again.</p>}
    </div>
  );
}

export default function page() {
  return (
    <QueryClientProvider client={queryClient}>
      <EditGroupComponent />
    </QueryClientProvider>
  );
}
