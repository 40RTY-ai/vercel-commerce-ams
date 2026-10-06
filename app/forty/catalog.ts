import { CollectionSchema, ProductSchema, resolved, z } from "@40rty/ams-sdk";
import type { HostComponents } from "@40rty/ams-sdk";

/**
 * What the agent may compose on the agentic page's canvas. Data only —
 * `forty publish` sends this file to the platform, so it imports nothing but
 * `@40rty/ams-sdk`. Each type is drawn in `./components.tsx` and described to
 * the agent in `./catalogs/<type>.md`.
 */
export const catalog: HostComponents["catalog"] = {
  productGrid: {
    type: "productGrid",
    propsSchema: z.object({
      title: z.string().describe("section heading"),
      products: resolved(ProductSchema, "product", {
        min: 1,
        max: 12,
      }).describe("the products to show"),
    }),
    examples: [
      {
        title: "New arrivals",
        products: [
          "gid://shopify/Product/<id-1>",
          "gid://shopify/Product/<id-2>",
        ],
      },
    ],
  },
  collectionList: {
    type: "collectionList",
    propsSchema: z.object({
      title: z.string().describe("section heading"),
      collections: resolved(CollectionSchema, "collection", {
        min: 2,
        max: 4,
      }).describe("the collections to feature"),
    }),
    examples: [
      {
        title: "Shop by category",
        collections: [
          "gid://shopify/Collection/<id-1>",
          "gid://shopify/Collection/<id-2>",
        ],
      },
    ],
  },
  comparisonTable: {
    type: "comparisonTable",
    propsSchema: z.object({
      products: resolved(ProductSchema, "product", { min: 2, max: 4 }).describe(
        "the DISTINCT products to compare side by side, each at most once",
      ),
      verdict: z
        .string()
        .optional()
        .describe(
          "your one-line call above the table: the pick and the deciding reason, ≤140 chars. Omit only when staying neutral",
        ),
      highlightedProductId: z
        .string()
        .optional()
        .describe(
          "the gid of the pick — one of `products`; set whenever `verdict` names a winner",
        ),
      attributeRows: z
        .array(
          z.object({
            id: z.string().describe('stable slug, e.g. "flex"'),
            label: z.string().describe('row label, e.g. "Flex"'),
            values: z
              .record(z.union([z.string(), z.number(), z.boolean()]))
              .describe(
                "a value for EVERY product gid in `products`; booleans render ✓/✗",
              ),
            winner: z
              .string()
              .optional()
              .describe(
                "gid of the product that wins this row for the visitor's stated need; omit on a wash",
              ),
          }),
        )
        .optional()
        .describe(
          "judgment rows only — price and stock are drawn from the products already. Derive values from title, description, tags and variants",
        ),
    }),
    examples: [
      {
        products: [
          "gid://shopify/Product/<id-1>",
          "gid://shopify/Product/<id-2>",
        ],
        verdict:
          "For all-mountain riding the first board wins — stiffer, and it holds an edge on ice.",
        highlightedProductId: "gid://shopify/Product/<id-1>",
        attributeRows: [
          {
            id: "flex",
            label: "Flex",
            values: {
              "gid://shopify/Product/<id-1>": "Medium-stiff",
              "gid://shopify/Product/<id-2>": "Soft",
            },
            winner: "gid://shopify/Product/<id-1>",
          },
        ],
      },
    ],
  },
  productDetail: {
    type: "productDetail",
    propsSchema: z.object({
      product: resolved(ProductSchema, "product", { min: 1, max: 1 }).describe(
        "the one product to recommend",
      ),
      reason: z
        .string()
        .optional()
        .describe("one sentence on why this is the one for them"),
    }),
    examples: [
      {
        product: "gid://shopify/Product/<id>",
        reason:
          "A forgiving flex that still holds an edge — the one people progress on.",
      },
    ],
  },
};
