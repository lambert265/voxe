import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopClient from "./ShopClient";
import { slugToFilter } from "@/lib/products";

interface Props {
  params: { slug?: string[] };
}

export function generateMetadata({ params }: Props): Metadata {
  const { label } = slugToFilter(params.slug ?? []);
  return {
    title: `${label} — VOXE`,
    description: `Shop ${label} at VOXE. Gender-inclusive fashion for every story.`,
  };
}

export default function ShopPage({ params }: Props) {
  const slug = params.slug ?? [];
  return (
    <>
      <Navbar />
      <ShopClient slug={slug} />
      <Footer />
    </>
  );
}
