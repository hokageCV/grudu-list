'use client';
import { useAuthStore } from '@/context/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Signout() {
  const { setIsLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch('http://127.0.0.1:3001/auth/sign_out', {
        method: 'POST',
        credentials: 'include',
      });

      setIsLoggedIn(false);
      router.push('/');
    };

    logout();
  }, [router, setIsLoggedIn]);

  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-4xl font-bold">Logging out...</h1>
    </div>
  );
}