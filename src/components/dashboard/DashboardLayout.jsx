import { useState } from "react";
import Sidebar from "../layout/Siderbar";
import DashboardHeader from "./DashboardHeader";
import ModelViewer from "./ModalViewer";
import CustomizationPanel from "./CustomizationPanel";

function DashboardLayout() {
  const [design, setDesign] = useState({
    color: "#8b5cf6",
    fabric: "Cotton",
    gender: "male",
    measurements: {
      chest: "",
      waist: "",
      length: "",
      sleeve: "",
    },
  });

  return (
    <div className="min-h-screen flex bg-[#050816] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="flex flex-col lg:flex-row flex-1 gap-5 p-5">
          <div className="flex-1 glass rounded-3xl overflow-hidden">
             <ModelViewer design={design} />
          </div>

          <div className="w-full lg:w-[350px] glass rounded-3xl p-5">
            <CustomizationPanel design={design} setDesign={setDesign} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
