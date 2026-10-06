"use client";

import { Spacefront } from "@40rty/ams-sdk";

import fortyConfig from "../../forty.config.json";
import { fortyComponents } from "./components";
import { Shell } from "./Shell";
import { SpacefrontBoundary } from "./SpacefrontBoundary";

/**
 * Mounts the spacefront once, in the root layout, beside the store's pages —
 * never around them: `<Spacefront>` renders nothing until its engine loads,
 * and the store's pages must render on the server as they always have. Being
 * in the layout, the session survives navigation, so the visitor keeps one
 * conversation across every page.
 *
 * Consent: this store ships no consent tool (no cookie banner, no Shopify
 * Customer Privacy API), so the visitor's analytics consent is `granted`.
 * When the store adds one, read its state here instead.
 */
export function FortySpacefront({ token }: { token: string | undefined }) {
  return (
    <SpacefrontBoundary>
      <Spacefront
        spaceSlug={fortyConfig.spaceSlug}
        apiUrl={fortyConfig.apiUrl}
        consent="granted"
        token={token}
        components={fortyComponents}
      >
        <Shell />
      </Spacefront>
    </SpacefrontBoundary>
  );
}
