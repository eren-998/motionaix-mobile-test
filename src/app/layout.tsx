import type { Metadata } from "next";
import { Sora, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MotionAIx - Precision Motion",
  description: "Transform ideas into high-end motion graphics instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${sora.variable} ${hankenGrotesk.variable} ${jetBrainsMono.variable} antialiased min-h-screen flex flex-col font-body selection:bg-primary-container selection:text-black`}
      >
        {/* Apple Liquid Glass SVG Filter */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id="apple-liquid-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feImage x="0" y="0" width="420" height="280" href="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22420%22%20height%3D%22280%22%20viewBox%3D%220%200%20420%20280%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22Y%22%20x1%3D%220%22%20x2%3D%220%22%20y1%3D%225%25%22%20y2%3D%2295%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230F0%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23000%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22X%22%20x1%3D%224%25%22%20x2%3D%2296%25%22%20y1%3D%220%22%20y2%3D%220%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F00%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23000%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22420%22%20height%3D%22280%22%20fill%3D%22%23808080%22%2F%3E%3Cg%20filter%3D%22blur(2px)%22%3E%3Crect%20width%3D%22420%22%20height%3D%22280%22%20fill%3D%22%23000080%22%2F%3E%3Crect%20width%3D%22420%22%20height%3D%22280%22%20fill%3D%22url(%23Y)%22%20style%3D%22mix-blend-mode%3Ascreen%22%2F%3E%3Crect%20width%3D%22420%22%20height%3D%22280%22%20fill%3D%22url(%23X)%22%20style%3D%22mix-blend-mode%3Ascreen%22%2F%3E%3Crect%20x%3D%2226%22%20y%3D%2226%22%20width%3D%22368%22%20height%3D%22228%22%20rx%3D%2266%22%20ry%3D%2266%22%20fill%3D%22%23808080%22%20filter%3D%22blur(26px)%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E" result="displacementMap" />
            <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="76" xChannelSelector="R" yChannelSelector="G" />
            <feColorMatrix type="matrix" result="displacedR" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
            <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="74" xChannelSelector="R" yChannelSelector="G" />
            <feColorMatrix type="matrix" result="displacedG" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
            <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="72" xChannelSelector="R" yChannelSelector="G" />
            <feColorMatrix type="matrix" result="displacedB" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
            <feBlend in="displacedR" in2="displacedG" mode="screen" result="rg" />
            <feBlend in="rg" in2="displacedB" mode="screen" />
          </filter>
        </svg>

        <Navbar />
        
        <main className="flex-grow flex flex-col items-center w-full relative z-10">
            {children}
        </main>

        <footer className="w-full pt-24 pb-12 bg-surface-container-lowest border-t border-outline-variant mt-32 relative z-20">
          <div className="flex flex-col md:flex-row justify-between items-center px-16 max-w-screen-2xl mx-auto gap-8">
            <div className="font-display text-3xl text-on-background font-extrabold tracking-tight">MotionAIx</div>
            <div className="flex flex-wrap justify-center gap-8">
              <a href="/templates" className="font-body text-on-surface-variant hover:text-primary-container transition-colors font-medium">Templates</a>
              <a href="#" className="font-body text-on-surface-variant hover:text-primary-container transition-colors font-medium">License</a>
              <a href="#" className="font-body text-on-surface-variant hover:text-primary-container transition-colors font-medium">API Docs</a>
              <a href="#" className="font-body text-on-surface-variant hover:text-primary-container transition-colors font-medium">Privacy</a>
            </div>
            <div className="font-body text-sm text-on-surface-variant font-medium">
                © 2026 MotionAIx.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
