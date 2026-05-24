import React from 'react';

const SavedMeasurements = () => {
  const measurements = [
    {
      id: 1,
      gender: "male",
      fabric: "Cotton",
      color: "#3b82f6",
      measurements: { chest: 42, waist: 34, length: 30, sleeve: 24 },
    },
    {
      id: 2,
      gender: "female",
      fabric: "Silk",
      color: "#ec4899",
      measurements: { chest: 36, waist: 28, length: 27, sleeve: 22 },
    },
    {
      id: 3,
      gender: "male",
      fabric: "Denim",
      color: "#22c55e",
      measurements: { chest: 44, waist: 36, length: 32, sleeve: 25 },
    },
  ];

  return (
    <div className="min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            Saved Measurements
          </h1>
          <p className="text-sm text-slate-500">
            View and manage saved body measurements.
          </p>
        </div>

        {/* GRID - Set to 4 columns on extra large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {measurements.map(({ id, fabric, gender, color, measurements: stats }) => (
            <div
              key={id}
              className="border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-400"
            >
              {/* TOP SECTION */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  {/* COLOR + FABRIC */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 border border-slate-200 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <h2 className="font-bold text-base text-slate-800 leading-tight">
                        {fabric}
                      </h2>
                      <p className="text-xs text-slate-400 capitalize">
                        {gender}
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider border border-slate-200">
                    Saved
                  </div>
                </div>

                {/* BODY TYPE */}
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2 text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                      Body Fit
                    </p>
                    <h3 className="font-semibold text-slate-700">
                      Custom Tailored
                    </h3>
                  </div>
                  <div className="text-xl">👕</div>
                </div>
              </div>

              {/* MEASUREMENTS GRID */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(stats).map(([key, value]) => (
                    <div
                      key={key}
                      className="border border-slate-100 bg-slate-50/50 p-2.5"
                    >
                      <p className="text-[10px] uppercase tracking-wider font-medium text-slate-400 mb-0.5">
                        {key}
                      </p>
                      <h4 className="text-base font-bold text-slate-800">
                        {value}
                        <span className="text-xs font-normal text-slate-400 ml-0.5">
                          in
                        </span>
                      </h4>
                    </div>
                  ))}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all uppercase tracking-wide text-xs">
                    Load Design
                  </button>
                  <button className="px-3 border border-red-200 text-red-600 hover:bg-red-50 transition-all uppercase tracking-wide text-xs font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SavedMeasurements;