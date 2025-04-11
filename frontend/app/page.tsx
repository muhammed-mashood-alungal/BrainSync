import FeaturesShowcase from "@/Components/FeaturesShowcase/FeaturesShowcase";
import Footer from "@/Components/Footer/Footer";
import HomeBanner from "@/Components/HomeBanner/HomeBanner";
import Navbar from "@/Components/Navbar/Navbar";
import Head from "next/head";




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
