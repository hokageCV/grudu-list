'use client';
import React from 'react';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query'; 
import { useAuthStore } from '../context/authStore';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '../../constants';

const queryClient = new QueryClient();

export default function Navbar() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavbarContent />
    </QueryClientProvider>
  );
}

function NavbarContent() {
  const { setIsLoggedIn } = useAuthStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE_URL}/auth/sign_out`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Logout failed');
      }
    },
    onSuccess: () => {
      setIsLoggedIn(false);
      router.push('/');
    },
    onError: (error: any) => {
      console.error('Logout error:', error.message);
    },
  });

  const handleSignout = () => {
    mutation.mutate();
  };

  return (
    <div className="navbar bg-gray-500 text-white">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href='/home'>GRUDU LIST</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-2">
          <li><a>My Groups</a></li>
          <li>
            <details>
              <summary>More</summary>
              <ul className="bg-base-100 rounded-t-none p-2">
                <li><a>Profile</a></li>
                <li>
                  <a onClick={handleSignout} className="cursor-pointer">
                    Logout
                  </a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      {mutation.isPending && <p>Logging out...</p>}
      {mutation.isError && <p>Error: {mutation.error?.message}</p>}
    </div>
  );
}
