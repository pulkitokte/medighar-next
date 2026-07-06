import Hero from "@/features/home/components/Hero.jsx";
import HealthcareSystems from "@/features/home/components/HealthcareSystems.jsx";
import HowItWorks from "@/features/home/components/HowItWorks.jsx";
import WhyChooseMedighar from "@/features/home/components/WhyChooseMedighar.jsx";
import FeaturedServices from "@/features/home/components/FeaturedServices.jsx";
import Testimonials from "@/features/home/components/Testimonials.jsx";

function HomePage() {
  return (
    <>
      <Hero />
      <HealthcareSystems />
      <HowItWorks />
      <WhyChooseMedighar />
      <FeaturedServices />
      <Testimonials />
    </>
  );
}

export default HomePage;
