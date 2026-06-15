import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Hello Universe – Hardware-Agnostic RobOps & Fleet Management",
  description:
    "India's leading B2B2B SaaS platform for Robot Operations and Fleet Management. Empower your autonomous systems with enterprise-grade telemetry, compliance, and interoperability.",
  keywords: "RobOps, Fleet Management, Drone Software, UAV, AMR, India, SaaS, Autonomous Systems",
  openGraph: {
    title: "Hello Universe – Hardware-Agnostic RobOps & Fleet Management",
    description: "Powering India's autonomous future. Enterprise fleet management for UAVs, AMRs and beyond.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
