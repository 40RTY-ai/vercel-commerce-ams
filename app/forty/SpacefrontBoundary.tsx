"use client";

import { Component, type ReactNode } from "react";

/**
 * The spacefront now sits on every page of the store, and `<Spacefront>`
 * throws when its engine cannot load. The store must keep working without
 * it: log what failed and render nothing in its place.
 */
export class SpacefrontBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn(
      "[forty] the spacefront failed; the store carries on without it",
      error,
    );
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
