import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice } from "../utils";
import { extractCurrency } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  const username = "brd-customer-hl_dc7cd116-zone-amazon";
  const password = "34gzv9p9rdqc";
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io:22225",
    port,
    rejectUnauthorized: false,
  };

  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const title = $("#productTitle").text().trim();

    const currectPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a-size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
    );

    const inStock = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $(".a-size-base.a-color-price"),
    );

    const currency = extractCurrency($(".a-price-symbol"));

    const discount = $(".savingsPercentage").text().replace(/[-%]/g, "");

    const image =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(image));

    const modelName = $(
      "div.a-row.a-spacing-small.po-model_name span.a-size-base.po-break-word",
    )
      .text()
      .trim();

    const aboutItem = $(
      "h1.a-size-base-plus.a-text-bold:contains('About this item')",
    )
      .closest("div#feature-bullets")
      .find(
        "ul.a-unordered-list.a-vertical.a-spacing-mini li.a-spacing-mini span.a-list-item",
      )
      .map((_, element) => $(element).text().trim())
      .get();

    const productDescription = $("#productDescription").text().trim();

    const whyThis = {
      brand: $("div.po-brand span.a-size-base.po-break-word").text().trim(),
      modelName: $("div.po-model_name span.a-size-base.po-break-word")
        .text()
        .trim(),
      screenSize: $("div.po-display.size span.a-size-base.po-break-word")
        .text()
        .trim(),
      color: $("div.po-color span.a-size-base.po-break-word").text().trim(),
      hardDiskSize: $("div.po-hard_disk.size span.a-size-base.po-break-word")
        .text()
        .trim(),
      cpuModel: $("div.po-cpu_model.family span.a-size-base.po-break-word")
        .text()
        .trim(),
      ramMemorySize: $(
        "div.po-ram_memory.installed_size span.a-size-base.po-break-word",
      )
        .text()
        .trim(),
      operatingSystem: $(
        "div.po-operating_system span.a-size-base.po-break-word",
      )
        .text()
        .trim(),
      specialFeature: $("div.po-special_feature span.a-size-base.po-break-word")
        .text()
        .trim(),
    };

    const priceElement = $(
      "tr:contains('Price') span.a-size-base.a-color-base",
    );
    const shippingElement = $(
      "tr:contains('AmazonGlobal Shipping') span.a-size-base.a-color-base",
    );
    const depositElement = $(
      "tr:contains('Estimated Import Fees Deposit') span.a-size-base.a-color-base",
    );

    const shippingCost = parseFloat(
      shippingElement.text().trim().replace("$", ""),
    );
    const depositFee = parseFloat(
      depositElement.text().trim().replace("$", ""),
    );

    const totalPrice =
      Number(currectPrice.replace(/,/g, "")) + shippingCost + depositFee;

    console.log({
      totalPrice,
      shippingCost,
      depositFee,
      title,
      currectPrice,
      inStock,
      imageUrls,
      currency,
      discount,
      modelName,
      aboutItem,
      productDescription,
      whyThis,
    });

    const data = {
      url,
      currency: currency || "$",
      title,
      currectPrice: Number(currectPrice.replace(/,/g, "")),
      inStock: inStock,
      imageUrls,
      discount: Number(discount),
      modelName,
      aboutItem,
      productDescription,
      whyThis: {
        brand: whyThis.brand,
        modelName: whyThis.modelName,
        screenSize: whyThis.screenSize,
        color: whyThis.color,
        hardDiskSize: whyThis.hardDiskSize,
        cpuModel: whyThis.cpuModel,
        ramMemorySize: whyThis.ramMemorySize,
        operatingSystem: whyThis.operatingSystem,
        specialFeature: whyThis.specialFeature,
      },
      totalPrice,
      shippingCost,
      depositFee,
    };
    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
