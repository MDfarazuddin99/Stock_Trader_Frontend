import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { AI } from "./actions";
import { ThemeProvider } from "next-themes";
export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-rsc-genui.vercel.dev"),
  title: "Generative User Interfaces Preview",
  description: "Generative UI with React Server Components and Vercel AI SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AI>{children}</AI>
        </ThemeProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
