# Next.js Commerce × 40rty

[Next.js Commerce](https://github.com/vercel/commerce) with a [40rty](https://40rty-docs.vercel.app/) agentic page: visitors ask the store, and an agent composes the answer from **the store's own components** — its product tiles, gallery, variant picker and add-to-cart — so everything it lays out can go straight into the real Shopify cart.

**Live:** https://vercel-commerce-ams.vercel.app

## What 40rty adds

Everything lives in [`app/forty/`](app/forty); the rest of the store is untouched.

| File                          | What it is                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `catalog.ts`                  | What the agent may compose — `productGrid`, `collectionList`, `comparisonTable`, `productDetail`. Data only (Zod schemas + examples); `forty publish` sends it to the platform. |
| `catalogs/*.md`               | One manifest per component: what it shows and when the agent should reach for it.                                                                                               |
| `components.tsx`              | Each type drawn with the store's existing components (`Grid`, `GridTileImage`, `Gallery`, `ProductDescription`, `AddToCart`).                                                   |
| `to-store.ts`                 | Maps 40rty's product/collection entities to `lib/shopify`'s types — the one place the two shapes meet.                                                                          |
| `Shell.tsx`                   | The `@40rty/ams-ui` island, thread panel and presence, themed from the store's tokens in `app/globals.css`.                                                                     |
| `page.tsx`, `AgenticPage.tsx` | `/forty`, which `next.config.ts` serves at `/` when `FORTY_AGENTIC=1`.                                                                                                          |

`forty.config.json` binds the app to its space. `tsconfig.json` uses `"moduleResolution": "bundler"` so `@40rty/ams-ui`'s subpath exports resolve.

## Run it against your own store

```bash
pnpm install
rm forty.config.json                        # it binds this repo to our space
npx forty init --create <your-space-slug>   # sign in, create your space, write your own
```

Put your store in `.env` (see `.env.example`) — `SHOPIFY_STORE_DOMAIN` and a **Storefront** API token in `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — plus `FORTY_AGENTIC=1`. The store must be published (no password) with products on the Shop channel: the agent searches Shopify's Global catalog.

```bash
npx forty connect                  # attach the store to the space
npx forty dev --once               # publish the catalog as a draft, write FORTY_DEV_TOKEN to .env
pnpm dev                           # http://localhost:3000 is the agentic page
npx forty doctor http://localhost:3000
```

Ship it: deploy as usual (without `FORTY_DEV_TOKEN` — `.vercelignore` keeps `.env` out of CLI uploads), then `npx forty publish --origin https://your-site.example`.

`FORTY_AGENTIC=0` (or unset) builds the original store, unchanged.

---

# Next.js Commerce

A high-performance, server-rendered Next.js App Router ecommerce application.

This template uses React Server Components, Server Actions, `Suspense`, `useOptimistic`, and more.

<h3 id="v1-note"></h3>

> Note: Looking for Next.js Commerce v1? View the [code](https://github.com/vercel/commerce/tree/v1), [demo](https://commerce-v1.vercel.store), and [release notes](https://github.com/vercel/commerce/releases/tag/v1).

## Providers

Vercel will only be actively maintaining a Shopify version [as outlined in our vision and strategy for Next.js Commerce](https://github.com/vercel/commerce/pull/966).

Vercel is happy to partner and work with any commerce provider to help them get a similar template up and running and listed below. Alternative providers should be able to fork this repository and swap out the `lib/shopify` file with their own implementation while leaving the rest of the template mostly unchanged.

- Shopify (this repository)
- [BigCommerce](https://github.com/bigcommerce/nextjs-commerce) ([Demo](https://next-commerce-v2.vercel.app/))
- [Ecwid by Lightspeed](https://github.com/Ecwid/ecwid-nextjs-commerce/) ([Demo](https://ecwid-nextjs-commerce.vercel.app/))
- [Geins](https://github.com/geins-io/vercel-nextjs-commerce) ([Demo](https://geins-nextjs-commerce-starter.vercel.app/))
- [Medusa](https://github.com/medusajs/vercel-commerce) ([Demo](https://medusa-nextjs-commerce.vercel.app/))
- [Prodigy Commerce](https://github.com/prodigycommerce/nextjs-commerce) ([Demo](https://prodigy-nextjs-commerce.vercel.app/))
- [Saleor](https://github.com/saleor/nextjs-commerce) ([Demo](https://saleor-commerce.vercel.app/))
- [Shopware](https://github.com/shopwareLabs/vercel-commerce) ([Demo](https://shopware-vercel-commerce-react.vercel.app/))
- [Swell](https://github.com/swellstores/verswell-commerce) ([Demo](https://verswell-commerce.vercel.app/))
- [Umbraco](https://github.com/umbraco/Umbraco.VercelCommerce.Demo) ([Demo](https://vercel-commerce-demo.umbraco.com/))
- [Wix](https://github.com/wix/headless-templates/tree/main/nextjs/commerce) ([Demo](https://wix-nextjs-commerce.vercel.app/))
- [Fourthwall](https://github.com/FourthwallHQ/vercel-commerce) ([Demo](https://vercel-storefront.fourthwall.app/))

> Note: Providers, if you are looking to use similar products for your demo, you can [download these assets](https://drive.google.com/file/d/1q_bKerjrwZgHwCw0ovfUMW6He9VtepO_/view?usp=sharing).

## Integrations

Integrations enable upgraded or additional functionality for Next.js Commerce

- [Orama](https://github.com/oramasearch/nextjs-commerce) ([Demo](https://vercel-commerce.oramasearch.com/))

  - Upgrades search to include typeahead with dynamic re-rendering, vector-based similarity search, and JS-based configuration.
  - Search runs entirely in the browser for smaller catalogs or on a CDN for larger.

- [React Bricks](https://github.com/ReactBricks/nextjs-commerce-rb) ([Demo](https://nextjs-commerce.reactbricks.com/))
  - Edit pages, product details, and footer content visually using [React Bricks](https://www.reactbricks.com) visual headless CMS.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Shopify store.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

<details>
  <summary>Expand if you work at Vercel and want to run locally and / or contribute</summary>

1. Run `vc link`.
1. Select the `Vercel Solutions` scope.
1. Connect to the existing `commerce-shopify` project.
1. Run `vc env pull` to get environment variables.
1. Run `pnpm dev` to ensure everything is working correctly.
</details>

## Vercel, Next.js Commerce, and Shopify Integration Guide

You can use this comprehensive [integration guide](https://vercel.com/docs/integrations/ecommerce/shopify) with step-by-step instructions on how to configure Shopify as a headless CMS using Next.js Commerce as your headless Shopify storefront on Vercel.
