import type { Metadata } from "next";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track My Order",
  description: "Enter your order number to check the live status of your Banat Halima order.",
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
