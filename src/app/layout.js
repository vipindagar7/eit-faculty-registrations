import { DM_Sans, JetBrains_Mono, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const display = Sora({ variable: "--font-display", subsets: ["latin"], weight: ["600", "700", "800"] });
const body = DM_Sans({ variable: "--font-body", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["500", "700"] });

export const metadata = {
  title: "Faculty Registration | Brainstorm & Science Exhibition – EIT Faridabad",
  description:
    "Faculty & school registration for the Brainstorm & Science Exhibition and career guidance outreach by Echelon Institute of Technology, Faridabad.",
};

export const viewport = {
  themeColor: "#0b0e24",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
