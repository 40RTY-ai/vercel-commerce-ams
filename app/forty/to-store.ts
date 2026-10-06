import type {
  Collection as FortyCollection,
  Product as FortyProduct,
} from "@40rty/ams-sdk";
import type { Image, Money, Product, ProductVariant } from "lib/shopify/types";

/**
 * The spacefront hands renderers its own entity shape, hydrated from the
 * store. The store's components take the shape `lib/shopify` builds from its
 * GraphQL fragments. These mappers are the one place the two meet, so every
 * renderer passes the store's components exactly what they already expect.
 */

/** While the page streams, a `resolved()` prop can still hold IDs — keep only what has arrived. */
export function loaded<T extends object>(
  items: Array<T | string> | undefined,
): T[] {
  if (items === undefined) return [];
  return items.filter(
    (item): item is T => typeof item === "object" && item !== null,
  );
}

export function isLoaded<T extends object>(
  item: T | string | undefined,
): item is T {
  return typeof item === "object" && item !== null;
}

function toMoney(money: FortyProduct["price"]): Money {
  return { amount: String(money.amount), currencyCode: money.currencyCode };
}

function toImage(image: FortyProduct["images"][number], title: string): Image {
  return {
    url: image.url,
    altText: image.altText === "" ? title : image.altText,
    width: image.width === undefined ? 0 : image.width,
    height: image.height === undefined ? 0 : image.height,
  };
}

function toVariant(variant: FortyProduct["variants"][number]): ProductVariant {
  return {
    id: variant.id,
    title: variant.title,
    availableForSale: variant.available,
    // A variant can arrive without its options; the store's add-to-cart matches
    // on them, so a single-variant product still needs one entry to match.
    selectedOptions:
      variant.selectedOptions === undefined
        ? [{ name: "Title", value: variant.title }]
        : variant.selectedOptions,
    price: toMoney(variant.price),
  };
}

function priceRange(product: FortyProduct): Product["priceRange"] {
  const prices = product.variants.map((variant) => variant.price);
  if (prices.length === 0) {
    return {
      minVariantPrice: toMoney(product.price),
      maxVariantPrice: toMoney(product.price),
    };
  }
  const byAmount = [...prices].sort((a, b) => a.amount - b.amount);
  const [min] = byAmount;
  const max = byAmount[byAmount.length - 1];
  if (min === undefined || max === undefined) {
    throw new Error(`product ${product.id}: variants without prices`);
  }
  return { minVariantPrice: toMoney(min), maxVariantPrice: toMoney(max) };
}

/** A spacefront product as `lib/shopify`'s `Product` — what every store product component takes. */
export function toStoreProduct(product: FortyProduct): Product {
  const images = product.images.map((image) => toImage(image, product.title));
  const [featured] = images;
  const options = product.options === undefined ? [] : product.options;
  return {
    id: product.id,
    handle: product.handle,
    availableForSale: product.availableForSale,
    title: product.title,
    description: product.description,
    descriptionHtml:
      product.descriptionHtml === undefined ? "" : product.descriptionHtml,
    options: options.map((option) => ({
      id: `${product.id}/${option.name}`,
      name: option.name,
      values: option.values,
    })),
    priceRange: priceRange(product),
    variants: product.variants.map(toVariant),
    featuredImage:
      featured === undefined
        ? { url: "", altText: product.title, width: 0, height: 0 }
        : featured,
    images,
    seo: { title: product.title, description: product.description },
    tags: product.tags,
    updatedAt: "",
  };
}

/** Where a collection lives in this store: its search page. */
export function collectionPath(collection: FortyCollection): string {
  return `/search/${collection.handle}`;
}
