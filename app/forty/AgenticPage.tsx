"use client";

import { Spacefront } from "@40rty/ams-sdk";

import fortyConfig from "../../forty.config.json";
import { fortyComponents } from "./components";
import { Shell } from "./Shell";

/**
 * Mounts the spacefront. Client-only: `<Spacefront>` fetches the 40rty engine
 * in an effect, so the server renders the empty host and nothing else.
 *
 * Consent: this store ships no consent tool (no cookie banner, no Shopify
 * Customer Privacy API), so the visitor's analytics consent is `granted`.
 * When the store adds one, read its state here instead.
 */
export function AgenticPage({ token }: { token: string | undefined }) {
  return (
    <Spacefront
      spaceSlug={fortyConfig.spaceSlug}
      apiUrl={fortyConfig.apiUrl}
      consent="granted"
      token={token}
      components={fortyComponents}
    >
      <Shell />
    </Spacefront>
  );
}
