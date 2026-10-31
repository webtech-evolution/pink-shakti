import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Eye, EyeOff, Save } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  listPartners, createPartner, updatePartner, deletePartner,
  listGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem,
} from "@/lib/content-api";
import type { Testimonial, Partner, GalleryItem } from "@/lib/types";

type Tab = "testimonials" | "partners" | "gallery";

const tabs: { key: Tab; label: string }[] = [
  { key: "testimonials", label: "Testimonials" },
  { key: "partners", label: "Partners" },
  { key: "gallery", label: "Media gallery" },
];

const field =
  "w-full px-3 py-2.5 rounded-lg border border-maroon/15 bg-white text-sm text-maroon placeholder:text-maroon/35 focus:outline-none focus:border-gold";
const btn =
  "inline-flex items-center gap-2 px-5 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-60";

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border border-gold/10 rounded-xl p-6">{children}</div>;
}

function StatusToggle({ status, onToggle }: { status: string; onToggle: () => void }) {
  const active = status === "active";
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
        active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {active ? <Eye size={10} /> : <EyeOff size={10} />} {status}
    </button>
  );
}

export default function AdminContent() {
  const [tab, setTab] = useState<Tab>("testimonials");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const [tForm, setTForm] = useState({ quote: "", name: "", role: "", image: "" });
  const [pForm, setPForm] = useState({ name: "", logo: "", website: "", category: "" });
  const [gForm, setGForm] = useState({ title: "", image: "", caption: "", eventName: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [t, p, g] = await Promise.all([
        listTestimonials(false),
        listPartners(false),
        listGallery(false),
      ]);
      setTestimonials(t);
      setPartners(p);
      setGallery(g);
    } catch (e: any) {
      toast.error(e?.message || "Could not load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const guard = async (fn: () => Promise<unknown>, msg: string) => {
    setSaving(true);
    try {
      await fn();
      toast.success(msg);
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-maroon">Site content</h1>
        <p className="text-maroon/50 text-sm mt-1">
          Testimonials, partner logos and the media gallery shown on the public site
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
              tab === t.key ? "bg-maroon text-ivory" : "bg-white border border-gold/15 text-maroon/60 hover:text-maroon"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-10 text-center text-maroon/50 text-sm">
          <Loader2 className="animate-spin inline" size={16} /> Loading…
        </div>
      ) : tab === "testimonials" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-display text-2xl text-maroon mb-5">Add testimonial</h2>
            <div className="space-y-3">
              <textarea className={`${field} min-h-28`} placeholder="Quote" value={tForm.quote}
                onChange={(e) => setTForm({ ...tForm, quote: e.target.value })} />
              <input className={field} placeholder="Name" value={tForm.name}
                onChange={(e) => setTForm({ ...tForm, name: e.target.value })} />
              <input className={field} placeholder="Role / designation" value={tForm.role}
                onChange={(e) => setTForm({ ...tForm, role: e.target.value })} />
              <ImageUploader label="Portrait" aspect="square" value={tForm.image}
                onChange={(url) => setTForm({ ...tForm, image: url })} />
              <button disabled={saving} className={btn}
                onClick={() => {
                  if (!tForm.quote || !tForm.name) return toast.error("Quote and name are required.");
                  guard(
                    () => createTestimonial({ ...tForm, status: "active", order: testimonials.length + 1 } as any),
                    "Testimonial added",
                  ).then(() => setTForm({ quote: "", name: "", role: "", image: "" }));
                }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-2xl text-maroon mb-5">Existing ({testimonials.length})</h2>
            {testimonials.length === 0 ? (
              <p className="text-maroon/50 text-sm">None yet — the site shows built-in fallback stories.</p>
            ) : (
              <ul className="space-y-4">
                {testimonials.map((t) => (
                  <li key={t.$id} className="border-b border-maroon/5 pb-4 last:border-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-semibold text-maroon text-sm">{t.name}</div>
                        <div className="text-[11px] text-maroon/40 mb-1">{t.role}</div>
                        <p className="text-maroon/60 text-xs line-clamp-3">{t.quote}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <StatusToggle status={t.status} onToggle={() =>
                          guard(() => updateTestimonial(t.$id, { status: t.status === "active" ? "hidden" : "active" }), "Updated")} />
                        <button className="text-maroon/40 hover:text-red-600"
                          onClick={() => confirm("Delete this testimonial?") && guard(() => deleteTestimonial(t.$id), "Deleted")}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      ) : tab === "partners" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-display text-2xl text-maroon mb-5">Add partner</h2>
            <div className="space-y-3">
              <input className={field} placeholder="Partner name" value={pForm.name}
                onChange={(e) => setPForm({ ...pForm, name: e.target.value })} />
              <input className={field} placeholder="Website (https://…)" value={pForm.website}
                onChange={(e) => setPForm({ ...pForm, website: e.target.value })} />
              <input className={field} placeholder="Category (Media, Tech, CSR…)" value={pForm.category}
                onChange={(e) => setPForm({ ...pForm, category: e.target.value })} />
              <ImageUploader label="Logo" aspect="video" value={pForm.logo}
                onChange={(url) => setPForm({ ...pForm, logo: url })} />
              <button disabled={saving} className={btn}
                onClick={() => {
                  if (!pForm.name) return toast.error("Partner name is required.");
                  guard(
                    () => createPartner({ ...pForm, status: "active", order: partners.length + 1 } as any),
                    "Partner added",
                  ).then(() => setPForm({ name: "", logo: "", website: "", category: "" }));
                }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-2xl text-maroon mb-5">Existing ({partners.length})</h2>
            {partners.length === 0 ? (
              <p className="text-maroon/50 text-sm">None yet — the site shows built-in partner names.</p>
            ) : (
              <ul className="space-y-4">
                {partners.map((p) => (
                  <li key={p.$id} className="flex items-center justify-between gap-4 border-b border-maroon/5 pb-4 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      {p.logo && <img src={p.logo} alt={p.name} className="h-8 w-auto object-contain" />}
                      <div className="min-w-0">
                        <div className="font-semibold text-maroon text-sm truncate">{p.name}</div>
                        <div className="text-[11px] text-maroon/40 truncate">{p.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusToggle status={p.status} onToggle={() =>
                        guard(() => updatePartner(p.$id, { status: p.status === "active" ? "hidden" : "active" }), "Updated")} />
                      <button className="text-maroon/40 hover:text-red-600"
                        onClick={() => confirm("Delete this partner?") && guard(() => deletePartner(p.$id), "Deleted")}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-display text-2xl text-maroon mb-5">Add gallery item</h2>
            <div className="space-y-3">
              <input className={field} placeholder="Title" value={gForm.title}
                onChange={(e) => setGForm({ ...gForm, title: e.target.value })} />
              <input className={field} placeholder="Event name" value={gForm.eventName}
                onChange={(e) => setGForm({ ...gForm, eventName: e.target.value })} />
              <input className={field} placeholder="Caption" value={gForm.caption}
                onChange={(e) => setGForm({ ...gForm, caption: e.target.value })} />
              <ImageUploader label="Photo" value={gForm.image}
                onChange={(url) => setGForm({ ...gForm, image: url })} />
              <button disabled={saving} className={btn}
                onClick={() => {
                  if (!gForm.title || !gForm.image) return toast.error("Title and photo are required.");
                  guard(
                    () => createGalleryItem({ ...gForm, status: "active", order: gallery.length + 1 } as any),
                    "Gallery item added",
                  ).then(() => setGForm({ title: "", image: "", caption: "", eventName: "" }));
                }}>
                <Save size={14} /> Add
              </button>
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-2xl text-maroon mb-5">Existing ({gallery.length})</h2>
            {gallery.length === 0 ? (
              <p className="text-maroon/50 text-sm">None yet — the media page shows placeholder photos.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {gallery.map((g) => (
                  <div key={g.$id} className="rounded-lg overflow-hidden border border-maroon/10">
                    <img src={g.image} alt={g.title} className="w-full aspect-video object-cover" />
                    <div className="p-3">
                      <div className="font-semibold text-maroon text-xs truncate">{g.title}</div>
                      <div className="text-[10px] text-maroon/40 truncate mb-2">{g.eventName}</div>
                      <div className="flex items-center justify-between">
                        <StatusToggle status={g.status} onToggle={() =>
                          guard(() => updateGalleryItem(g.$id, { status: g.status === "active" ? "hidden" : "active" }), "Updated")} />
                        <button className="text-maroon/40 hover:text-red-600"
                          onClick={() => confirm("Delete this photo?") && guard(() => deleteGalleryItem(g.$id), "Deleted")}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
