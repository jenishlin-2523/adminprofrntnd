"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, ShieldCheck } from "lucide-react";
import { use } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  imageBase64: string;
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const d = await getDoc(doc(db, "products", unwrappedParams.id));
        if (d.exists()) {
          setProduct({ id: d.id, ...d.data() } as Product);
        }
      } catch (err) {
        console.error("Detail error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
         <div className="animate-spin w-8 h-8 border-b-2 border-orange-500 rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <Link href="/products" className="text-orange-500 hover:text-orange-600 mt-4 inline-block font-medium">&larr; Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
      </Link>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Image Section */}
        <div className="md:w-1/2 bg-slate-50 p-8 sm:p-12 border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center relative">
           <img 
             src={product.imageBase64} 
             alt={product.name} 
             className="w-full h-auto max-h-[500px] object-contain drop-shadow-lg mix-blend-multiply" 
           />
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
            {product.name}
          </h1>
          
          <div className="text-3xl font-bold text-orange-600 mt-6 mb-8">
             ${Number(product.price).toFixed(2)}
          </div>
          
          <div className="prose prose-slate prose-lg mb-8">
            <p className="text-slate-600 leading-relaxed">
              {product.description || "Indulge in the finest quality material. Perfect for any modern space seeking a touch of elegance."}
            </p>
          </div>

          <div className="space-y-4 mb-10 pt-6 border-t border-slate-100">
             <div className="flex items-center text-slate-600">
                <ShieldCheck className="w-5 h-5 mr-3 text-green-500" />
                <span className="text-sm font-medium">100% Quality Guarantee</span>
             </div>
          </div>

          <button className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20 active:scale-[0.98]">
             <ShoppingCart className="w-5 h-5" />
             <span className="font-bold text-lg">Add to Cart</span>
          </button>

        </div>
      </div>
    </div>
  );
}
