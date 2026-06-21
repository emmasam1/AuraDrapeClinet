import { useState } from "react";
import { motion } from "framer-motion";
import AuthModal from "../auth/AuthModal";

function Hero() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden px-6"
      >
        <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px]" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity:0, y:50 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:1 }}
          >
            <h1 className="text-6xl md:text-7xl font-black leading-tight">
              3D Fashion
              <span className="gradient-text block">
                Simulation Platform
              </span>
            </h1>

            <p className="mt-8 text-gray-300 text-lg">
              Design and implement immersive virtual clothing simulation
              for fashion designers using AI and 3D technologies.
            </p>

            <div className="flex gap-4 mt-10">
              <a href="#showcase">
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 glow cursor-pointer">
                Explore Now
              </button>
              </a>
              

              <button
                onClick={() => setAuthOpen(true)}
                className="px-8 py-4 rounded-full border border-white/20 cursor-pointer"
              >
                Get Started
              </button>
            </div>

            <div className="flex gap-12 mt-14">
              <div>
                <h2 className="text-4xl font-bold">10K+</h2>
                <p>3D Models</p>
              </div>

              <div>
                <h2 className="text-4xl font-bold">5K+</h2>
                <p>Designers</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y:[0,-20,0] }}
            transition={{ repeat:Infinity, duration:4 }}
            className="relative"
          >
            <img
              src="/hero.png"
              alt=""
              className="rounded-3xl shadow-2xl"
            />
          </motion.div>

        </div>
      </section>

      <AuthModal open={authOpen} setOpen={setAuthOpen} />
    </>
  );
}

export default Hero;