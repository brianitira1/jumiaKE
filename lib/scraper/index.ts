"use server";

import axios from "axios";
import * as cheerio from "cheerio";

interface Review {
  rating: string;
  title: string;
  content: string;
  date: string;
  verified: boolean;
}

const reviews: Review[] = [];

export async function scrapeJumiaProduct(url: string) {
  if (!url) return;

  const username = "brd-customer-hl_dc7cd116-zone-jumia";
  const password = "34gzv9p9rdqc";
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36",
  };

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    headers,
    host: "brd.superproxy.io:22225",
    port,
    rejectUnauthorized: false,
  };

  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const title = $("h1.-fs20.-pts.-pbxs").text().trim();

    const currentPrice = $("span.-b.-ltr.-tal.-fs24.-prxs").text().trim();

    const originalPrice = $("span.-tal.-gy5.-lthr.-fs16.-pvxs").text().trim();

    const imageUrl = $("img.-fw.-fh").attr("data-src");

    const deliveryFees = $("div.markup.-ptxs em").text().trim();

    const productDetails = $("div.markup.-mhm.-pvl.-oxa.-sc").text().trim();

    const reviewsSection = $("div.cola.-phm.-df.-d-co");

    const reviews = [];

    reviewsSection.find("article.-pvs.-hr._bet").each((index, element) => {
      const reviewElement = $(element);

      const rating = reviewElement.find("div.stars").text().trim();
      const reviewTitle = reviewElement.find("h3.-m.-fs16.-pvs").text().trim();
      const reviewContent = reviewElement.find("p.-pvs").text().trim();
      const reviewDate = reviewElement
        .find("div.-df.-j-bet.-i-ctr.-gy5 span.-prs")
        .text()
        .trim();
      const isVerified =
        reviewElement.find("div.-df.-i-ctr.-gn5.-fsh0 svg.ic.-f-gn5").length >
        0;

      const reviewData = {
        rating,
        title: reviewTitle,
        content: reviewContent,
        date: reviewDate,
        verified: isVerified,
      };

      reviews.push(reviewData);
    });

    const productImages = [];
    const imagesCarousel = $("#imgs-crsl .itm img");

    imagesCarousel.each((index, element) => {
      const imageUrl = $(element).attr("data-src");
      if (imageUrl) {
        productImages.push(imageUrl);
      }
    });

    console.log({
      title,
      currentPrice,
      originalPrice,
      imageUrl,
      deliveryFees,
      productDetails,
      productReviews: reviews,
      productImages,
    });
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
