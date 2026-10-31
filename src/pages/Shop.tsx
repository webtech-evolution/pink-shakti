import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Search, Store, ShoppingBag, Plus } from "lucide-react";
import { toast } from "sonner";
import { listProducts, formatINR } from "@/lib/products-api";
import type { Product } from "@/lib/types";
import { usePageMeta } from "@/lib/use-page-meta";
import { useCart } from "@/context/CartContext";

export function ProductCard({ p, showStore = true }: { p: Product; showStore?: boolean }) {
  const { add } = useCart();
  const soldOut = p.stock <= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white border border-gold/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-gold/40 transition-all"
    >
      <Link to={`/product/${p.$id}`} className="block aspect-square bg-maroon/5 overflow-hidden">
        {p.coverImage ? (
          <img
            src={p.coverImage}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-maroon/20">
            <ShoppingBag size={32} />
          </div>
        )}
      </Link>
      <div className="p-5">
        {showStore && (
          <Link
            to={`/store/${p.merchantId}`}
            className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold flex items-center gap-1 hover:underline"
          >
            <Store size={11} /> {p.storeName}
          </Link>
        )}
        <Link to={`/product/${p.$id}`}>
          <h3 className="font-display text-lg text-maroon mt-1 leading-snug hover:text-gold transition-colors">
            {p.title}
          </h3>
        </Link>
        <p className="text-xs text-maroon/50 mt-1 line-clamp-2">{p.description}</p>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-display text-xl text-maroon">{formatINR(p.rate)}</span>
          <span className="text-[10px] uppercase tracking-widest text-maroon/40">
            {soldOut ? "Sold out" : `${p.stock} in stock`}
          </span>
        </div>
        <p className="text-[10px] text-maroon/40 mt-2">
          Delivery: Gujarat {formatINR(p.deliveryChargeGujarat)} · Other states{" "}
          {formatINR(p.deliveryChargeOther)}
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            to={`/product/${p.$id}`}
            className="flex-1 text-center px-4 py-2.5 rounded-full border border-maroon/20 text-[10px] font-bold uppercase tracking-[0.18em] text-maroon hover:bg-maroon hover:text-ivory transition-colors"
          >
            View
          </Link>
          <button
            disabled={soldOut}
            onClick={() => {
              add(p);
              toast.success(`${p.title} added to cart`);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-maroon text-ivory text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-40"
          >
            <Plus size={12} /> Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");

  usePageMeta(
    "Shop | PINK SHAKTI 360°",
    "Shop products from women-led businesses across the Pink Shakti marketplace — apparel, beauty, crafts and more.",
  );

  useEffect(() => {
    listProducts({ activeOnly: true, limit: 100 })
      .then(setProducts)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[],
    [products],
  );

  const filtered = products.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (q.trim() === "" ||
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        (p.storeName || "").toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-ivory pb-24">
      <section className="relative pt-16 pb-12 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.15),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-4">
            Marketplace
          </p>
          <h1 className="font-display text-5xl lg:text-6xl text-maroon leading-tight">
            The Pink Shakti <span className="text-gold">Shop</span>
          </h1>
          <p className="mt-5 text-maroon/70 max-w-2xl mx-auto leading-relaxed">
            Every product here is listed by a woman-led business in our merchant network.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon/30" size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products or stores"
              className="w-full rounded-full border border-maroon/15 bg-white pl-11 pr-4 py-3 text-sm"
            />
          </div>
          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-maroon/15 bg-white px-5 py-3 text-sm text-maroon"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-maroon/40" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-maroon/60">
            <p className="font-display text-2xl mb-2">No products yet.</p>
            <p className="text-sm">
              Our merchants are curating their collections. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.$id} p={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
