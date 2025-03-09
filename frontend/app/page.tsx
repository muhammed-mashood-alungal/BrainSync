import FeaturesShowcase from "@/Components/FeaturesShowcase/FeaturesShowcase";
import Footer from "@/Components/Footer/Footer";
import HomeBanner from "@/Components/HomeBanner/HomeBanner";
import Navbar from "@/Components/Navbar/Navbar";
import { cookies } from "next/headers";

export default function Home() {
  console.log(cookies)
  return (
  <>
    <Navbar/>
    <HomeBanner/>
    <FeaturesShowcase/>
    <Footer/>
  </>
  );
}
