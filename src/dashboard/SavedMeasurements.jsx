import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { FaEdit, FaTrash, FaDownload, FaUser, FaPhoneAlt } from "react-icons/fa";
// 1. Correct Import Strategy for jsPDF + AutoTable
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const SavedMeasurements = () => {
  const { getDesigns, deleteDesign } = useApp?.() ?? {};

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  // Track which specific card is generating a PDF to show a localized spinner
  const [pdfGeneratingId, setPdfGeneratingId] = useState(null);

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
  }, []); 

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this saved configuration?")) return;
    try {
      if (deleteDesign) {
        await deleteDesign(id);
        setDesigns((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete design card:", err);
    }
  };

  // 2. Fixed PDF Generator Function with Customer Info and Preview Image
  const exportToPDF = async (design) => {
    setPdfGeneratingId(design._id);
    
    // Slight timeout gives the UI room to register the loading spinner state cleanly
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const { customerName, customerPhone, fabric, gender, color, measurements, previewImage } = design;
      
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Top Header Banner
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 40, "F");

      // Title Text
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("GARMENT SPECIFICATION SHEET", 15, 25);

      // 📸 INTEGRATE IMAGE INTO PDF (Placed elegantly on the upper right-side metadata area)
      if (previewImage) {
        try {
          // Parameters: imageString, format, x, y, width, height, alias, compression
          doc.addImage(previewImage, "PNG", 155, 48, 40, 32, undefined, "FAST");
        } catch (imgError) {
          console.error("Failed to add garment image snapshot to PDF generation layer:", imgError);
        }
      }

      // Metadata Profile Info: Customer Section
      doc.setTextColor(15, 23, 42); 
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Customer Information:", 15, 52);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(`Name: ${customerName || "N/A"}`, 15, 60);
      doc.text(`Phone: ${customerPhone || "N/A"}`, 15, 67);

      // Metadata Profile Info: Garment Section
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Garment Details:", 90, 52);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(`Fabric Style: ${(fabric || "N/A").toUpperCase()}`, 90, 60);
      doc.text(`Target Gender: ${(gender || "N/A").toUpperCase()}`, 90, 67);
      doc.text(`Color Code: ${color || "N/A"}`, 90, 74);

      // Accent Split Rule
      doc.setDrawColor(226, 232, 240); 
      doc.line(15, 84, 195, 84);

      // Subheading
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Measurement Specifications (Inches):", 15, 94);

      const tableRows = Object.entries(measurements || {}).map(([key, value]) => [
        key.replace(/([A-Z])/g, ' $1').toUpperCase(), 
        `${value} in`
      ]);

      // Using explicitly imported autoTable function directly
      autoTable(doc, {
        startY: 99,
        head: [["Specification Point", "Dimension Value"]],
        body: tableRows,
        theme: "striped",
        headStyles: { fillColor: [15, 23, 42], fontStyle: "bold" },
        styles: { fontSize: 10, cellPadding: 4 },
        margin: { left: 15, right: 15 }
      });

      // Saves PDF dynamic file formatting using customer name
      const safeFileName = (customerName || fabric || "Design").toLowerCase().replace(/\s+/g, "_");
      doc.save(`Measurement_${safeFileName}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setPdfGeneratingId(null);
    }
  };

  return (
    <div className="min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Saved Measurements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage all your saved garment designs and customer data profiles.
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
            {designs.map((design) => {
              const { _id, customerName, customerPhone, fabric, gender, color, measurements, previewImage } = design;
              const isPdfLoading = pdfGeneratingId === _id;

              return (
                <div
                  key={_id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* TOP HEADER */}
                    <div className="p-4 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-full">
                          
                          {/* 🎨 NEW: REPLACED COLOR CIRCLE WITH ACTUAL THUMBNAIL IMAGE RENDERING */}
                          <div className="w-15 h-15  overflow-hidden flex items-center justify-center ">
                            {previewImage ? (
                              <img 
                                src={previewImage} 
                                alt="Garment Preview" 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-lg">👕</span>
                            )}
                          </div>

                          <div className="truncate flex-1">
                            <h2 className="font-bold text-base capitalize truncate">
                              {fabric}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <p className="text-xs text-slate-400 capitalize">
                                {gender}
                              </p>
                              <span className="text-[10px] text-slate-300">•</span>
                              {/* Inline mini color chip representation text link overlay */}
                              <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                                {color}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-600 uppercase tracking-wider h-fit self-start flex-shrink-0">
                          Saved
                        </span>
                      </div>

                      {/* CUSTOMER IDENTIFICATION CARD STRIP */}
                      <div className="mt-3 text-xs bg-slate-50 border border-slate-100 p-2.5 rounded-xl space-y-1">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold truncate">
                          <FaUser className="text-slate-400 text-[10px]" />
                          <span>{customerName || "Unknown Customer"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <FaPhoneAlt className="text-slate-400 text-[9px]" />
                          <span>{customerPhone || "No Phone Registered"}</span>
                        </div>
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
                            <p className="text-[10px] uppercase text-slate-400 truncate">
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
                    </div>
                  </div>

                  {/* ACTION CLICKS CONTROL LAYER - ALL SINGLE LINE */}
                  <div className="p-4 pt-0 mt-auto">
                    <div className="flex gap-2">
                      
                      {/* DOWNLOAD/EXPORT BUTTON */}
                      <button
                        onClick={() => exportToPDF(design)}
                        disabled={isPdfLoading}
                        title="Download PDF Specification"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:bg-emerald-400 transition shadow-sm min-w-[40px]"
                      >
                        {isPdfLoading ? (
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <>
                            <FaDownload className="text-[11px]" />
                            <span>PDF</span>
                          </>
                        )}
                      </button>

                      {/* EDIT ACTION */}
                      <button 
                        onClick={() => alert(`Redirecting edit mode workflow for ID: ${_id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>

                      {/* DELETE ACTION */}
                      <button 
                        onClick={() => handleDelete(_id)}
                        title="Delete Card"
                        className="flex items-center justify-center px-3 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                      >
                        <FaTrash />
                      </button>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
        
      </div>
    </div>
  );
};

export default SavedMeasurements;