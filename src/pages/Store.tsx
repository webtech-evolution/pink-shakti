import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, MapPin, Store as StoreIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getMerchantById } from "@/lib/memberships-api";
import { listProducts } from "@/lib/products-api";
import type { Merchant, Product } from "@/lib/types";
import { usePageMeta } from "@/lib/use-page-meta";
import { ProductCard } from "@/pages/Shop";

export default function StorePage() {
  const { merchantId = "" } = useParams();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  usePageMeta(
    merchant ? `${merchant.businessName} | PINK SHAKTI Shop` : "Store | PINK SHAKTI",
    merchant
      ? `Shop products from ${merchant.businessName}, a woman-led business on the Pink Shakti marketplace.`
      : "Merchant storefront on the Pink Shakti marketplace.",
  );

  useEffect(() => {
    if (!merchantId) return;
    Promise.all([
      getMerchantById(merchantId).catch(() => null),
      listProducts({ merchantId, activeOnly: true, limit: 100 }),
    ])
      .then(([m, p]) => {
        setMerchant(m);
        setProducts(p);
      })
      .catch((e) => toast.error(e?.message || "Could not load store"))
      .finally(() => setLoading(false));
  }, [merchantId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-maroon/40" />
      </div>
    );
  }

  const storeName = merchant?.businessName || merchant?.fullName || products[0]?.storeName;

  if (!storeName) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="font-display text-3xl text-maroon mb-3">Store not found</h1>
          <Link to="/shop" className="text-gold text-sm uppercase tracking-widest">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pb-24">
      <section className="relative pt-12 pb-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.15),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-maroon/60 hover:text-gold mb-6"
          >
            <ArrowLeft size={14} /> All products
          </Link>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-3 flex items-center gap-2">
            <StoreIcon size={12} /> Merchant store
          </p>
          <h1 className="font-display text-5xl text-maroon leading-tight">{storeName}</h1>
          <p className="mt-3 text-maroon/60 text-sm flex items-center gap-2">
            <MapPin size={13} />{" "}
            {[merchant?.city, merchant?.state].filter(Boolean).join(", ") || "India"}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        {products.length === 0 ? (
          <div className="text-center py-20 text-maroon/60">
            <p className="font-display text-2xl mb-2">No products listed yet.</p>
            <p className="text-sm">This store is preparing its collection.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.$id} p={p} showStore={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
