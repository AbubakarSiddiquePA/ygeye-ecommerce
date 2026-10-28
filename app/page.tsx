'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Lock, ShieldCheck, CheckCircle2, Trash2, ArrowRight } from 'lucide-react';
import initialProducts from '@/data/products.json';

// Simple VIP Secret Token for private URL sharing
const ACCESS_SECRET = 'vip2026';

export default function StoreFront() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  useEffect(() => {
    // Check if accessed with ?key=vip2026 or saved in localStorage
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    const stored = localStorage.getItem('store_access_token');

    if (key === ACCESS_SECRET || stored === ACCESS_SECRET) {
      localStorage.setItem('store_access_token', ACCESS_SECRET);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    // Load custom products if updated via Admin
    const customProds = localStorage.getItem('admin_products');
    if (customProds) {
      try {
        setProducts(JSON.parse(customProds));
      } catch (e) {}
    }
  }, []);

  const handleManualUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === ACCESS_SECRET) {
      localStorage.setItem('store_access_token', ACCESS_SECRET);
      setIsAuthenticated(true);
    } else {
      alert('Invalid VIP Access Code. Please check the invitation URL or passkey.');
    }
  };

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Checking VIP access...</div>;
  }

  // Private Access Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-white">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Private Storefront</h2>
          <p className="text-slate-400 text-sm mb-6">
            This boutique catalog is private and only available to invited customers. Enter your VIP passkey below or open the private link provided to you.
          </p>

          <form onSubmit={handleManualUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter VIP Passkey (e.g. vip2026)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center tracking-widest text-lg font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition duration-200 shadow-lg shadow-amber-500/20"
            >
              Enter Store
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/60 text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Invitation-Only Protected URL</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-md">
              A
            </div>
            <span className="font-semibold text-xl tracking-tight">Atelier Private</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full border border-amber-200">
              VIP Member
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs text-slate-500 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
            >
              Admin Panel
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm flex items-center gap-2 text-sm font-medium"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((s, i) => s + i.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-white border-b border-slate-100 py-12 px-4 sm:px-6 text-center">
        <span className="text-amber-600 font-semibold tracking-wide uppercase text-xs">Curated Selection</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-3">
          Private Collection & Catalog
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
          Handpicked items available exclusively for verified invitees. Enjoy direct checkout with zero hassle.
        </p>
      </section>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item: any) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-md text-slate-800 shadow-sm">
                  {item.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="text-lg font-bold text-slate-900">
                    ${Number(item.price).toFixed(2)}
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-slate-900" />
                  <h2 className="font-bold text-lg text-slate-900">Your Basket</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                >
                  ✕ Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {checkoutComplete ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Order Confirmed!</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                      Thank you for your order. We have recorded your purchase in the admin system.
                    </p>
                    <button
                      onClick={() => {
                        setCheckoutComplete(false);
                        setCart([]);
                        setIsCartOpen(false);
                      }}
                      className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShoppingBag className="w-12 h-12 mx-auto stroke-[1.5] mb-2 opacity-40" />
                    <p className="text-sm">Your basket is currently empty.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-slate-900 truncate">{item.name}</h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Qty: {item.qty} × ${item.price}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm text-slate-900">
                          ${(item.price * item.qty).toFixed(2)}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-xs p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {!checkoutComplete && cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-slate-500">Total Due:</span>
                    <span className="text-2xl font-extrabold text-slate-900">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      // Save order locally for Admin view
                      const currentOrders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
                      currentOrders.unshift({
                        id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
                        date: new Date().toLocaleDateString(),
                        items: cart,
                        total: cartTotal,
                        status: 'Pending'
                      });
                      localStorage.setItem('admin_orders', JSON.stringify(currentOrders));
                      setCheckoutComplete(true);
                    }}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Private E-Commerce Platform • Shareable Secret Link: <span className="font-mono text-slate-600 font-semibold">?key=vip2026</span>
      </footer>
    </div>
  );
}

