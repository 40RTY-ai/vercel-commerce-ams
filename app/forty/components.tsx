"use client";

import { adaptComponent, renderInline } from "@40rty/ams-sdk";
import type {
  Collection as FortyCollection,
  HostComponents,
  Product as FortyProduct,
} from "@40rty/ams-sdk";
import clsx from "clsx";
import { AddToCart } from "components/cart/add-to-cart";
import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import ProductGridItems from "components/layout/product-grid-items";
import Price from "components/price";
import { Gallery } from "components/product/gallery";
import { ProductDescription } from "components/product/product-description";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import { catalog } from "./catalog";
import { collectionPath, isLoaded, loaded, toStoreProduct } from "./to-store";

/** The store's page gutter — the same one its product and search pages use. */
const GUTTER = "mx-auto w-full max-w-(--breakpoint-2xl) px-4";

function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 text-2xl font-bold">{children}</h2>;
}

function ProductGrid({
  title,
  products,
}: {
  title?: string;
  products?: Array<FortyProduct | string>;
}) {
  const items = loaded(products).map(toStoreProduct);
  return (
    <section className={GUTTER}>
      {title ? <SectionHeading>{title}</SectionHeading> : null}
      <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <ProductGridItems products={items} />
      </Grid>
    </section>
  );
}

function CollectionList({
  title,
  collections,
}: {
  title?: string;
  collections?: Array<FortyCollection | string>;
}) {
  return (
    <section className={GUTTER}>
      {title ? <SectionHeading>{title}</SectionHeading> : null}
      <Grid className="grid-cols-2 lg:grid-cols-4">
        {loaded(collections).map((collection) => (
          <Grid.Item key={collection.id} className="animate-fadeIn">
            <Link
              className="relative inline-block h-full w-full"
              href={collectionPath(collection)}
              prefetch={true}
            >
              <GridTileImage
                alt={collection.title}
                src={collection.image === undefined ? "" : collection.image.url}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <span className="absolute bottom-4 left-4 rounded-full border bg-white/70 px-3 py-2 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
                {collection.title}
              </span>
            </Link>
          </Grid.Item>
        ))}
      </Grid>
    </section>
  );
}

type Cell = string | number | boolean;

function cellText(value: Cell | undefined): string {
  if (value === undefined) return "—";
  if (typeof value === "boolean") return value ? "✓" : "✗";
  return String(value);
}

/**
 * The store's add-to-cart, where it can act on its own: it picks the variant
 * from the URL's option params, which only a product page sets. A product
 * with options links to its page instead, where the store's picker is.
 */
function BuyAction({ product }: { product: FortyProduct }) {
  const storeProduct = toStoreProduct(product);
  if (storeProduct.variants.length === 1) {
    return (
      <Suspense fallback={null}>
        <AddToCart product={storeProduct} />
      </Suspense>
    );
  }
  return (
    <Link
      href={`/product/${product.handle}`}
      className="flex w-full items-center justify-center rounded-full border border-blue-600 p-4 tracking-wide text-blue-600 hover:opacity-90"
    >
      Choose options
    </Link>
  );
}

function ComparisonTable({
  products,
  verdict,
  highlightedProductId,
  attributeRows,
}: {
  products?: Array<FortyProduct | string>;
  verdict?: string;
  highlightedProductId?: string;
  attributeRows?: Array<{
    id: string;
    label: string;
    values: Record<string, Cell>;
    winner?: string;
  }>;
}) {
  const items = loaded(products);
  if (items.length < 2) return null;
  const columns = {
    gridTemplateColumns: `8rem repeat(${items.length}, minmax(0, 1fr))`,
  };
  const rows = attributeRows === undefined ? [] : attributeRows;
  return (
    <section className={GUTTER}>
      {verdict ? <p className="mb-4 text-lg">{verdict}</p> : null}
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-black">
        <div className="grid min-w-[36rem] gap-x-4 gap-y-3" style={columns}>
          <span />
          {items.map((product) => {
            const storeProduct = toStoreProduct(product);
            const picked = product.id === highlightedProductId;
            return (
              <div key={product.id} className="grid content-start gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {picked ? "Our pick" : " "}
                </span>
                <Link
                  href={`/product/${product.handle}`}
                  className="relative block aspect-square"
                  prefetch={true}
                >
                  <GridTileImage
                    alt={storeProduct.title}
                    src={storeProduct.featuredImage.url}
                    active={picked}
                    fill
                    sizes="(min-width: 1024px) 20vw, 33vw"
                  />
                </Link>
                <h3 className="text-sm font-semibold">{storeProduct.title}</h3>
                <Price
                  className="text-sm"
                  amount={storeProduct.priceRange.minVariantPrice.amount}
                  currencyCode={
                    storeProduct.priceRange.minVariantPrice.currencyCode
                  }
                />
                <BuyAction product={product} />
              </div>
            );
          })}
          {rows.map((row) => (
            <div key={row.id} className="contents">
              <span className="self-center text-sm text-neutral-500 dark:text-neutral-400">
                {row.label}
              </span>
              {items.map((product) => (
                <span
                  key={product.id}
                  className={clsx("self-center text-sm", {
                    "font-bold": row.winner === product.id,
                  })}
                >
                  {cellText(row.values[product.id])}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** One product, as the store's product page draws it: gallery, then title, price, options, add-to-cart. */
function ProductDetail({
  product,
  reason,
}: {
  product?: FortyProduct | string;
  reason?: string;
}) {
  if (!isLoaded(product)) return null;
  const storeProduct = toStoreProduct(product);
  return (
    <section className={GUTTER}>
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <Suspense
            fallback={
              <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
            }
          >
            <Gallery
              images={storeProduct.images.slice(0, 5).map((image) => ({
                src: image.url,
                altText: image.altText,
              }))}
            />
          </Suspense>
        </div>
        <div className="basis-full lg:basis-2/6">
          {reason ? <p className="mb-6 text-lg">{reason}</p> : null}
          <Suspense fallback={null}>
            <ProductDescription product={storeProduct} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

/** The agent's prose on the canvas. */
function AgentText({
  text,
  parts,
}: {
  text?: string;
  parts?: Array<{ type: "text" | "em"; value: string }>;
}) {
  return (
    <div className={GUTTER}>
      <p className="max-w-3xl text-lg leading-7">
        {parts !== undefined
          ? parts.map((part, i) =>
              part.type === "em" ? <em key={i}>{part.value}</em> : part.value,
            )
          : text !== undefined
            ? renderInline(text, "agent-text")
            : null}
      </p>
    </div>
  );
}

/** One exchange: the visitor's ask, then whatever the agent composed for it. */
function Turn({ prompt, children }: { prompt?: string; children?: ReactNode }) {
  return (
    <section className="grid gap-6 border-b border-neutral-200 py-8 dark:border-neutral-800">
      {prompt ? (
        <h2 className={clsx(GUTTER, "text-3xl font-medium")}>“{prompt}”</h2>
      ) : null}
      {children}
    </section>
  );
}

export const fortyComponents: HostComponents = {
  catalog,
  renderers: {
    productGrid: adaptComponent(ProductGrid),
    collectionList: adaptComponent(CollectionList),
    comparisonTable: adaptComponent(ComparisonTable),
    productDetail: adaptComponent(ProductDetail),
    agentText: adaptComponent(AgentText),
    turn: adaptComponent(Turn),
  },
};
