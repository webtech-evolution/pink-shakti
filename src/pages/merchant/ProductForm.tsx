import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createProduct, getProduct, listProducts, updateProduct } from "@/lib/products-api";
import type { ProductStatus } from "@/lib/types";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function MerchantProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { merchant } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    rate: 0,
    deliveryChargeGujarat: 0,
    deliveryChargeOther: 0,
    coverImage: "",
    stock: 0,
    category: "",
    status: "active" as ProductStatus,
  });

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((p) =>
        setForm({
          title: p.title,
          description: p.description || "",
          rate: p.rate,
          deliveryChargeGujarat: p.deliveryChargeGujarat,
          deliveryChargeOther: p.deliveryChargeOther,
          coverImage: p.coverImage || "",
          stock: p.stock,
          category: p.category || "",
          status: p.status,
        }),
      )
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!merchant) return;
    setSaving(true);
    try {
      if (editing && id) {
        await updateProduct(id, { ...form, slug: slugify(form.title) });
        toast.success("Product updated");
      } else {
        const existing = await listProducts({ merchantId: merchant.$id, limit: 200 });
        await createProduct({
          ...form,
          slug: slugify(form.title),
          merchantId: merchant.$id,
          storeName: merchant.businessName || merchant.fullName,
        });
        toast.success("Product created");
      }
      navigate("/merchant/products");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-maroon/40" />
      </div>
    );
  }

  const num = (v: string) => (v === "" ? 0 : Number(v));

  return (
    <div className="max-w-3xl">
      <Link
        to="/merchant/products"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-maroon/60 hover:text-gold mb-6"
      >
        <ArrowLeft size={14} /> Back to products
      </Link>
      <h1 className="font-display text-4xl text-maroon mb-8">
        {editing ? "Edit product" : "New product"}
      </h1>

      <form onSubmit={submit} className="bg-white border border-gold/10 rounded-2xl p-8 space-y-5">
        <Field label="Title" required>
          <input
            required
            className="w-full rounded-lg border border-maroon/15 px-4 py-3 text-sm"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>

        <Field label="Description">
          <textarea
            rows={5}
            className="w-full rounded-lg border border-maroon/15 px-4 py-3 text-sm"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Rate (₹)" required>
            <input
              required
              type="number"
              min={0}
              className="w-full rounded-lg border border-maroon/15 px-4 py-3 text-sm"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: num(e.target.value) })}
            />
          </Field>
          <Field label="Delivery in Gujarat (₹)">
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-maroon/15 px-4 py-3 text-sm"
              value={form.deliveryChargeGujarat}
              onChange={(e) => setForm({ ...form, deliveryChargeGujarat: num(e.target.value) })}
            />
          </Field>
          <Field label="Delivery outside Gujarat (₹)">
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-maroon/15 px-4 py-3 text-sm"
              value={form.deliveryChargeOther}
              onChange={(e) => setForm({ ...form, deliveryChargeOther: num(e.target.value) })}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Available stock" required>
            <input
              required
              type="number"
              min={0}
              className="w-full rounded-lg border border-maroon/15 px-4 py-3 text-sm"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: num(e.target.value) })}
            />
          </Field>
          <Field label="Category">
            <input
              className="w-full rounded-lg border border-maroon/15 px-4 py-3 text-sm"
              placeholder="e.g. Apparel, Beauty"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </Field>
          <Field label="Status">
            <select
              className="w-full rounded-lg border border-maroon/15 px-4 py-3 text-sm"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </Field>
        </div>

        <Field label="Cover image">
          <ImageUploader
            value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url || "" })}
          />
        </Field>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon disabled:opacity-50"
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-widest text-maroon/50 mb-2">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
    </label>
  );
}
