import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import FeaturedPolicies from "../components/sections/FeaturedPolicies";
import ContactStrip from "../components/sections/ContactStrip";

export default function Home() {
  return (
    <div className="page-enter">
      <Hero />
      <About />
      <FeaturedPolicies />
      <ContactStrip />
    </div>
  );
}
