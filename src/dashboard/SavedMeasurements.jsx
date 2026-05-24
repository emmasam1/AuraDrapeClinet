import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { FaEdit, FaTrash } from "react-icons/fa";

const SavedMeasurements = () => {
  const { getDesigns, deleteDesign } = useApp?.() ?? {};

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Move load function outside or handle it directly inside useEffect to isolate execution
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getDesigns?.();
        setDesigns(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load designs:", err);
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 FIX: Empty dependency array guarantees this only fires ONCE on load, stopping the flashing loop!

  // Handle deleting an item specification securely
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this saved configuration?")) return;
    try {
      if (deleteDesign) {
        await deleteDesign(id);
        // Refresh local state arrays instantly
        setDesigns((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete design card:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Saved Measurements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage all your saved garment designs.
          </p>
        </div>

        {/* LOADING & CONDITIONAL RENDERING GRID */}
        {loading ? (
          <div className="text-sm text-slate-500 mb-4 animate-pulse">
            Loading designs...
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
            <span className="text-4xl block mb-3">📐</span>
            <h3 className="font-semibold text-slate-700 text-base">No designs found</h3>
            <p className="text-xs text-slate-400 mt-1">Head over to the studio workbench to configure your first garment layout.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {designs.map(({ _id, fabric, gender, color, measurements }) => (
              <div
                key={_id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* TOP HEADER */}
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    {/* COLOR + INFO */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full border border-slate-200 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <div>
                        <h2 className="font-bold text-base capitalize">
                          {fabric}
                        </h2>
                        <p className="text-xs text-slate-400 capitalize">
                          {gender}
                        </p>
                      </div>
                    </div>

                    {/* BADGE */}
                    <span className="text-[10px] px-2 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-600 uppercase tracking-wider">
                      Saved
                    </span>
                  </div>

                  {/* BODY STYLE TAG */}
                  <div className="mt-3 text-xs text-slate-500 bg-slate-50 border border-slate-100 p-2 rounded-lg flex justify-between items-center">
                    <span>Custom Tailored Fit</span>
                    <span className="text-lg">👕</span>
                  </div>
                </div>

                {/* MEASUREMENTS LIST */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(measurements || {}).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-slate-50 border border-slate-100 rounded-lg p-2"
                      >
                        <p className="text-[10px] uppercase text-slate-400">
                          {key}
                        </p>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {value}
                          <span className="text-[10px] font-normal text-slate-400 ml-1">
                            in
                          </span>
                        </h4>
                      </div>
                    ))}
                  </div>

                  {/* ACTION CLICKS CONTROL LAYER */}
                  <div className="flex gap-2 mt-5">
                    {/* EDIT ACTIONS */}
                    <button 
                      onClick={() => alert(`Redirecting edit mode workflow for ID: ${_id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                    >
                      <FaEdit />
                      Edit
                    </button>

                    {/* DELETE ACTIONS */}
                    <button 
                      onClick={() => handleDelete(_id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
};

export default SavedMeasurements;