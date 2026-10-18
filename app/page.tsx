"use client";

import { useState } from "react";
import { PRODUCTS, Product } from "../data/products";
import { ShoppingBag, Star, X, ShieldCheck, Ruler } from "lucide-react";

interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "dog-fleece-01": "M",
    "dog-rain-02": "L",
    "dog-harness-vest-03": "M",
    "dog-cooling-04": "S",
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
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              PawsThreads
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSizeChartOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <Ruler className="w-4 h-4" />
              Size Guide
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 hover:text-slate-900"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cart.reduce((total, i) => total + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
          Premium Fit Dog Apparel
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">
          Weatherproof jackets, thermal fleeces, and breathable vests tailored
          for breeds of every size.
        </p>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Catalog</h2>
            <p className="text-sm text-slate-500">All prices include our standard 50% retail margin</p>
          </div>
          <button
            onClick={() => setIsSizeChartOpen(true)}
            className="sm:hidden text-xs text-amber-600 font-semibold underline"
          >
            Size Guide
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => {
            const activeSize = selectedSizes[product.id] || product.sizes[0];

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition hover:shadow-md"
              >
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-semibold text-slate-700 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {product.rating}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-600 mb-1">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-slate-900 text-base leading-snug mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  <div className="mt-auto">
                    {/* Size Selector */}
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-slate-600 mb-1.5">
                        Select Size:
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSelectSize(product.id, size)}
                            className={`px-2.5 py-1 text-xs font-medium rounded border transition ${
                              activeSize === size
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Display */}
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        Wholesale: ${product.alibabaCost.toFixed(2)}
                      </span>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart ({activeSize})
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Shopping Bag
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  Your cart is empty.
                </div>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-3 pb-3 border-b border-slate-100 items-center justify-between"
                  >
                    <div>
                      <h4 className="font-medium text-sm text-slate-800">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Size: {item.selectedSize} · Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 mt-1">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex justify-between items-center text-base font-bold text-slate-900 mb-3">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => alert("Checkout flow configured for Stripe / Sandbox.")}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg shadow-sm transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsSizeChartOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-500" />
                Dog Clothing Sizing Chart
              </h3>
              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-2 border">Size</th>
                  <th className="p-2 border">Back Length</th>
                  <th className="p-2 border">Chest Girth</th>
                  <th className="p-2 border">Target Breed / Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="p-2 border font-bold">XS</td>
                  <td className="p-2 border">20 cm</td>
                  <td className="p-2 border">30 cm</td>
                  <td className="p-2 border">Chihuahua (1.5–3 kg)</td>
                </tr>
                <tr>
                  <td className="p-2 border font-bold">S</td>
                  <td className="p-2 border">25 cm</td>
                  <td className="p-2 border">36 cm</td>
                  <td className="p-2 border">Pomeranian (3–5 kg)</td>
                </tr>
                <tr>
                  <td className="p-2 border font-bold">M</td>
                  <td className="p-2 border">30 cm</td>
                  <td className="p-2 border">42 cm</td>
                  <td className="p-2 border">French Bulldog / Pug (5–8 kg)</td>
                </tr>
                <tr>
                  <td className="p-2 border font-bold">L</td>
                  <td className="p-2 border">35 cm</td>
                  <td className="p-2 border">48 cm</td>
                  <td className="p-2 border">Beagle / Cocker (8–13 kg)</td>
                </tr>
                <tr>
                  <td className="p-2 border font-bold">XL</td>
                  <td className="p-2 border">40 cm</td>
                  <td className="p-2 border">56 cm</td>
                  <td className="p-2 border">Border Collie (14–20 kg)</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Tip: If your dog's measurements fall between two sizes, choose the larger size.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}