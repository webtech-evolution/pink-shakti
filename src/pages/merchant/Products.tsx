import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listProducts, deleteProduct, formatINR } from "@/lib/products-api";
import type { Product } from "@/lib/types";

export default function MerchantProducts() {
  const { merchant } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!merchant) return;
    listProducts({ merchantId: merchant.$id })
      .then(setProducts)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [merchant?.$id]);

  const atLimit = false;

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await deleteProduct(p.$id);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((x) => x.$id !== p.$id));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (!merchant) return null;

  if (merchant.status !== "approved") {
    return (
      <div className="bg-white border border-gold/10 rounded-xl p-10 text-center">
        <Package className="mx-auto text-maroon/30 mb-3" size={32} />
        <p className="font-display text-2xl text-maroon">Catalog locked</p>
        <p className="text-sm text-maroon/50 mt-2">
          Your store must be approved before you can add products.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-4xl text-maroon">My products</h1>
          <p className="text-maroon/50 text-sm mt-1">
            {products.length} listed · monthly volume billing
          </p>
        </div>
        {atLimit ? (
          <Link
            to="/membership"
            className="px-5 py-3 border border-maroon/20 text-maroon rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:border-gold"
          >
            Contact support
          </Link>
        ) : (
          <Link
            to="/merchant/products/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon"
          >
            <Plus size={14} /> Add product
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-maroon/40" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gold/10 rounded-xl p-12 text-center">
          <Package className="mx-auto text-maroon/30 mb-3" size={32} />
          <p className="font-display text-xl text-maroon">No products yet</p>
          <p className="text-sm text-maroon/50 mt-1">Add your first product to open your store.</p>
        </div>
      ) : (
        <div className="bg-white border border-gold/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ivory text-[10px] uppercase tracking-widest text-maroon/50">
              <tr>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Rate</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.$id} className="border-t border-maroon/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.coverImage ? (
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-maroon/5" />
                      )}
                      <div>
                        <p className="font-medium text-maroon">{p.title}</p>
                        <p className="text-[11px] text-maroon/40">
                          {p.category || "Uncategorised"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-maroon/70">{formatINR(p.rate)}</td>
                  <td className="p-4 text-maroon/70">{p.stock}</td>
                  <td className="p-4">
                    <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-maroon/5 text-maroon/60">
                      {p.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        to={`/merchant/products/${p.$id}`}
                        className="text-maroon/50 hover:text-gold"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => remove(p)}
                        className="text-maroon/50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
