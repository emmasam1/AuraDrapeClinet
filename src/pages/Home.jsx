import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Showcase from "../components/sections/Showcase";
import About from "../components/sections/About"
import Testimonials from "../components/sections/Testimonials";
import Statistics from "../components/sections/Statistics";
import Contact from "../components/sections/Contact";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <About />
      <Testimonials />
      <Statistics />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;