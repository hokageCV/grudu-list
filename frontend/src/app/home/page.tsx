"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/context/authStore";
import Navbar from "@/components/Navbar";
import Home from "@/components/Home";

export default function Page() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const userData = localStorage.getItem("user-storage");
    if (!userData) {
      router.push("/");
      return;
    }
    const parsedUserData = JSON.parse(userData);
    if (!parsedUserData.state?.user?.email) {
      console.log("User email not found, redirecting to login...");
      router.push("/");
    }
  }, []);

  return (
    <div className="h-screen">
      <div className="sm:hidden">
        <Navbar />
        <Home />
      </div>
      <div className="hidden sm:flex h-full">
        <div className="w-1/6 h-full bg-secondary">
          <Navbar />
        </div>
        <div className="w-5/6 h-full overflow-y-auto">
          <Home />
        </div>
      </div>
    </div>
  );
}