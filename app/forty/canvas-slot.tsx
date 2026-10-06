"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

/**
 * Where the canvas goes. The spacefront is mounted once, in the root layout, so
 * the island and the conversation follow the visitor across every page; the
 * canvas only belongs on the agentic page. That page renders a `<CanvasSlot>`,
 * and the shell portals the canvas into it. No slot on screen means the visitor
 * is on one of the store's own pages.
 */
type Slot = {
  element: HTMLElement | null;
  setElement: Dispatch<SetStateAction<HTMLElement | null>>;
};

const CanvasSlotContext = createContext<Slot | null>(null);

export function CanvasSlotProvider({ children }: { children: ReactNode }) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  return (
    <CanvasSlotContext.Provider value={{ element, setElement }}>
      {children}
    </CanvasSlotContext.Provider>
  );
}

function useSlot(): Slot {
  const slot = useContext(CanvasSlotContext);
  if (slot === null) {
    throw new Error("the canvas slot is used outside <CanvasSlotProvider>");
  }
  return slot;
}

/** The element the canvas renders into, or `null` on a page without a slot. */
export function useCanvasSlot(): HTMLElement | null {
  return useSlot().element;
}

/** The agentic page's canvas position. */
export function CanvasSlot({ className }: { className?: string }) {
  const { setElement } = useSlot();
  return <div ref={setElement} className={className} />;
}
