"use client";

import { useEffect, useState } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { GroupType } from "@/context/groupStore";
import { BASE_URL } from "../../constants";

const queryClient = new QueryClient();

export default function AllGroups() {
  return (
    <QueryClientProvider client={queryClient}>
      <AllGroupsContent />
    </QueryClientProvider>
  );
}

function AllGroupsContent() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user-storage");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.state.user);
    }
  }, []);

  const { data: groups, isPending, isError } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/groups`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          uid: user?.uid,
          client: user?.client,
          "access-token": user?.accessToken,
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

  const handleEditClick = (groupId: string) => {
    router.push(`/group/edit/${groupId}`);
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
                  <button className="btn btn-primary">View</button>
                  <button
                    className="btn btn-backgroundOffset"
                    onClick={() => handleEditClick(group.id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No groups created</p>
      )}
    </div>
  );
}