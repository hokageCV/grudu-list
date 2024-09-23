import AllTaskLists from "@/app/group/[...groupID]/AllTaskLists"

export default function page() {
  return (
    <div className="h-screen">
      <AllTaskLists/>
    </div>
  );
}