import {
  Shirt,
  Sparkles,
  Cpu,
  Layers3
} from "lucide-react";

const features = [
  {
    icon: Shirt,
    title: "3D Body Modeling",
    desc: "Create realistic human models."
  },
  {
    icon: Sparkles,
    title: "AI Visualization",
    desc: "AI powered design rendering."
  },
  {
    icon: Cpu,
    title: "Garment Simulation",
    desc: "Real-time cloth interaction."
  },
  {
    icon: Layers3,
    title: "Fabric Rendering",
    desc: "Advanced material system."
  }
];

function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center mb-20">
          Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item,index) => (
            <div
              key={index}
              className="glass p-8 rounded-3xl hover:-translate-y-3 transition"
            >
              <item.icon className="text-cyan-400 mb-6" size={42} />

              <h3 className="text-2xl font-bold mb-4">
                {item.title}
              </h3>

              <p className="text-gray-300">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Features;