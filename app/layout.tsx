import { inter } from "@/app/ui/fonts";
import "@/app/ui/global.css";
import { Lusitana } from "next/font/google";

const lusitana = Lusitana({
  subsets: ["latin"],
  variable: "--font-lusitana",
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${lusitana.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
