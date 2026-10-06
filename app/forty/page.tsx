import Footer from "components/layout/footer";
import { notFound } from "next/navigation";

import { AgenticPage } from "./AgenticPage";

export const metadata = {
  description: "Ask the store — a page composed for you as you ask.",
};

/**
 * The agentic webpage. It is not a page of the store: only the agentic
 * deployment (built with `FORTY_AGENTIC=1`) serves it, at `/` through the
 * rewrite in `next.config.ts`. The store's own build answers `/forty` with a
 * 404, so it adds no URL to the store.
 *
 * `FORTY_DEV_TOKEN` is the developer's preview credential, written to `.env`
 * by `forty dev`. It is read here on the server and handed down; it is absent
 * in production, where the space renders what it has published.
 */
export default function FortyPage() {
  if (process.env.FORTY_AGENTIC !== "1") notFound();
  return (
    <>
      <AgenticPage token={process.env.FORTY_DEV_TOKEN} />
      <Footer />
    </>
  );
}
