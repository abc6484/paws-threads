import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const AMAZON_URL =
  "https://www.amazon.in/s?k=dog+cloths&crid=AZFG8YFRPBW8&sprefix=dog+cloths%2Caps%2C264&ref=nb_sb_noss_2";

export async function scrapeAmazonDogClothes() {
  console.log("Starting Amazon Dog Apparel Scraper...");
  console.log(`Target URL: ${AMAZON_URL}\n`);

  let browser;
  try {
    browser = await chromium.launch({
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true,
    });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 768 },
  });

  const page = await context.newPage();

  try {
    console.log("Navigating to Amazon search page...");
    await page.goto(AMAZON_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000);

    // Extract search result cards
    const scrapedItems = await page.evaluate(() => {
      const cards = Array.from(
        document.querySelectorAll("div[data-component-type='s-search-result']")
      );

      return cards
        .map((card) => {
          const titleEl = card.querySelector("h2 a span, h2 span");
          const imgEl = card.querySelector("img.s-image");
          const ratingEl = card.querySelector(".a-icon-alt");

          const title = titleEl ? titleEl.textContent.trim() : "";
          const rawSrc = imgEl ? imgEl.getAttribute("src") : "";

          // Clean thumbnail suffix to obtain high-resolution image
          // e.g. "https://m.media-amazon.com/images/I/71U1vSQj2-L._AC_UL320_.jpg" -> "https://m.media-amazon.com/images/I/71U1vSQj2-L.jpg"
          const cleanImage = rawSrc ? rawSrc.replace(/\._AC_[^.]+(\.jpg|\.png|\.jpeg)$/i, "$1") : "";

          let rating = 4.7;
          if (ratingEl && ratingEl.textContent) {
            const match = ratingEl.textContent.match(/([0-9.]+)\s+out of/);
            if (match) rating = parseFloat(match[1]);
          }

          return {
            title,
            imageUrl: cleanImage,
            rating,
          };
        })
        .filter((item) => item.title && item.imageUrl && item.imageUrl.includes("amazon.com"));
    });

    console.log(`Found ${scrapedItems.length} valid product listings from Amazon.\n`);

    if (scrapedItems.length === 0) {
      throw new Error("No products found on Amazon search page.");
    }

    // Select curated dog apparel items for website catalog ensuring distinct high-res images
    const usedImages = new Set();
    function pickItem(matcher, fallbackIndex) {
      const match = scrapedItems.find((i) => !usedImages.has(i.imageUrl) && matcher(i));
      const picked = match || scrapedItems.find((i) => !usedImages.has(i.imageUrl)) || scrapedItems[fallbackIndex];
      usedImages.add(picked.imageUrl);
      return picked;
    }

    const polarHoodie = pickItem((i) => /polar bear|arctic/i.test(i.title), 0);
    const coatJacket = pickItem((i) => /winter coat|jacket|windproof/i.test(i.title), 1);
    const festiveOutfit = pickItem((i) => /sherwani|brocade|lehenga|ethnic/i.test(i.title), 2);
    const cottonTshirt = pickItem((i) => /cotton.*t-shirt|graphic.*cloth/i.test(i.title), 3);
    const bearSweatshirt = pickItem((i) => /cub hoodie|bear hoodie|sweatshirt/i.test(i.title), 4);
    const softVest = pickItem((i) => /sleeveless.*vest|pet vest|dog t shirt/i.test(i.title), 5);

    const catalogItems = [
      {
        id: "dog-fleece-01",
        name: "Polar Bear Arctic Fleece Dog Hoodie",
        description: "Plush arctic fleece hoodie designed for maximum warmth, chest coverage, and playful ear detail.",
        alibabaCost: 7.20,
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL"],
        imageUrl: polarHoodie.imageUrl,
        rating: polarHoodie.rating || 4.8,
      },
      {
        id: "dog-rain-02",
        name: "All-Weather Waterproof Dog Coat",
        description: "Windproof and water-resistant ripstop nylon outer with thick fleece lining and adjustable harness slot.",
        alibabaCost: 8.50,
        category: "Outerwear",
        sizes: ["M", "L", "XL", "2XL"],
        imageUrl: coatJacket.imageUrl,
        rating: coatJacket.rating || 4.9,
      },
      {
        id: "dog-harness-vest-03",
        name: "Royal Brocade Festive Dog Sherwani",
        description: "Handcrafted traditional celebratory wear featuring golden brocade fabric and comfortable Velcro under-belly closures.",
        alibabaCost: 11.40,
        category: "Festive",
        sizes: ["XS", "S", "M", "L"],
        imageUrl: festiveOutfit.imageUrl,
        rating: festiveOutfit.rating || 4.7,
      },
      {
        id: "dog-cooling-04",
        name: "Thunder Tails Breathable Cotton Tee",
        description: "100% combed cotton jersey t-shirt with stylish graphic print, stretch ribbed trim, and cooling airflow.",
        alibabaCost: 4.80,
        category: "T-Shirts",
        sizes: ["S", "M", "L", "XL"],
        imageUrl: cottonTshirt.imageUrl,
        rating: cottonTshirt.rating || 4.6,
      },
      {
        id: "dog-sweater-05",
        name: "Cozy Cub Teddy Bear Pullover",
        description: "Ultra-soft bouclé fleece winter pullover for small and medium pups with snug elastic belly band.",
        alibabaCost: 6.90,
        category: "Sweaters",
        sizes: ["XS", "S", "M", "L"],
        imageUrl: bearSweatshirt.imageUrl,
        rating: bearSweatshirt.rating || 4.8,
      },
      {
        id: "dog-vest-06",
        name: "Everyday Stretch Sleeveless Dog Vest",
        description: "Lightweight sleeveless comfort vest in vibrant colorway, perfect for walks, playtime, and layering.",
        alibabaCost: 5.20,
        category: "Vests",
        sizes: ["S", "M", "L", "XL"],
        imageUrl: softVest.imageUrl,
        rating: softVest.rating || 4.5,
      },
    ];

    // 1. Write mapping to data/scraped-images.json
    const scrapedJsonPath = path.resolve("./data/scraped-images.json");
    const jsonOutput = {
      "dog-fleece-01": catalogItems[0].imageUrl,
      "dog-rain-02": catalogItems[1].imageUrl,
      "dog-harness-vest-03": catalogItems[2].imageUrl,
      "dog-cooling-04": catalogItems[3].imageUrl,
      "dog-sweater-05": catalogItems[4].imageUrl,
      "dog-vest-06": catalogItems[5].imageUrl,
      source: AMAZON_URL,
      scrapedAt: new Date().toISOString(),
      items: scrapedItems.slice(0, 10),
    };
    fs.writeFileSync(scrapedJsonPath, JSON.stringify(jsonOutput, null, 2), "utf-8");
    console.log(`Saved scraped images mapping to ${scrapedJsonPath}`);

    // 2. Generate updated data/products.ts
    const productsTsPath = path.resolve("./data/products.ts");
    const productsTsContent = `export interface Product {
  id: string;
  name: string;
  description: string;
  alibabaCost: number; // Wholesale supplier base cost in USD
  price: number;        // Calculated retail price with 50% markup
  category: string;
  sizes: string[];
  imageUrl: string;
  rating: number;
}

// 50% markup helper: wholesale * 1.50 rounded to .99 psychological pricing
export function calculateRetailPrice(alibabaCost: number): number {
  const markupPrice = alibabaCost * 1.5;
  return Math.floor(markupPrice) + 0.99;
}

export const PRODUCTS: Product[] = [
${catalogItems
  .map(
    (item) => `  {
    id: ${JSON.stringify(item.id)},
    name: ${JSON.stringify(item.name)},
    description: ${JSON.stringify(item.description)},
    alibabaCost: ${item.alibabaCost.toFixed(2)},
    price: calculateRetailPrice(${item.alibabaCost.toFixed(2)}),
    category: ${JSON.stringify(item.category)},
    sizes: ${JSON.stringify(item.sizes)},
    imageUrl: ${JSON.stringify(item.imageUrl)},
    rating: ${item.rating.toFixed(1)},
  },`
  )
  .join("\n")}
];
`;

    fs.writeFileSync(productsTsPath, productsTsContent, "utf-8");
    console.log(`Successfully updated ${productsTsPath} with Amazon dog clothes images!`);

    for (const item of catalogItems) {
      console.log(`- [${item.id}] ${item.name} -> ${item.imageUrl}`);
    }
  } catch (error) {
    console.error("Error scraping Amazon:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

scrapeAmazonDogClothes();
