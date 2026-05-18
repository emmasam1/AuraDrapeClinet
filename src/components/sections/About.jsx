import { motion } from "framer-motion";
import {
  Sparkles,
  Cpu,
  Globe,
  Layers3,
  ShieldCheck,
  Box
} from "lucide-react";

const technologies = [
  {
    icon: Sparkles,
    title: "AI Integration",
    desc: "Smart fashion visualization and intelligent clothing recommendations."
  },
  {
    icon: Cpu,
    title: "React & Three.js",
    desc: "Interactive 3D rendering and smooth modern frontend architecture."
  },
  {
    icon: Globe,
    title: "WebGL Rendering",
    desc: "High-performance browser-based 3D graphics and animations."
  },
  {
    icon: Layers3,
    title: "Virtual Simulation",
    desc: "Real-time garment fitting and realistic fabric behavior simulation."
  },
  {
    icon: ShieldCheck,
    title: "Supabase/Firebase",
    desc: "Secure cloud backend and authentication management."
  },
  {
    icon: Box,
    title: "3D Modeling",
    desc: "Advanced digital avatar creation and virtual mannequin rendering."
  }
];

function About() {
  return (
    <section
      id="about"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-500/20 blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <p className="uppercase tracking-[6px] text-cyan-400 mb-4">
            About The Project
          </p>

          <h2 className="text-5xl md:text-6xl font-black leading-tight">
            Revolutionizing
            <span className="gradient-text block">
              Digital Fashion Design
            </span>
          </h2>

          <p className="max-w-3xl mx-auto mt-8 text-gray-300 text-lg leading-relaxed">
            This project focuses on the design and implementation of a
            futuristic 3D fashion modeling and virtual clothing simulation
            platform for fashion designers. It enables designers to create,
            customize, preview, and simulate garments digitally in real-time.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-3xl font-bold mb-6">
                Problems Solved
              </h3>

              <ul className="space-y-4 text-gray-300">
                <li>
                  • Reduces fabric waste through virtual prototyping
                </li>

                <li>
                  • Eliminates repeated physical sampling costs
                </li>

                <li>
                  • Improves garment fitting accuracy
                </li>

                <li>
                  • Accelerates fashion production workflows
                </li>

                <li>
                  • Enhances designer creativity using AI tools
                </li>
              </ul>
            </div>

            <div className="glass p-8 rounded-3xl">
              <h3 className="text-3xl font-bold mb-6">
                Benefits For Designers
              </h3>

              <p className="text-gray-300 leading-relaxed">
                Fashion designers can visualize garments instantly,
                simulate realistic fabrics, customize colors and textures,
                preview fittings on 3D avatars, and improve production
                efficiency using immersive digital technologies.
              </p>
            </div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid sm:grid-cols-2 gap-6">

              {technologies.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -10,
                    scale: 1.03
                  }}
                  className="glass rounded-3xl p-6 border border-white/10"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mb-6">
                    <item.icon size={28} />
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}

            </div>
          </motion.div>

        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8 mt-28"
        >

          {[
            { value: "10K+", label: "3D Garments" },
            { value: "5K+", label: "Fashion Designers" },
            { value: "99%", label: "Simulation Accuracy" },
            { value: "24/7", label: "Cloud Access" }
          ].map((item, index) => (
            <div
              key={index}
              className="glass rounded-3xl p-8 text-center"
            >
              <h2 className="text-5xl font-black gradient-text mb-4">
                {item.value}
              </h2>

              <p className="text-gray-300">
                {item.label}
              </p>
            </div>
          ))}

        </motion.div>

      </div>
    </section>
  );
}

export default About;