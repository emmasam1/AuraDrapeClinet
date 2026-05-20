import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";

function DesignManager({
  setDesign,
  setEditingId,
}) {
  const {
    designs,
    getDesigns,
    deleteDesign,
  } = useApp();

  const [loadingId, setLoadingId] =
    useState(null);

  /* ===============================
     LOAD DESIGNS ON MOUNT
  =============================== */
  useEffect(() => {
    getDesigns();
  }, []);

  /* ===============================
     EDIT DESIGN
  =============================== */
  const handleEdit = (item) => {
    setDesign(item);
    setEditingId(item._id);
  };

  /* ===============================
     DELETE DESIGN
  =============================== */
  const handleDelete = async (id) => {
    try {
      setLoadingId(id);

      await deleteDesign(id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <h2 className="text-xl font-bold">
        Saved Designs
      </h2>

      {/* LIST */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {designs?.length === 0 && (
          <p className="text-gray-400 text-sm">
            No designs found
          </p>
        )}

        {designs?.map((item) => (
          <div
            key={item._id}
            className="p-4 rounded-xl bg-white/10 border border-white/10"
          >
            {/* TOP INFO */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">
                  {item.fabric}
                </p>

                <p className="text-sm text-gray-400">
                  {item.gender}
                </p>
              </div>

              {/* COLOR PREVIEW */}
              <div
                className="w-5 h-5 rounded-full"
                style={{
                  background: item.color,
                }}
              />
            </div>

            {/* MEASUREMENTS */}
            <div className="text-xs text-gray-400 mt-2">
              Chest: {item.measurements?.chest} •
              Waist: {item.measurements?.waist} •
              Sleeve:{" "}
              {item.measurements?.sleeve}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 py-1 rounded bg-blue-500 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(item._id)
                }
                disabled={loadingId === item._id}
                className="flex-1 py-1 rounded bg-red-500 text-sm disabled:opacity-50"
              >
                {loadingId === item._id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DesignManager;