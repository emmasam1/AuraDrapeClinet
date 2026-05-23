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
  const { createDesign, updateDesign } = useApp();

  const colors = ["#ef4444", "#3b82f6", "#22c55e", "#8b5cf6"];
  const fabrics = ["Silk", "Cotton", "Leather", "Denim"];

  /* =========================
     SAFE UPDATE
  ========================= */
  const update = (key, value) => {
    setDesign((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* =========================
     MEASUREMENTS UPDATE
  ========================= */
  const handleMeasurement = (e) => {
    const { name, value } = e.target;

    setDesign((prev) => ({
      ...prev,
      measurements: {
        ...(prev.measurements || {}),
        [name]: value,
      },
    }));
  };

  /* =========================
     SAVE
  ========================= */
  const handleSaveDesign = async () => {
    try {
      setLoading(true);

      if (editingId) {
        await updateDesign(editingId, design);
        setEditingId(null);
      } else {
        await createDesign(design);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI HELPERS (ACTIVE STYLE)
  ========================= */
  const isActive = (a, b) =>
    a === b ? "ring-2 ring-white scale-105" : "opacity-60";

  return (
    <>
      <div className="space-y-6 text-white">

        {/* ================= COLORS ================= */}
        <div>
          <h3 className="text-lg font-bold mb-3">Color</h3>

          <div className="flex gap-3">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => update("color", c)}
                className={`w-8 h-8 rounded-full transition-all duration-200 ${isActive(
                  design.color,
                  c
                )}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* ================= FABRIC ================= */}
        <div>
          <h3 className="text-lg font-bold mb-3">Fabric</h3>

          <div className="grid grid-cols-2 gap-3">
            {fabrics.map((f) => (
              <button
                key={f}
                onClick={() => update("fabric", f)}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  design.fabric === f
                    ? "bg-white/20 border-white scale-105"
                    : "bg-white/5 border-transparent opacity-60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ================= GENDER ================= */}
        <div>
          <h3 className="text-lg font-bold mb-3">Avatar</h3>

          <div className="flex gap-3">
            {["male", "female"].map((g) => (
              <button
                key={g}
                onClick={() => update("gender", g)}
                className={`flex-1 p-3 rounded-xl border transition-all duration-200 ${
                  design.gender === g
                    ? "bg-white/20 border-white scale-105"
                    : "bg-white/5 border-transparent opacity-60"
                }`}
              >
                {g.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ================= MEASUREMENTS ================= */}
        <div>
          <h3 className="text-lg font-bold mb-3">Measurements</h3>

          <div className="grid grid-cols-2 gap-3">
            {["chest", "waist", "length", "sleeve"].map((m) => (
              <input
                key={m}
                type="number"
                name={m}
                placeholder={m}
                value={design.measurements?.[m] || ""}
                onChange={handleMeasurement}
                className="p-2 rounded-lg bg-white/10 border border-white/10 text-sm outline-none focus:border-white/40"
              />
            ))}
          </div>
        </div>

        {/* ================= SAVE BUTTON ================= */}
        <button
          onClick={handleSaveDesign}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            loading
              ? "opacity-50"
              : "bg-gradient-to-r from-purple-500 to-cyan-500 hover:scale-[1.02]"
          }`}
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Design"
            : "Save Design"}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default CustomizationPanel;