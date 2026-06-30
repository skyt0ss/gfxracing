/*
 * ── SHOPIFY INTEGRATION PATH ─────────────────────────────────────────────────
 *
 * When ready to go live, replace the static `products` array below with a
 * live fetch from the Shopify Storefront API:
 *
 * Step 1 – Set up a store (free dev store at partners.shopify.com, or a
 *           paid Starter plan at $5 USD/mo for real sales).
 *
 * Step 2 – In the Shopify admin:
 *           Settings → Apps and sales channels → Develop apps → Create an app
 *           Grant the "unauthenticated_read_product_listings" Storefront API scope.
 *           Copy the Public Storefront API access token.
 *
 * Step 3 – Add to .env.local (never commit this file):
 *           VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
 *           VITE_SHOPIFY_STOREFRONT_TOKEN=your-public-token
 *
 * Step 4 – Replace the `products` export with an async loader, e.g.:
 *
 *   const GQL = `{
 *     products(first: 20) {
 *       edges {
 *         node {
 *           id
 *           title
 *           description
 *           priceRange { minVariantPrice { amount currencyCode } }
 *           totalInventory
 *           tags
 *           variants(first: 1) { edges { node { id availableForSale } } }
 *         }
 *       }
 *     }
 *   }`;
 *
 *   const res = await fetch(
 *     `https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/api/2025-01/graphql.json`,
 *     {
 *       method: "POST",
 *       headers: {
 *         "Content-Type": "application/json",
 *         "X-Shopify-Storefront-Access-Token": import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
 *       },
 *       body: JSON.stringify({ query: GQL }),
 *     }
 *   );
 *
 * Step 5 – To switch from dev store → real store, only VITE_SHOPIFY_DOMAIN
 *           and VITE_SHOPIFY_STOREFRONT_TOKEN need to change. All UI code stays
 *           identical.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type ProductCategory =
  | "Tires"
  | "Bodies"
  | "Drivetrain"
  | "Electronics"
  | "Batteries"
  | "Accessories";

export type ScaleTag = "1/28" | "1/10" | "1/12" | "All";

export interface ShopProduct {
  /** Unique slug — maps to the Shopify variant ID when integrated */
  id: string;
  name: string;
  category: ProductCategory;
  /** Which track scales this product is compatible with */
  scales: ScaleTag[];
  /** Price in CAD */
  price: number;
  description: string;
  stock: StockStatus;
}

// ─── Example products (replace with Shopify API data when ready) ──────────────

export const products: ShopProduct[] = [
  {
    id: "foam-tire-set-28",
    name: "1/28 Foam Tire Set",
    category: "Tires",
    scales: ["1/28"],
    price: 8.99,
    description:
      "Pre-glued foam tires for 1/28 pan cars. Set of 4 — 2 fronts, 2 rears. Medium compound.",
    stock: "in_stock",
  },
  {
    id: "lexan-body-f1-28",
    name: "1/28 F1 Lexan Body",
    category: "Bodies",
    scales: ["1/28"],
    price: 14.99,
    description:
      "Clear lexan F1 body shell. Trim-to-fit for most 1/28 pan car frames. Unpainted.",
    stock: "in_stock",
  },
  {
    id: "pinion-gear-set-28",
    name: "1/28 Pinion Gear Set",
    category: "Drivetrain",
    scales: ["1/28"],
    price: 6.99,
    description:
      "Assorted 48-pitch pinion gears — 9T, 10T, 11T, 12T, 13T, 14T. Steel, fits standard 1/28 motors.",
    stock: "low_stock",
  },
  {
    id: "transponder-mini",
    name: "Club Lap Transponder",
    category: "Electronics",
    scales: ["All"],
    price: 89.99,
    description:
      "GFX-compatible mini transponder for the club timing system. Mandatory for all race-day classes.",
    stock: "in_stock",
  },
  {
    id: "foam-tire-set-110",
    name: "1/10 Foam Tire Set",
    category: "Tires",
    scales: ["1/10"],
    price: 24.99,
    description:
      "Medium-compound foam tires for 1/10 pan car and TC classes. Set of 4. Pre-trued.",
    stock: "in_stock",
  },
  {
    id: "bearing-kit-110-112",
    name: "Full Ball Bearing Kit",
    category: "Drivetrain",
    scales: ["1/10", "1/12"],
    price: 18.99,
    description:
      "Complete replacement bearing set for 1/10 and 1/12 pan chassis. Rubber-sealed, ABEC-5 rated.",
    stock: "low_stock",
  },
  {
    id: "lipo-3500-2s",
    name: "LiPo 3500 mAh 2S Pack",
    category: "Batteries",
    scales: ["1/10", "1/12"],
    price: 39.99,
    description:
      "7.4 V · 3500 mAh · 45C short-saddle pack. Fits most 1/10 and 1/12 pan car chassis.",
    stock: "in_stock",
  },
  {
    id: "smart-charger-dual",
    name: "Dual-Port Smart Charger",
    category: "Accessories",
    scales: ["All"],
    price: 59.99,
    description:
      "50 W per port balance charger for LiPo and NiMH packs. Charges two packs simultaneously.",
    stock: "out_of_stock",
  },
];
