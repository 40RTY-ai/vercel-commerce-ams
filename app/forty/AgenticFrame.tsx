import type { ReactNode } from "react";

import { CanvasSlotProvider } from "./canvas-slot";
import { FortySpacefront } from "./FortySpacefront";

/**
 * The agentic build's frame around every page of the store: the page itself,
 * untouched and server-rendered, plus the spacefront beside it. Every page
 * leaves room for the island below and the conversation panel docked right.
 *
 * `FORTY_DEV_TOKEN` is the developer's preview credential, written to `.env`
 * by `forty dev`. It is read here on the server and handed down; it is absent
 * in production, where the space renders what it has published.
 */
export function AgenticFrame({ children }: { children: ReactNode }) {
  return (
    <CanvasSlotProvider>
      <div className="pb-48 pr-[var(--fourty-thread-panel-inset,0px)]">
        {children}
      </div>
      <FortySpacefront token={process.env.FORTY_DEV_TOKEN} />
    </CanvasSlotProvider>
  );
}
