import Footer from "components/layout/footer";
import { notFound } from "next/navigation";

import { CanvasSlot } from "./canvas-slot";

export const metadata = {
  description: "Ask the store — a page composed for you as you ask.",
};

/**
 * The agentic webpage. It is not a page of the store: only the agentic
 * deployment (built with `FORTY_AGENTIC=1`) serves it, at `/` through the
 * rewrite in `next.config.ts`. The store's own build answers `/forty` with a
 * 404, so it adds no URL to the store.
 *
 * The spacefront itself lives in the root layout (`FortySpacefront`); this
 * page only says where its canvas goes.
 */
export default function FortyPage() {
  if (process.env.FORTY_AGENTIC !== "1") notFound();
  return (
    <>
      <CanvasSlot className="min-h-screen" />
      <Footer />
    </>
  );
}
