import { useState } from "react";
import { useApp } from "../../context/AppContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CustomizationPanel({
  design,
  setDesign,
  editingId,
  setEditingId,
}) {
  const [loading, setLoading] = useState(false);

  const { createDesign, updateDesign } =
    useApp();

  const colors = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#8b5cf6",
  ];

  const fabrics = [
    "Silk",
    "Cotton",
    "Leather",
    "Denim",
  ];

  /* ===============================
     HANDLE MEASUREMENTS
  =============================== */
  const handleMeasurement = (e) => {
    const { name, value } = e.target;

    setDesign((prev) => ({
      ...prev,

      measurements: {
        ...prev.measurements,

        [name]: value,
      },
    }));
  };

  /* ===============================
     SAVE / UPDATE DESIGN
  =============================== */
  const handleSaveDesign = async () => {
    try {
      setLoading(true);

      /* UPDATE */
      if (editingId) {
        await updateDesign(editingId, design);

        setEditingId(null);
      }

      /* CREATE */
      else {
        await createDesign(design);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* COLORS */}
        <div>
          <h3 className="text-lg font-bold mb-3">
            Color
          </h3>

          <div className="flex gap-3">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() =>
                  setDesign((p) => ({
                    ...p,
                    color: c,
                  }))
                }
                className="w-8 h-8 rounded-full"
                style={{
                  backgroundColor: c,
                  border:
                    design.color === c
                      ? "2px solid white"
                      : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* FABRICS */}
        <div>
          <h3 className="text-lg font-bold mb-3">
            Fabric
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {fabrics.map((f) => (
              <button
                key={f}
                onClick={() =>
                  setDesign((p) => ({
                    ...p,
                    fabric: f,
                  }))
                }
                className={`p-3 rounded-xl glass ${
                  design.fabric === f
                    ? "bg-white/20"
                    : ""
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* GENDER */}
        <div>
          <h3 className="text-lg font-bold mb-3">
            Avatar
          </h3>

          <div className="flex gap-3">
            {["male", "female"].map((g) => (
              <button
                key={g}
                onClick={() =>
                  setDesign((p) => ({
                    ...p,
                    gender: g,
                  }))
                }
                className={`flex-1 p-3 rounded-xl glass ${
                  design.gender === g
                    ? "bg-white/20"
                    : ""
                }`}
              >
                {g.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* MEASUREMENTS */}
        <div>
          <h3 className="text-lg font-bold mb-3">
            Measurements
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {[
              "chest",
              "waist",
              "length",
              "sleeve",
            ].map((m) => (
              <input
                key={m}
                type="number"
                name={m}
                placeholder={m}
                value={
                  design.measurements[m]
                }
                onChange={handleMeasurement}
                className="p-2 rounded-lg bg-white/10 text-sm outline-none"
              />
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSaveDesign}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Design"
            : "Save Design"}
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />
    </>
  );
}

export default CustomizationPanel;