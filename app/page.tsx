"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  imageBase64: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageBase64: string;
}

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        // Fetch banners
        const bSnap = await getDocs(collection(db, "banners"));
        setBanners(bSnap.docs.map(d => ({ id: d.id, ...d.data() } as Banner)));

        // Fetch products (limit to 8)
        const pSnap = await getDocs(query(collection(db, "products"), limit(8)));
        setFeaturedProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (err) {
        console.error("Home data error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin w-8 h-8 border-b-2 border-orange-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Banner Carousel Area */}
      {banners.length > 0 && (
        <section className="relative w-full h-[50vh] md:h-[70vh] bg-slate-100 overflow-hidden">
          {banners.map((b, idx) => (
             <div 
               key={b.id} 
               className="absolute inset-0 transition-opacity duration-1000 opacity-100" 
             >
               <img src={b.imageBase64} alt={b.title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                 <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
                   <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md">{b.title}</h2>
                 </div>
               </div>
             </div>
          ))}
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-3xl font-bold text-slate-900">Featured Collection</h2>
          <Link href="/products" className="text-orange-600 hover:text-orange-700 font-medium flex items-center group">
            Shop All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <p className="text-slate-500 text-center py-12 bg-white rounded-2xl shadow-sm">No products available yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <Link 
                href={`/products/${product.id}`} 
                key={product.id} 
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-slate-100"
              >
                <div className="h-64 bg-slate-50 relative p-4 overflow-hidden border-b border-slate-100 group-hover:bg-orange-50/20 transition-colors">
                  <img 
                    src={product.imageBase64} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
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
      </section>
    </div>
  );
}
