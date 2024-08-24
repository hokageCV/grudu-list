"use client"

import { useUserStore } from '@/context/authStore';
import React from 'react';

export default function Home() {

  const {user} = useUserStore();

  return (
    <div className="h-[90vh] flex justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-700">Welcome {user.name}</h1>
    </div>
  );
}