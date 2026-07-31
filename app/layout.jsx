import "./globals.css";

export const metadata = {
  title: "SellNautix | Amazon Growth & Marketplace Operations",
  description: "SellNautix helps brands grow on Amazon with intelligent account management, advertising, listing optimization, compliance, and practical seller training.",
  keywords: ["Amazon account management", "Amazon PPC", "Amazon listing optimization", "Amazon consultant India", "Amazon seller training", "Seller Central"],
  openGraph: {
    title: "SellNautix | Amazon Growth, Under Intelligent Control",
    description: "Practical Amazon strategy, hands-on execution, and seller training since 2017.",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
