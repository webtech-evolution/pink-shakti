import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/products-api";
import { usePageMeta } from "@/lib/use-page-meta";

export default function CartPage() {
  const { lines, subtotal, setQty, remove, count } = useCart();

  usePageMeta(
    "Your Cart | PINK SHAKTI 360°",
    "Review the products in your Pink Shakti marketplace cart and proceed to checkout.",
  );

  return (
    <div className="min-h-screen bg-ivory pb-24">
      <section className="max-w-5xl mx-auto px-6 pt-12">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-3">Cart</p>
        <h1 className="font-display text-4xl lg:text-5xl text-maroon leading-tight">
          Your selection
        </h1>

        {lines.length === 0 ? (
          <div className="text-center py-24 text-maroon/60">
            <ShoppingBag className="mx-auto mb-4 text-maroon/20" size={40} />
            <p className="font-display text-2xl mb-2">Your cart is empty.</p>
            <Link
              to="/shop"
              className="inline-block mt-4 px-7 py-3 rounded-full bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em]"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-8 mt-10">
            <div className="space-y-4">
              {lines.map((l) => (
                <div
                  key={l.productId}
                  className="bg-white border border-gold/15 rounded-2xl p-4 flex gap-4 items-center"
                >
                  <Link
                    to={`/product/${l.productId}`}
                    className="h-20 w-20 rounded-xl overflow-hidden bg-maroon/5 shrink-0"
                  >
                    {l.coverImage ? (
                      <img
                        src={l.coverImage}
                        alt={l.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-maroon/20">
                        <ShoppingBag size={18} />
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/store/${l.merchantId}`}
                      className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold hover:underline"
                    >
                      {l.storeName}
                    </Link>
                    <Link
                      to={`/product/${l.productId}`}
                      className="block font-display text-lg text-maroon leading-snug truncate"
                    >
                      {l.title}
                    </Link>
                    <p className="text-sm text-maroon/60">{formatINR(l.rate)} each</p>
                  </div>
                  <div className="flex items-center border border-maroon/15 rounded-full">
                    <button
                      onClick={() => setQty(l.productId, l.qty - 1)}
                      className="p-2.5 text-maroon/60 hover:text-maroon"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-maroon">
                      {l.qty}
                    </span>
                    <button
                      onClick={() => setQty(l.productId, l.qty + 1)}
                      className="p-2.5 text-maroon/60 hover:text-maroon"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="text-right w-24">
                    <p className="font-display text-lg text-maroon">{formatINR(l.rate * l.qty)}</p>
                    <button
                      onClick={() => remove(l.productId)}
                      className="text-maroon/40 hover:text-red-600 mt-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-white border border-gold/15 rounded-2xl p-6 h-fit">
              <h2 className="font-display text-2xl text-maroon mb-4">Summary</h2>
              <div className="flex justify-between text-sm text-maroon/70 mb-2">
                <span>Items</span>
                <span>{count}</span>
              </div>
              <div className="flex justify-between text-sm text-maroon/70">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <p className="text-[11px] text-maroon/40 mt-2">
                Delivery is calculated at checkout based on your state.
              </p>
              <Link
                to="/checkout"
                className="mt-6 block text-center px-6 py-3.5 rounded-full bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors"
              >
                Checkout
              </Link>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
