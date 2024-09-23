"use client";
import { useState, useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/constant/constants";
import { useParams } from "next/navigation";
import { UserType } from "@/context/authStore";

const queryClient = new QueryClient();

export default function AddMembers() {
  return (
    <QueryClientProvider client={queryClient}>
      <AddMembersContent />
    </QueryClientProvider>
  );
}

function AddMembersContent() {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState("viewer");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { groupID } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("user-storage");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.state.user);
    }
  }, []);

  const fetchUserByID = async () => {
    const response = await fetch(`${BASE_URL}/users/${userID}`, {
      headers: {
        'Content-Type': 'application/json',
        'uid': user?.uid || '',
        'client': user?.client || '',
        'access-token': user?.accessToken || '',
      },
    });

    if (!response.ok) {
      throw new Error("User not found");
    }
    return response.json();
  };

  const addUserToGroupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/groups/${groupID}/memberships`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'uid': user?.uid || '',
          'client': user?.client || '',
          'access-token': user?.accessToken || '',
        },
        body: JSON.stringify({ user_id: userID, role: selectedRole }),
      });
      if (!response.ok) {
        throw new Error("Failed to add user to group");
      }
      return response.json();
    },
    onSuccess: () => {
      setSuccessMessage("User added to the group successfully!");
      setErrorMessage("");
      setUserID("");
      setSelectedRole("viewer");
      refetchMembers();
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      setErrorMessage(error.message || "Error adding user to group");
      setTimeout(() => setErrorMessage(""), 3000);
    },
  });

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userID) {
      setErrorMessage("Please enter a user ID.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const fetchedUser = await fetchUserByID();
      if (fetchedUser) {
        addUserToGroupMutation.mutate();
      }
    } 
    catch (error: any) {
      setErrorMessage(error.message || "User not found");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const { data: members, refetch: refetchMembers } = useQuery({
    queryKey: ["groupMembers", groupID],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/groups/${groupID}/members`, {
        headers: {
          'Content-Type': 'application/json',
          'uid': user?.uid || '',
          'client': user?.client || '',
          'access-token': user?.accessToken || '',
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch group members");
      }
      const result = await response.json();
      const onlyMembers = result.filter((member: any) => member.role !== "owner");
      return onlyMembers;
    },
    enabled: false,
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberID: string) => {
      const response = await fetch(`${BASE_URL}/groups/${groupID}/memberships/${memberID}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'uid': user?.uid || '',
          'client': user?.client || '',
          'access-token': user?.accessToken || '',
        },
      });
      if (!response.ok) {
        throw new Error("Failed to remove member");
      }
      return response.json();
    },
    onSuccess: () => {
      setSuccessMessage("Member removed successfully");
      refetchMembers();
      setTimeout(() => setSuccessMessage(""), 3000);
    },

    onError: (error) => {
      setErrorMessage(error.message || "Error removing member");
      setTimeout(() => setErrorMessage(""), 3000);
    },
  }
);

  const memoizedMembers = useMemo(() => members, [members]);

  const handleViewMembers = () => {
    if(memoizedMembers === undefined){
      refetchMembers();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRemoveMember = (memberID:string) => {
    removeMemberMutation.mutate(memberID);
  }

  return (
    <div className="flex justify-center items-center min-h-[88vh] sm:min-h-screen bg-background">
      <div className="w-full sm:w-2/3 lg:w-1/2 p-6 bg-card m-2 rounded-lg">
        <div className="sm:flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary">Add User to Group</h2>
          <button
            className="px-4 py-2 bg-[#2f27ce] text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={handleViewMembers}
          >
            View Group Members
          </button>
        </div>
        <form onSubmit={handleAddMember} className="mb-4">
          <div className="flex flex-col mb-4">
            <label htmlFor="userID" className="text-primary mb-2">Enter User ID:</label>
            <input
              type="text"
              id="userID"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              className="border bg-pink-100 border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
              placeholder="User ID"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-primary mb-2">Select Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border bg-pink-100 border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg shadow transition duration-150 ease-in-out"
            disabled={addUserToGroupMutation.isPending}
          >
            {addUserToGroupMutation.isPending ? "Processing..." : "Add User"}
          </button>
        </form>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-2/3 lg:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary">Group Members</h3>
              <button
                className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
            <ul className="list-disc pl-6 text-primary">
              {memoizedMembers?.length > 0 ? (
                memoizedMembers.map((member: any) => (
                  <li key={member.id} className="mb-2 flex items-center justify-between">
                    <span>{member.email} (Role: {member.role})</span>
                    <button
                      className="bg-black text-white px-2 py-1 rounded hover:bg-gray-800 transition duration-300"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))
              ) : (
                <li>No members found</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}