"use client";
import { GroupType, useGroupStore } from '@/context/groupStore';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '@/constant/constants';
import { UserType } from '@/context/authStore';

const queryClient = new QueryClient();

export default function CreateGroup() {
  return (
    <QueryClientProvider client={queryClient}>
      <CreateGroupForm />
    </QueryClientProvider>
  );
}

function CreateGroupForm() {
  const [name, setName] = useState("");
  const [user, setUser] = useState<UserType|null>(null);
  const [groups, setGroupsFromLocalStorage] = useState<GroupType[]>([]);
  const setGroups = useGroupStore((state) => state.setGroups);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user-storage');
    const storedGroups = localStorage.getItem('group-storage');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.state.user);
    }

    if (storedGroups) {
      const parsedGroups = JSON.parse(storedGroups);
      setGroupsFromLocalStorage(parsedGroups.state.groups);
    }
  }, []);

  const mutation = useMutation({
    mutationFn: async (groupName: string) => {
      const response = await fetch(`${BASE_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'uid': user?.uid || '',
          'client': user?.client || '',
          'access-token': user?.accessToken || '',
        },
        body: JSON.stringify({ name: groupName }),
      });
      if (!response.ok) {
        throw new Error('Error creating group');
      }
      return response.json();
    },
    onSuccess: (data) => {
      const updatedGroups = [...groups, data];
      setGroups(updatedGroups);

      router.push('/group');
    },
    onError: (error) => {
      console.error('Failed to create group:', error);
    },
  });

  const handleSubmit = () => {
    mutation.mutate(name);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] sm:min-h-[100vh] p-4 bg-[#fff0b5]">
      <h1 className="text-2xl text-primary font-bold mb-4">Enter the Group Name</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type here"
        className="bg-yellow-200 text-black w-full max-w-xs text-lg p-3 mb-4 border border-yellow-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
      />
      <button
        onClick={handleSubmit}
        className="btn bg-yellow-400 hover:bg-yellow-500 text-black w-full max-w-xs py-2 rounded-md shadow-lg transition duration-150"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Creating...' : 'Create Group'}
      </button>
  
      {mutation.isError && <p className="text-red-500 mt-2">Error: {mutation.error?.message}</p>}
      {mutation.isSuccess && <p className="text-green-500 mt-2">Group created successfully!</p>}
    </div>
  );  
}
