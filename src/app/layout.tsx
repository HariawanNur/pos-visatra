import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VISTARA POS | PT Vistara Teknologi Indonesia",
  description: "Universal Omni-Industry Point of Sale Engine by PT VISTARA TEKNOLOGI INDONESIA. Supporting Retail, F&B, Services, and Wholesale.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-900 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
