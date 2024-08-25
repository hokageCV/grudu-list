'use client';
import { useAuthStore, useUserStore } from '../context/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation
} from '@tanstack/react-query';
import { BASE_URL } from '../../constants';

const queryClient = new QueryClient();

export default function Signup() {
  return (
    <QueryClientProvider client={queryClient}>
      <SignupForm />
    </QueryClientProvider>
  );
}

function SignupForm() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUser = useUserStore((state) => state.setUser);

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (formData: { name: string; email: string; password: string }) => {
      const res = await fetch(`${BASE_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Signup failed');
      }

      const headers = res.headers;
      const client = headers.get('client') || '';
      const accessToken = headers.get('access-token') || '';
      const uid = headers.get('uid') || '';
      const data = await res.json();

      return { data, client, accessToken, uid };
    },
    onSuccess: ({ data, client, accessToken, uid }) => {
      setIsLoggedIn(true);
      setUser({
        name: data.data.name || 'Unknown',
        email: formData.email,
        id: data.data.id || 'Unknown',
        uid,
        client,
        accessToken,
      });
      router.push('/home');
    },
  });

  const create = async (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <section className="h-screen flex flex-col justify-center items-center bg-background">
      {mutation.isError && <p className="text-red-600 mb-4">Signup failed</p>}
      <form onSubmit={create} className="flex flex-col items-center gap-4">
        <label className="input input-bordered flex items-center gap-2">
          <UsernameInputIcon />
          <input
            type="text"
            className="grow"
            placeholder="Username"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prevFormData) => ({ ...prevFormData, name: e.target.value }))
            }
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <EmailInputIcon />
          <input
            type="text"
            className="grow"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((prevFormData) => ({ ...prevFormData, email: e.target.value }))
            }
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <PasswordInputIcon />
          <input
            type="password"
            className="grow"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData((prevFormData) => ({ ...prevFormData, password: e.target.value }))
            }
          />
        </label>

        <button type="submit" className="btn">
          Signup
        </button>
        {mutation.isPending && <span className="loading loading-spinner"></span>}
      </form>
      <div className="divider w-36 mx-auto"></div>
      <div className="h-20 card rounded-box place-items-center">
        <p className="mt-2 text-center text-gray-600">
          Already have an account?&nbsp;
          <Link
            href="/auth/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

const UsernameInputIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="w-4 h-4 opacity-70"
  >
    <path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6 6c0-2.667-4-4-6-4s-6 1.333-6 4v1h12v-1Z" />
  </svg>
);

const EmailInputIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="w-4 h-4 opacity-70"
  >
    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
  </svg>
);

const PasswordInputIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="w-4 h-4 opacity-70"
  >
    <path
      fillRule="evenodd"
      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
      clipRule="evenodd"
    />
  </svg>
);
