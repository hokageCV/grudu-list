import AddMembers from '@/components/AddMembers'
import Navbar from '@/components/Navbar'
import React from 'react'

export default function Page() {
  return (
    <div className="h-screen">
      <div className="sm:hidden">
        <Navbar />
        <AddMembers />
      </div>
      <div className="hidden sm:flex h-full">
        <div className="w-1/6 h-full bg-secondary">
          <Navbar />
        </div>
        <div className="w-5/6 h-full overflow-y-auto">
          <AddMembers />
        </div>
      </div>
    </div>
  )
}
