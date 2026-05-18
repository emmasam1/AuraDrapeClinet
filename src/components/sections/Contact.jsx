import { motion } from "framer-motion";
import {
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiInstagramLine,
  RiTwitterXLine,
  RiLinkedinLine,
  RiSendPlaneFill,
  RiFacebookLine,
} from "react-icons/ri";

function Contact() {
  const socialIcons = [
    RiInstagramLine,
    RiTwitterXLine,
    RiLinkedinLine,
    RiFacebookLine,
  ];

  return (
    <section
      id="contact"
      className="relative py-32 px-6 overflow-hidden bg-black text-white"
    >
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/20 blur-[120px]" />
      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-purple-500/20 blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <p className="uppercase tracking-[6px] text-cyan-400 mb-4 font-semibold">
            Contact Us
          </p>

          <h2 className="text-5xl md:text-7xl font-black leading-tight">
            Let’s Build The Future Of
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Digital Fashion
            </span>
          </h2>

          <p className="max-w-3xl mx-auto mt-8 text-gray-300 text-lg leading-relaxed">
            Have questions, collaboration ideas, or feedback about the
            3D fashion simulation platform? Reach out to us and let’s
            create something futuristic together.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <h3 className="text-3xl font-bold mb-8">
              Send A Message
            </h3>

            <form className="space-y-6">
              {/* Name */}
              <div>
                <label className="block mb-3 text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-cyan-400 transition-all duration-300"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-3 text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-purple-400 transition-all duration-300"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block mb-3 text-gray-300">
                  Message
                </label>

                <textarea
                  rows="6"
                  placeholder="Write your message..."
                  className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-cyan-400 transition-all duration-300 resize-none"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all duration-300 font-semibold"
              >
                <RiSendPlaneFill size={22} />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="grid gap-6">
              {/* Email */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5 hover:border-cyan-400/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-2xl">
                  <RiMailLine />
                </div>

                <div>
                  <h4 className="text-xl font-bold">
                    Email Address
                  </h4>

                  <p className="text-gray-300">
                    auradrape@gmail.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5 hover:border-purple-400/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-2xl">
                  <RiPhoneLine />
                </div>

                <div>
                  <h4 className="text-xl font-bold">
                    Phone Number
                  </h4>

                  <p className="text-gray-300">
                    +234 800 000 0000
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5 hover:border-cyan-400/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-2xl">
                  <RiMapPinLine />
                </div>

                <div>
                  <h4 className="text-xl font-bold">
                    Office Location
                  </h4>

                  <p className="text-gray-300">
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Connect With Us
              </h3>

              <div className="flex gap-5">
                {socialIcons.map((Icon, index) => (
                  <button
                    key={index}
                    className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 flex items-center justify-center text-2xl hover:scale-110"
                  >
                    <Icon />
                  </button>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden h-[280px] relative">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b"
                alt="Map Placeholder"
                className="w-full h-full object-cover opacity-60"
              />

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <RiMapPinLine
                    size={42}
                    className="mx-auto text-cyan-400 mb-4"
                  />

                  <p className="text-2xl font-bold">
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;