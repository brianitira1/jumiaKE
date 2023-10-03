import { scrapeJumiaProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    const scrapedProduct = await scrapeJumiaProduct(productUrl);

    if (!scrapedProduct) return;

    let product = scrapedProduct;
  } catch (error: any) {
    throw new Error(`Failed to get product: ${error.message}`);
  }
}
