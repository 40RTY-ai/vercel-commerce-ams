"use client";

/*
 * The agentic page's shell: the canvas the agent composes onto, and AMS UI's
 * island, conversation panel and presence band — in this store's design.
 *
 * The store, as read from its components:
 *   surface   bg-white tiles on a bg-neutral-50 page; black / neutral-900 in dark mode
 *   text      black; neutral-500 secondary; white in dark mode
 *   accent    blue-600 (#2563eb) — price pills, add-to-cart, active tiles; white on it
 *   radius    rounded-lg (0.5rem) surfaces, rounded-full buttons and pills
 *   font      Geist Sans (`--font-geist-sans`, set on <html> by the root layout)
 *   inputs    the navbar search: neutral border, white bg, text-sm
 *   pinned    nothing in the page itself; sonner's Toaster bottom-right (the
 *             welcome toast stays until dismissed) and Next's dev button bottom-left
 *
 * The tokens live in `app/globals.css` (`--fourty-*`). The island is centred
 * and capped at 640px, so it clears both corners on desktop.
 */
import { SpacefrontCanvas } from "@40rty/ams-sdk";
import { SpacefrontIsland } from "@40rty/ams-ui/island";
import "@40rty/ams-ui/island.css";
import { SpacefrontPresence } from "@40rty/ams-ui/presence";
import "@40rty/ams-ui/presence.css";
import { SpacefrontThreadPanel } from "@40rty/ams-ui/thread-panel";
import "@40rty/ams-ui/thread-panel.css";

const PLACEHOLDER =
  "Ask for a board for your level, boots that fit, a warmer jacket…";
const EMPTY_TEXT =
  "Boards, boots, bindings and jackets — ask, and the store lays it out for you.";

export function Shell() {
  return (
    <div className="relative min-h-screen pb-56 pr-[var(--fourty-thread-panel-inset,0px)]">
      <SpacefrontCanvas />
      <SpacefrontPresence />
      <SpacefrontThreadPanel
        title="Ask the store"
        placeholder={PLACEHOLDER}
        emptyText={EMPTY_TEXT}
      />
      <SpacefrontIsland placeholder={PLACEHOLDER} emptyText={EMPTY_TEXT} />
    </div>
  );
}
