import FeaturesShowcase from "@/Components/FeaturesShowcase/FeaturesShowcase";
import Footer from "@/Components/Footer/Footer";
import HomeBanner from "@/Components/HomeBanner/HomeBanner";
import { cookies } from "next/headers";

export default function Home() {
  console.log(cookies)
  return (
  <>
  
    <HomeBanner/>
    <FeaturesShowcase/>
    <Footer/>
  </>
  );
}
