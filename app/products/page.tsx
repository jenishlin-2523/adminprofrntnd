"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  imageBase64: string;
}

export default function ProductsListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  useEffect(() => {
    async function fetchAll() {
      try {
        const cSnap = await getDocs(collection(db, "categories"));
        setCategories(cSnap.docs.map(d => ({ id: d.id, name: d.data().name })));

        const pSnap = await getDocs(collection(db, "products"));
        setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (err) {
        console.error("Listing error:", err);
      } finally {
         setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const filtered = activeCategory === "ALL" 
    ? products 
    : products.filter(p => p.categoryId === activeCategory);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin w-8 h-8 border-b-2 border-orange-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Shop Collection</h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
          Discover our full range of beautiful products, tailored for your home.
        </p>
      </div>

      {/* category filtering */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        <button
          onClick={() => setActiveCategory("ALL")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === "ALL" 
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" 
              : "bg-white text-slate-600 hover:bg-slate-100 ring-1 ring-inset ring-slate-200"
          }`}
        >
          All Products
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === c.id 
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" 
                : "bg-white text-slate-600 hover:bg-slate-100 ring-1 ring-inset ring-slate-200"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
          <p className="text-slate-500 text-lg">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <Link 
              href={`/products/${product.id}`} 
              key={product.id} 
              className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-slate-100"
            >
              <div className="h-64 bg-slate-50 relative p-6 overflow-hidden border-b border-slate-100">
                <img 
                  src={product.imageBase64} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{product.name}</h3>
                <div className="mt-auto pt-4 relative">
                  <span className="text-xl font-bold text-slate-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
