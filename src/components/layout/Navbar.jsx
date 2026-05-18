import { useState } from "react";
import { Link } from "react-scroll";
import { Menu, X, Search } from "lucide-react";
import AuthModal from "../auth/AuthModal";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="text-2xl font-bold gradient-text">
            AuraDrape
          </div>

          <div className="hidden md:flex items-center gap-4 glass px-4 py-2 rounded-full">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none"
            />
          </div>

          <div className="hidden md:flex gap-8">
            {["home","features","showcase","about","contact"].map((item) => (
              <Link
                key={item}
                to={item}
                smooth
                duration={500}
                className="cursor-pointer hover:text-cyan-400 transition"
              >
                {item}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setAuthOpen(true)}
            className="hidden md:block px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:scale-105 transition"
          >
            Sign Up
          </button>

          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="md:hidden glass p-5 flex flex-col gap-4">
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-purple-600 px-4 py-2 rounded-xl"
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>

      <AuthModal open={authOpen} setOpen={setAuthOpen} />
    </>
  );
}

export default Navbar;