function CustomizationPanel() {
  return (
    <div className="space-y-8">

      <div>
        <h3 className="text-xl font-bold mb-4">
          Clothing Colors
        </h3>

        <div className="flex gap-4">
          {["bg-red-500","bg-blue-500","bg-green-500"].map((c,i)=>(
            <button
              key={i}
              className={`w-10 h-10 rounded-full ${c}`}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">
          Fabric Types
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {["Silk","Cotton","Leather","Denim"].map((f,i)=>(
            <button
              key={i}
              className="glass p-4 rounded-xl hover:bg-white/10"
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500">
        Save Design
      </button>

    </div>
  );
}

export default CustomizationPanel;