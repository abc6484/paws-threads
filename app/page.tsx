"use client";

import { useState } from "react";
import { PRODUCTS, Product } from "../data/products";
import {
  ShoppingBag,
  Star,
  X,
  ShieldCheck,
  Ruler,
  Plus,
  Minus,
  Check,
  ArrowRight,
  Truck,
  Sparkles,
} from "lucide-react";

interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

const CATEGORIES = [
  "All",
  "Hoodies",
  "Outerwear",
  "Festive",
  "T-Shirts",
  "Sweaters",
  "Vests",
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "dog-fleece-01": "M",
    "dog-rain-02": "L",
    "dog-harness-vest-03": "M",
    "dog-cooling-04": "S",
    "dog-sweater-05": "M",
    "dog-vest-06": "M",
  });

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const addToCart = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0];
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, selectedSize: size, quantity: 1 }];
    });

    // Provide momentary tap feedback on mobile & desktop
    setAddedItemNotice(`${product.id}-${size}`);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 1800);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const item = prev[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      return prev.map((itm, i) =>
        i === index ? { ...itm, quantity: newQty } : itm
      );
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItemCount = cart.reduce((total, i) => total + i.quantity, 0);

  const filteredProducts =
    selectedCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col pb-20 sm:pb-0">
      {/* Top Value Banner */}
      <div className="bg-amber-500 text-slate-950 text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Truck className="w-3.5 h-3.5" />
        <span>Free Express Delivery on orders over $35 • 30-Day Easy Fit Guarantee</span>
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl select-none" aria-hidden="true">🐾</span>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                PawsThreads
              </span>
              <span className="hidden sm:inline-block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Premium Canine Apparel
              </span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setIsSizeChartOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-full transition"
              aria-label="Open Size Guide"
            >
              <Ruler className="w-3.5 h-3.5 text-amber-600" />
              <span>Size Guide</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 hover:text-slate-900 active:scale-95 transition rounded-full hover:bg-slate-100"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-amber-500 text-slate-950 text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-sm ring-2 ring-white animate-in zoom-in-50 duration-200">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white py-8 sm:py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026 Winter & Spring Collection</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 sm:mb-3">
            Premium Fit Dog Apparel
          </h1>
          <p className="text-slate-300 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
            Weatherproof outerwear, thermal fleece hoodies, and breathable cotton
            vests tailored for every breed and size.
          </p>

          {/* Mobile-Friendly Feature Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-300">
            <span className="bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-full flex items-center gap-1">
              ✓ Water & Wind Resistant
            </span>
            <span className="bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-full flex items-center gap-1">
              ✓ Leash & Harness Slits
            </span>
            <span className="bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-full flex items-center gap-1">
              ✓ Machine Washable
            </span>
          </div>
        </div>
      </section>

      {/* Category Pills - Touch & Horizontal Scroll Friendly */}
      <section className="border-b border-slate-200 bg-white sticky top-14 sm:top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:inline mr-1">
              Category:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition shrink-0 active:scale-95 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Product Catalog */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {selectedCategory === "All" ? "Featured Apparel" : `${selectedCategory} Collection`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Showing {filteredProducts.length} items with wholesale price transparency
            </p>
          </div>
          <button
            onClick={() => setIsSizeChartOpen(true)}
            className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1 sm:hidden p-1"
          >
            <Ruler className="w-3.5 h-3.5" />
            Size Chart
          </button>
        </div>

        {/* Responsive Product Grid: 1 col on small phones, 2 on tablets, 3 on laptop, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const activeSize = selectedSizes[product.id] || product.sizes[0];
            const isJustAdded = addedItemNotice === `${product.id}-${activeSize}`;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden flex flex-col transition hover:shadow-md hover:border-slate-300"
              >
                {/* Product Image Card */}
                <div className="relative aspect-4/3 sm:aspect-square bg-slate-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition duration-300 hover:scale-105"
                  />
                  {/* Rating Tag */}
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs border border-slate-200/50">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>

                  {/* Category Pill Tag */}
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider text-white shadow-xs">
                    {product.category}
                  </div>
                </div>

                {/* Product Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-auto">
                    {/* Size Selector - Large touch-friendly buttons on mobile */}
                    <div className="mb-3.5">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-slate-600">
                          Select Size:
                        </span>
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          {activeSize}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSelectSize(product.id, size)}
                            className={`min-w-9 h-8 sm:h-8 px-2.5 text-xs font-bold rounded-lg border transition active:scale-95 ${
                              activeSize === size
                                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 active:bg-slate-100"
                            }`}
                            aria-label={`Select size ${size}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline justify-between mb-3.5 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                        Wholesale: ${product.alibabaCost.toFixed(2)}
                      </span>
                    </div>

                    {/* Add to Cart - Minimum 44px height for mobile touch ergonomics */}
                    <button
                      onClick={() => addToCart(product)}
                      className={`w-full h-11 sm:h-10 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition active:scale-98 ${
                        isJustAdded
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white shadow-sm"
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4 animate-in zoom-in-75" />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Bag ({activeSize})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Mobile Sticky Cart Pill - Appears when items are in cart */}
      {cart.length > 0 && !isCartOpen && (
        <div className="sm:hidden fixed bottom-4 inset-x-4 z-40 animate-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-slate-950 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center justify-between border border-slate-800 active:scale-98 transition"
          >
            <div className="flex items-center gap-2.5">
              <span className="bg-amber-500 text-slate-950 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                {totalItemCount}
              </span>
              <span className="text-sm font-bold">View Shopping Bag</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-black text-amber-400">
              <span>${cartTotal.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-slate-900" />
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  Shopping Bag ({totalItemCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 active:scale-95 transition"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <div className="text-4xl mb-3">🛍️</div>
                  <p className="font-semibold text-slate-700 mb-1">Your bag is empty</p>
                  <p className="text-xs text-slate-500">
                    Browse our dog apparel collection and find the perfect fit!
                  </p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="pt-3 first:pt-0 flex gap-3 items-center justify-between"
                  >
                    {/* Item Thumbnail */}
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                    />

                    {/* Item Info */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-slate-500">
                          Size: <strong className="text-slate-800">{item.selectedSize}</strong>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-bold text-slate-900">
                          ${item.product.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Stepper buttons on mobile */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="p-1.5 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="p-1.5 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-[11px] text-rose-500 hover:text-rose-700 font-medium ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Total for item */}
                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-slate-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Checkout Section */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50/90 backdrop-blur-xs">
                <div className="space-y-1.5 mb-3 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-emerald-600">
                      {cartTotal >= 35 ? "FREE" : "$4.99"}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                    <span>Total</span>
                    <span>${(cartTotal >= 35 ? cartTotal : cartTotal + 4.99).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert("Checkout flow configured for Stripe / Sandbox.")}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive Size Guide Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSizeChartOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-500" />
                Dog Clothing Sizing Chart
              </h3>
              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable table container for small mobile screens */}
            <div className="overflow-x-auto -mx-1 border border-slate-200 rounded-xl mb-4">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-2.5 border-b border-r">Size</th>
                    <th className="p-2.5 border-b border-r">Back Length</th>
                    <th className="p-2.5 border-b border-r">Chest Girth</th>
                    <th className="p-2.5 border-b">Target Breed / Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 text-xs">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 border-r font-extrabold text-slate-900 bg-slate-50/60">XS</td>
                    <td className="p-2.5 border-r">20 cm (7.9 in)</td>
                    <td className="p-2.5 border-r">30 cm (11.8 in)</td>
                    <td className="p-2.5">Chihuahua (1.5–3 kg)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 border-r font-extrabold text-slate-900 bg-slate-50/60">S</td>
                    <td className="p-2.5 border-r">25 cm (9.8 in)</td>
                    <td className="p-2.5 border-r">36 cm (14.2 in)</td>
                    <td className="p-2.5">Pomeranian / Yorkie (3–5 kg)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 border-r font-extrabold text-slate-900 bg-slate-50/60">M</td>
                    <td className="p-2.5 border-r">30 cm (11.8 in)</td>
                    <td className="p-2.5 border-r">42 cm (16.5 in)</td>
                    <td className="p-2.5">French Bulldog / Pug (5–8 kg)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 border-r font-extrabold text-slate-900 bg-slate-50/60">L</td>
                    <td className="p-2.5 border-r">35 cm (13.8 in)</td>
                    <td className="p-2.5 border-r">48 cm (18.9 in)</td>
                    <td className="p-2.5">Beagle / Cocker Spaniel (8–13 kg)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 border-r font-extrabold text-slate-900 bg-slate-50/60">XL</td>
                    <td className="p-2.5 border-r">40 cm (15.7 in)</td>
                    <td className="p-2.5 border-r">56 cm (22.0 in)</td>
                    <td className="p-2.5">Border Collie / Corgi (14–20 kg)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 border-r font-extrabold text-slate-900 bg-slate-50/60">2XL</td>
                    <td className="p-2.5 border-r">48 cm (18.9 in)</td>
                    <td className="p-2.5 border-r">68 cm (26.8 in)</td>
                    <td className="p-2.5">Labrador / Retriever (21–32 kg)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Fit Guarantee Tip:</strong> Measure your pup's chest at the widest point right behind the front legs. If between sizes, always select the larger size for comfort.
              </div>
            </div>

            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="mt-4 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🐾</span>
            <span className="font-bold text-slate-900">PawsThreads</span>
            <span>— Quality Pet Apparel</span>
          </div>
          <div className="flex gap-4 text-slate-500">
            <button onClick={() => setIsSizeChartOpen(true)} className="hover:underline">
              Size Chart
            </button>
            <span>•</span>
            <span>Worldwide Delivery</span>
            <span>•</span>
            <span>Wholesale Sourced</span>
          </div>
        </div>
      </footer>
    </div>
  );
}