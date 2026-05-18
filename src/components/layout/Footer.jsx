import { ArrowUp } from "lucide-react";

function Footer() {
    return (
        <footer className="border-t border-white/10 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                <div>
                    <div className="flex items-center gap-2">  <img src="/logo.jpg" alt="brand logo" className="w-10 h-10 rounded-full" />
                        <h2 className="text-2xl font-bold gradient-text">
                            AuraDrape
                        </h2> </div>


                    <p className="text-gray-400 mt-2">
                        DESIGN.SIMULATE.INSPIRE
                    </p>
                </div>

                <div className="flex gap-6">
                    <a href="#home">Home</a>
                    <a href="#features">Features</a>
                    <a href="#showcase">Showcase</a>
                    <a href="#about">About</a>
                    <a href="#statistics">Statistics</a>
                    <a href="#testimonial">Testimonial</a>
                    <a href="#contact">Contact</a>
                </div>

                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 rounded-full cursor-pointer"
                >
                    <ArrowUp />
                </button>
            </div>
        </footer>
    );
}

export default Footer