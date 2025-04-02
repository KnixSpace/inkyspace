import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

const caveat = Caveat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InkySpace",
  description: "A powerful blogging and newsletter app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
        <body className={`${caveat.className} antialiased`}>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </body>
      </StoreProvider>
    </html>
  );
}
