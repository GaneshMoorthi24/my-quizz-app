import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "AI Quiz Platform",
  description: "AI-powered UPSC quiz platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
