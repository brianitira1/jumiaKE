"use client";

import React, { useState, FormEvent } from "react";
import { scrapeAndStoreProduct } from "@/lib/actions";

const isValidJumiaProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes("jumia.com") ||
      hostname.includes("jumia.") ||
      hostname.endsWith("jumia")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidJumiaProductURL(searchPrompt);

    if (!isValidLink) {
      return alert("Provide a valid link for the Jumia marketplace");
    }

    try {
      setIsLoading(true);

      const product = await scrapeAndStoreProduct(searchPrompt);

      console.log("Scraped Product:", product);
    } catch (error: any) { // Explicit type annotation for error
      console.error("Scraping Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Put your Jumia product link here"
        className="searchbar-input"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === "" || isLoading}
      >
        {isLoading ? "Scraping..." : "Scrape"}
      </button>
    </form>
  );
};

export default Searchbar;
