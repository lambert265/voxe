import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArrivals";
import FeaturedCollection from "@/components/FeaturedCollection";
import Trending from "@/components/Trending";
import BrandValues from "@/components/BrandValues";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <NewArrivals />
        <FeaturedCollection />
        <Trending />
        <BrandValues />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
