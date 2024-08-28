"use client";

import { useEffect, useState } from "react";
import { GroupType } from "@/context/groupStore";

export default function AllGroups() {
  const [groups, setGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    const groupStorage = localStorage.getItem("group-storage");
    setGroups(groupStorage ? JSON.parse(groupStorage).state.groups : []);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Groups</h1>
      {
        groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              groups.map((group: GroupType) => (
                <div key={group.id} className="card bg-neutral text-neutral-content w-full shadow-xl">
                  <div className="card-body items-center text-center">
                    <h2 className="card-title">{group.name}</h2>
                    <p>Owner: {group.owner.name} (ID: {group.owner.id})</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary">View</button>
                      <button className="btn btn-backgroundOffset">Edit</button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        ) : (
          <p>No groups created</p>
        )
      }
    </div>
  );
}
