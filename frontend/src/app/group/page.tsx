import AllGroups from "@/components/AllGroups"
import Navbar from "@/components/Navbar"

export default function page() {
  return (
    <div className="h-screen">
      <div className="sm:hidden">
        <Navbar />
        <AllGroups />
      </div>
      <div className="hidden sm:flex h-full">
        <div className="w-1/6 h-full bg-secondary">
          <Navbar />
        </div>
        <div className="w-5/6 h-full overflow-y-auto">
          <AllGroups />
        </div>
      </div>
    </div>
  );
  
}