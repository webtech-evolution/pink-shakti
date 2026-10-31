import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Minus, Plus, ShoppingBag, Store, Truck, ArrowLeft } from "lucide-react";
import { getProduct, formatINR } from "@/lib/products-api";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { usePageMeta } from "@/lib/use-page-meta";

export default function ProductDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState<string | undefined>();

  usePageMeta(
    product ? `${product.title} | PINK SHAKTI Shop` : "Product | PINK SHAKTI Shop",
    product
      ? `${product.title} by ${product.storeName} — ${formatINR(product.rate)} on the Pink Shakti marketplace.`
      : "Product on the Pink Shakti marketplace.",
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(id)
      .then((p) => {
        setProduct(p);
        setActive(p.coverImage);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-maroon/40" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="font-display text-3xl text-maroon mb-3">Product not found</h1>
          <Link to="/shop" className="text-gold text-sm uppercase tracking-widest">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  const soldOut = product.stock <= 0 || product.status !== "active";
  const images = [product.coverImage, ...(product.gallery || [])].filter(Boolean) as string[];

  const addToCart = (goToCart = false) => {
    add(product, qty);
    toast.success(`${product.title} added to cart`);
    if (goToCart) navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-ivory pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-maroon/60 hover:text-gold mb-8"
        >
          <ArrowLeft size={14} /> Back to shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-maroon/5 border border-gold/15">
              {active ? (
                <img src={active} alt={product.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-maroon/20">
                  <ShoppingBag size={48} />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((src) => (
                  <button
                    key={src}
                    onClick={() => setActive(src)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border ${
                      active === src ? "border-gold" : "border-gold/15"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Link
              to={`/store/${product.merchantId}`}
              className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold inline-flex items-center gap-1.5 hover:underline"
            >
              <Store size={12} /> {product.storeName}
            </Link>
            <h1 className="font-display text-4xl lg:text-5xl text-maroon leading-tight mt-3">
              {product.title}
            </h1>
            <p className="font-display text-3xl text-maroon mt-4">{formatINR(product.rate)}</p>
            <p className="text-[11px] uppercase tracking-widest text-maroon/40 mt-1">
              {soldOut ? "Sold out" : `${product.stock} in stock`}
            </p>

            {product.description && (
              <p className="mt-6 text-maroon/70 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            )}

            <div className="mt-6 bg-white border border-gold/15 rounded-2xl p-5 text-sm text-maroon/70">
              <p className="flex items-center gap-2 font-semibold text-maroon mb-2">
                <Truck size={15} /> Delivery charges
              </p>
              <p>Within Gujarat: {formatINR(product.deliveryChargeGujarat)}</p>
              <p>Other states: {formatINR(product.deliveryChargeOther)}</p>
            </div>

            {!soldOut && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-maroon/15 rounded-full bg-white">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-3 text-maroon/60 hover:text-maroon"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-maroon">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="p-3 text-maroon/60 hover:text-maroon"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => addToCart(false)}
                  className="px-7 py-3.5 rounded-full border border-maroon text-maroon text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-maroon hover:text-ivory transition-colors"
                >
                  Add to cart
                </button>
                <button
                  onClick={() => addToCart(true)}
                  className="px-7 py-3.5 rounded-full bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors"
                >
                  Buy now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
