export default function Statistics() {
  const stats = [
    ["15K+", "3D Models"],
    ["8K+", "Users"],
    ["30K+", "Garments Simulated"],
    ["0.2s", "AI Processing"],
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">

        {stats.map((stat, i) => (
          <div key={i} className="glass p-8 rounded-3xl text-center">
            <h2 className="text-5xl font-bold gradient-text">
              {stat[0]}
            </h2>

            <p className="text-gray-400 mt-4">
              {stat[1]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}