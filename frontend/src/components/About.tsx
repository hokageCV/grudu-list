import React from 'react'
import Link from 'next/link';

export default function About() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md text-primary">
          <h1 className="text-5xl font-bold">Welcome to GRUDU LIST</h1>
          <p className="py-6">
            Create custom groups, add your friends in it and create list of tasks.
          </p>
          <Link
            href="/auth/signup"
            className="btn bg-card text-primary hover:text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}