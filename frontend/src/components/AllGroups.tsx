"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { GroupType } from "@/context/groupStore";
import { BASE_URL } from "@/constant/constants";
import { UserType } from "@/context/authStore";

const queryClient = new QueryClient();

export default function AllGroups() {
  return (
    <QueryClientProvider client={queryClient}>
      <AllGroupsContent />
    </QueryClientProvider>
  );
}

function AllGroupsContent() {
  const [user, setUser] = useState<UserType|null>(null);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user-storage");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.state.user);
    }
  }, []);

  const { data: groups, isPending, isError, refetch } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/groups`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'uid': user?.uid || '',
          'client': user?.client || '',
          'access-token': user?.accessToken || '',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

      const data = await response.json();
      return data.filter((group: GroupType) => group.owner.id === user?.id);
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const response = await fetch(`${BASE_URL}/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'uid': user?.uid || '',
          'client': user?.client || '',
          'access-token': user?.accessToken || '',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete group");
      }

      return groupId;
    },
    onSuccess: (deletedGroupId) => {
      setIsModalOpen(false);
      refetch();
    },
    onError: (error) => {
      console.error("Failed to delete group:", error);
    },
  });

  const handleEditClick = (groupId: string) => {
    router.push(`/group/edit/${groupId}`);
  };

  const handleDeleteClick = (groupId: string) => {
    setGroupToDelete(groupId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (groupToDelete) {
      deleteMutation.mutate(groupToDelete);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching groups. Please try again.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Groups</h1>
      {groups && groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group: GroupType) => (
            <div key={group.id} className="card bg-neutral text-neutral-content w-full shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title">{group.name}</h2>
                <p>Owner: {group.owner.name} (ID: {group.owner.id})</p>
                <div className="card-actions justify-end">
                  <button 
                    className="btn btn-primary"
                    onClick={() => router.push(`/group/${group.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-backgroundOffset"
                    onClick={() => handleEditClick(group.id)}
                  >
                    Edit
                  </button>
                  {group.owner.id === user?.id && (
                    <button
                      className="btn btn-error"
                      onClick={() => handleDeleteClick(group.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No groups created</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this group?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="btn btn-backgroundOffset"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}