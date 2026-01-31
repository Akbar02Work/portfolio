import { Hero } from "@/components/sections/Hero";
import { TechStack } from "@/components/sections/TechStack";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Footer } from "@/components/sections/Footer";
import { BackToTop } from "@/components/BackToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950 text-gray-900 dark:text-slate-100 antialiased overflow-x-hidden font-sans transition-colors duration-300">
      <Hero />
      <TechStack />
      <About />
      <Projects />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;

