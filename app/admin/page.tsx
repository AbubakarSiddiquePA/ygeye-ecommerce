'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PackagePlus, ShieldAlert, ShoppingBag, ArrowLeft, Trash2, KeyRound } from 'lucide-react';
import initialProducts from '@/data/products.json';

const ADMIN_PASSWORD = 'admin'; // Default quick access

export default function AdminDashboard() {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [orders, setOrders] = useState<any[]>([]);

  // Form states for new product
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Accessories');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('admin_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {}
    }
    const savedOrders = localStorage.getItem('admin_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {}
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminAuth(true);
    } else {
      alert('Invalid admin password. Default is: admin');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProd = {
      id: 'prod_' + Date.now(),
      name,
      price: parseFloat(price),
      category,
      stock: 10,
      description: description || 'New exclusive item',
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
    };

    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem('admin_products', JSON.stringify(updated));

    // Reset fields
    setName('');
    setPrice('');
    setDescription('');
    setImage('');
    alert('Product added successfully!');
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('admin_products', JSON.stringify(updated));
  };

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center text-white">
          <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold mb-2">Admin Portal Login</h2>
          <p className="text-xs text-slate-400 mb-6">Manage items, customer orders, and access keys.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password (default: admin)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center font-mono"
            />
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
            >
              Sign In to Admin
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
            </Link>
            <h1 className="font-bold text-lg text-slate-900">Admin Control Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              VIP Code: <strong>vip2026</strong>
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Add Product */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 font-bold text-slate-900">
            <PackagePlus className="w-5 h-5 text-amber-500" />
            <span>Add New Product</span>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Product Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Vintage Leather Wallet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="49.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option>Accessories</option>
                  <option>Electronics</option>
                  <option>Lifestyle</option>
                  <option>Apparel</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Brief item features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition"
            >
              Publish Product
            </button>
          </form>

          {/* Shareable URL Box */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Shareable VIP Link</h4>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 break-all">
              http://localhost:3000/?key=vip2026
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Anyone with this secret parameter skips the gate and views products instantly.
            </p>
          </div>
        </div>

        {/* Right Column: Manage Products & Recent Orders */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Products */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-base text-slate-900 mb-4">Active Catalog Products ({products.length})</h2>
            <div className="divide-y divide-slate-100">
              {products.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-slate-100" />
                    <div>
                      <h4 className="font-medium text-sm text-slate-900">{p.name}</h4>
                      <span className="text-xs text-slate-500 font-mono">${Number(p.price).toFixed(2)} • {p.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-base text-slate-900 mb-4">Recent Customer Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No checkout orders recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-sm">
                    <div>
                      <div className="font-bold text-slate-900">{ord.id}</div>
                      <div className="text-xs text-slate-500">{ord.date} • {ord.items.length} items</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-slate-900">${ord.total.toFixed(2)}</div>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

