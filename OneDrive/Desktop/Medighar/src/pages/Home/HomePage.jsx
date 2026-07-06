import Hero from "@/features/home/components/Hero.jsx";
import HealthcareSystems from "@/features/home/components/HealthcareSystems.jsx";
import HowItWorks from "@/features/home/components/HowItWorks.jsx";
import WhyChooseMedighar from "@/features/home/components/WhyChooseMedighar.jsx";
import FeaturedServices from "@/features/home/components/FeaturedServices.jsx";
import Testimonials from "@/features/home/components/Testimonials.jsx";
import FAQ from "@/features/home/components/FAQ.jsx";
import CTA from "@/features/home/components/CTA.jsx";
import Footer from "@/features/home/components/Footer.jsx";

function HomePage() {
  return (
    <>
      <Hero />
      <HealthcareSystems />
      <HowItWorks />
      <WhyChooseMedighar />
      <FeaturedServices />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}

export default HomePage;
