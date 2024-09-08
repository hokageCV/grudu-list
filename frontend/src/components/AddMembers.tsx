"use client";
import { useState, useEffect } from "react";
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
        body: JSON.stringify({ user_id: userID }),
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
    } catch (error: any) {
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
      return response.json();
    },
    enabled: false,
  });

  const handleViewMembers = () => {
    setIsModalOpen(true);
    refetchMembers();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[88vh] sm:min-h-screen bg-gray-900">
      <div className="w-full sm:w-2/3 lg:w-1/2 p-6 bg-gray-800 m-2 rounded-lg">
        <div className="sm:flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-200">Add User to Group</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={handleViewMembers}
          >
            View Group Members
          </button>
        </div>
        <form onSubmit={handleAddMember} className="mb-4">
          <div className="flex flex-col mb-4">
            <label htmlFor="userID" className="text-white mb-2">Enter User ID:</label>
            <input
              type="text"
              id="userID"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
              placeholder="User ID"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg shadow transition duration-150 ease-in-out"
            disabled={addUserToGroupMutation.isPending}
          >
            {addUserToGroupMutation.isPending ? "Processing..." : "Add User"}
          </button>
        </form>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:w-2/3 lg:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-200">Group Members</h3>
              <button
                className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
            <ul className="list-disc pl-6 text-gray-300">
              {members?.length > 0 ? (
                members.map((member: any) => (
                  <li key={member.id} className="mb-2">{member.name} (Member: {member.email})</li>
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
