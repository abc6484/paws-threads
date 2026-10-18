export interface Product {
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
  {
    id: "dog-fleece-01",
    name: "Polar Bear Arctic Fleece Dog Hoodie",
    description: "Plush arctic fleece hoodie designed for maximum warmth, chest coverage, and playful ear detail.",
    alibabaCost: 7.20,
    price: calculateRetailPrice(7.20),
    category: "Hoodies",
    sizes: ["S","M","L","XL"],
    imageUrl: "https://m.media-amazon.com/images/I/71U1vSQj2-L.jpg",
    rating: 4.7,
  },
  {
    id: "dog-rain-02",
    name: "All-Weather Waterproof Dog Coat",
    description: "Windproof and water-resistant ripstop nylon outer with thick fleece lining and adjustable harness slot.",
    alibabaCost: 8.50,
    price: calculateRetailPrice(8.50),
    category: "Outerwear",
    sizes: ["M","L","XL","2XL"],
    imageUrl: "https://m.media-amazon.com/images/I/61ILxti65vL.jpg",
    rating: 4.0,
  },
  {
    id: "dog-harness-vest-03",
    name: "Royal Brocade Festive Dog Sherwani",
    description: "Handcrafted traditional celebratory wear featuring golden brocade fabric and comfortable Velcro under-belly closures.",
    alibabaCost: 11.40,
    price: calculateRetailPrice(11.40),
    category: "Festive",
    sizes: ["XS","S","M","L"],
    imageUrl: "https://m.media-amazon.com/images/I/81mtCMEPgFL.jpg",
    rating: 4.2,
  },
  {
    id: "dog-cooling-04",
    name: "Thunder Tails Breathable Cotton Tee",
    description: "100% combed cotton jersey t-shirt with stylish graphic print, stretch ribbed trim, and cooling airflow.",
    alibabaCost: 4.80,
    price: calculateRetailPrice(4.80),
    category: "T-Shirts",
    sizes: ["S","M","L","XL"],
    imageUrl: "https://m.media-amazon.com/images/I/41rZb2FaWvL.jpg",
    rating: 3.9,
  },
  {
    id: "dog-sweater-05",
    name: "Cozy Cub Teddy Bear Pullover",
    description: "Ultra-soft bouclé fleece winter pullover for small and medium pups with snug elastic belly band.",
    alibabaCost: 6.90,
    price: calculateRetailPrice(6.90),
    category: "Sweaters",
    sizes: ["XS","S","M","L"],
    imageUrl: "https://m.media-amazon.com/images/I/51Y0QeE6cpL.jpg",
    rating: 4.7,
  },
  {
    id: "dog-vest-06",
    name: "Everyday Stretch Sleeveless Dog Vest",
    description: "Lightweight sleeveless comfort vest in vibrant colorway, perfect for walks, playtime, and layering.",
    alibabaCost: 5.20,
    price: calculateRetailPrice(5.20),
    category: "Vests",
    sizes: ["S","M","L","XL"],
    imageUrl: "https://m.media-amazon.com/images/I/614dZDjFXuL.jpg",
    rating: 4.7,
  },
];
