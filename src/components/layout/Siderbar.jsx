import {
  LayoutDashboard,
  Shirt,
  Users,
  Settings
} from "lucide-react";

function Sidebar() {
  return (
    <div className="hidden lg:flex flex-col w-[260px] glass p-6">

      <div className="text-3xl font-black gradient-text mb-12">
        AuraDrape
      </div>

      <div className="space-y-4">

        {[
          { icon: LayoutDashboard, name:"Dashboard" },
          { icon: Shirt, name:"Design Studio" },
          { icon: Users, name:"Avatars" },
          { icon: Settings, name:"Settings" },
        ].map((item,index) => (
          <button
            key={index}
            className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-white/10 transition"
          >
            <item.icon />
            {item.name}
          </button>
        ))}

      </div>
    </div>
  );
}

export default Sidebar;