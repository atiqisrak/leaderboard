import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { FeedReactionProvider } from "./context/FeedReactionContext";
import CookieConsent from "./components/CookieConsent";

const inter = localFont({
  src: "./fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
});

export const metadata = {
  title: "Life @ EtherTech",
  description:
    "A place for EtherTechers to share, connect, and celebrate daily life",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <FeedReactionProvider>
            {children}
          </FeedReactionProvider>
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
