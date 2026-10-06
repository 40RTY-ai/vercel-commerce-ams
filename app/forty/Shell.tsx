"use client";

/*
 * The spacefront's shell, on every page of the store: AMS UI's island,
 * conversation panel and presence band — in this store's design — plus the
 * canvas, portalled into the agentic page's `<CanvasSlot>` when that page is
 * on screen.
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
import { SpacefrontCanvas, usePendingMessage } from "@40rty/ams-sdk";
import { SpacefrontIsland } from "@40rty/ams-ui/island";
import "@40rty/ams-ui/island.css";
import { SpacefrontPresence } from "@40rty/ams-ui/presence";
import "@40rty/ams-ui/presence.css";
import { SpacefrontThreadPanel } from "@40rty/ams-ui/thread-panel";
import "@40rty/ams-ui/thread-panel.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useCanvasSlot } from "./canvas-slot";

const PLACEHOLDER =
  "Ask for a board for your level, boots that fit, a warmer jacket…";
const EMPTY_TEXT =
  "Boards, boots, bindings and jackets — ask, and the store lays it out for you.";

/**
 * An answer is laid out on the agentic page. When the visitor asks from one of
 * the store's own pages (no canvas slot on screen), take them there. Only on a
 * NEW ask: a visitor who follows a product link while an answer is still
 * streaming stays where they went.
 */
function useFollowAskToCanvas(slot: HTMLElement | null) {
  const pending = usePendingMessage();
  const router = useRouter();
  const wasAsking = useRef(false);
  useEffect(() => {
    const asking = pending !== null;
    if (asking && !wasAsking.current && slot === null) router.push("/");
    wasAsking.current = asking;
  }, [pending, slot, router]);
}

export function Shell() {
  const slot = useCanvasSlot();
  useFollowAskToCanvas(slot);
  return (
    <>
      {slot === null ? null : createPortal(<SpacefrontCanvas />, slot)}
      <SpacefrontPresence />
      <SpacefrontThreadPanel
        title="Ask the store"
        placeholder={PLACEHOLDER}
        emptyText={EMPTY_TEXT}
      />
      <SpacefrontIsland placeholder={PLACEHOLDER} emptyText={EMPTY_TEXT} />
    </>
  );
}
