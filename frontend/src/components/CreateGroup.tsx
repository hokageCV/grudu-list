"use client";
import { useGroupStore } from '@/context/groupStore';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '@/constant/constants';

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
  const [user, setUser] = useState<any>(null);
  const [groups, setGroupsFromLocalStorage] = useState<any[]>([]);
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
          'uid': user.uid,
          'client': user.client,
          'access-token': user.accessToken,
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
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-backgroundOffset p-4">
      <h1 className="text-2xl font-bold mb-4">Enter the Group Name</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs text-lg p-2 mb-4"
      />
      <button
        onClick={handleSubmit}
        className="btn btn-primary text-white w-full max-w-xs"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Creating...' : 'Create Group'}
      </button>

      {mutation.isError && <p className="text-red-500 mt-2">Error: {mutation.error?.message}</p>}
      {mutation.isSuccess && <p className="text-green-500 mt-2">Group created successfully!</p>}
    </div>
  );
}
