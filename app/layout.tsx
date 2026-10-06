import { AgenticFrame } from "app/forty/AgenticFrame";
import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { GeistSans } from "geist/font/sans";
import { getCart } from "lib/shopify";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  const page = (
    <>
      <Navbar />
      <main>
        {children}
        <Toaster closeButton />
        <WelcomeToast />
      </main>
    </>
  );
  // The agentic build puts the 40rty spacefront on every page.
  const agentic = process.env.FORTY_AGENTIC === "1";

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <CartProvider cartPromise={cart}>
          {agentic ? <AgenticFrame>{page}</AgenticFrame> : page}
        </CartProvider>
      </body>
    </html>
  );
}
