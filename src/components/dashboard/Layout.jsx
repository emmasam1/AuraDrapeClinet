import { Outlet } from "react-router-dom";
import Sidebar from "../layout/Siderbar";
import DashboardHeader from "./DashboardHeader";

function Layout() {
  return (
    <div className="min-h-screen flex bg-[#050816] text-white">
      {/* SIDEBAR (ALWAYS VISIBLE) */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER (ALWAYS VISIBLE) */}
        <DashboardHeader />

        {/* PAGE CONTENT CHANGES HERE */}
        <div className="flex-1 overflow-auto p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;