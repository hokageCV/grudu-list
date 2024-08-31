"use client"

import { BASE_URL } from '@/constant/constants';
import { UserType } from '@/context/authStore';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const queryClient = new QueryClient();

export default function CreateTaskList({onTaskListCreated}:{onTaskListCreated:() => void}) {
  return (
    <QueryClientProvider client={queryClient}>
      <CreateTaskListContent onTaskListCreated={onTaskListCreated}/>
    </QueryClientProvider>
  );
}

function CreateTaskListContent({ onTaskListCreated }: { onTaskListCreated: () => void }){
  const { groupID } = useParams();
  const [taskListName, setTaskListName] = useState('');
  const [user, setUser] = useState<UserType|null>(null);
  const [resultMessage, setResultMessage] = useState<string|null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user-storage");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.state.user);
    }
  }, []);

  const createTaskList = async (taskListName: string) => {
    const response = await fetch(`${BASE_URL}/groups/${groupID}/task_lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'uid': user?.uid || '',
        'client': user?.client || '',
        'access-token': user?.accessToken || '',
      },
      body: JSON.stringify({name: taskListName}),
    });

    if (!response.ok) {
      throw new Error('Failed to create task list');
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: createTaskList,
    onSuccess: (data) => {
      setResultMessage('Task list created successfully');
      onTaskListCreated();
      setTaskListName('');
      setTimeout(() => setResultMessage(null), 3000);
    },
    onError: (error) => {
      setResultMessage('Error creating task list');
      setTimeout(() => setResultMessage(null), 3000);
    },
  });

  const handleCreateTaskList = () => {
    if (taskListName) {
      mutation.mutate(taskListName);
    }
  };

  return (
    <div className="flex items-center justify-center m-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create Task List</h2>
        <input
          type="text"
          value={taskListName}
          onChange={(e) => setTaskListName(e.target.value)}
          className="border rounded-lg w-full px-4 py-2 mb-4"
        />
        <button
          onClick={handleCreateTaskList}
          className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
        >
          {mutation.isPending ? 'Creating...' : 'Create Task List'}
        </button>
        {resultMessage && (
          <p className="mt-4 text-center text-green-500">{resultMessage}</p>
        )}
        {mutation.isError && <p className="text-red-500 mt-4">Error creating task list</p>}
      </div>
    </div>
  );
}