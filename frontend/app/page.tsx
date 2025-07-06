import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import Footer from "@/components/layouts/footer/Footer";
import HomeBanner from "@/components/landing/HomeBanner";
import Navbar from "@/components/layouts/navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeBanner />
      <FeaturesShowcase />
      <Footer />
    </>
  );
}
