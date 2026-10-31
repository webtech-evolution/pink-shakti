import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createEvent,
  createTier,
  deleteTier,
  getEvent,
  listTiers,
  updateEvent,
  updateTier,
} from "@/lib/events-api";
import type { EventDoc, TicketTier } from "@/lib/types";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";

const emptyEvent: Omit<EventDoc, "$id"> = {
  title: "",
  slug: "",
  description: "",
  location: "",
  venue: "",
  startDate: "",
  endDate: "",
  coverImage: "",
  status: "draft",
  featured: false,
  category: "",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function AdminEventForm() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [event, setEvent] = useState<Omit<EventDoc, "$id">>(emptyEvent);
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const [e, t] = await Promise.all([getEvent(id!), listTiers(id!)]);
        setEvent({
          title: e.title,
          slug: e.slug,
          description: e.description,
          location: e.location,
          venue: e.venue || "",
          startDate: e.startDate?.slice(0, 16) || "",
          endDate: e.endDate?.slice(0, 16) || "",
          coverImage: e.coverImage || "",
          status: e.status,
          featured: !!e.featured,
          category: e.category || "",
        });
        setTiers(t);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...event,
        slug: event.slug || slugify(event.title),
        startDate: new Date(event.startDate).toISOString(),
        endDate: event.endDate ? new Date(event.endDate).toISOString() : undefined,
      };
      if (isNew) {
        const created = await createEvent(payload);
        toast.success("Event created");
        navigate(`/admin/events/${created.$id}`);
      } else {
        await updateEvent(id!, payload);
        toast.success("Event updated");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addTier = async () => {
    if (isNew) return toast.error("Save the event first, then add tiers.");
    try {
      const t = await createTier({
        eventId: id!,
        name: "General",
        price: 0,
        currency: "INR",
        capacity: 100,
        description: "",
        order: tiers.length,
      });
      setTiers([...tiers, t]);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const saveTier = async (t: TicketTier) => {
    try {
      const updated = await updateTier(t.$id, t);
      setTiers(tiers.map((x) => (x.$id === t.$id ? updated : x)));
      toast.success("Tier saved");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const removeTier = async (tid: string) => {
    if (!confirm("Delete this tier?")) return;
    try {
      await deleteTier(tid);
      setTiers(tiers.filter((t) => t.$id !== tid));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (loading) return <div className="p-10 text-maroon/50">Loading…</div>;

  return (
    <div className="max-w-4xl">
      <Link
        to="/admin/events"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-maroon/60 hover:text-gold mb-6"
      >
        <ArrowLeft size={14} /> Back to events
      </Link>
      <h1 className="font-display text-4xl text-maroon mb-8">
        {isNew ? "New event" : "Edit event"}
      </h1>

      <form
        onSubmit={onSubmit}
        className="bg-white border border-gold/10 rounded-xl p-8 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Title" required>
            <input
              required
              value={event.title}
              onChange={(e) =>
                setEvent({
                  ...event,
                  title: e.target.value,
                  slug: event.slug || slugify(e.target.value),
                })
              }
              className="input"
            />
          </Field>
          <Field label="Slug">
            <input
              value={event.slug}
              onChange={(e) => setEvent({ ...event, slug: slugify(e.target.value) })}
              className="input"
            />
          </Field>
        </div>

        <Field label="Short description" required>
          <textarea
            required
            rows={3}
            value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
            className="input"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Location (City)" required>
            <input
              required
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Venue">
            <input
              value={event.venue}
              onChange={(e) => setEvent({ ...event, venue: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Start date & time" required>
            <input
              required
              type="datetime-local"
              value={event.startDate}
              onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="End date & time">
            <input
              type="datetime-local"
              value={event.endDate}
              onChange={(e) => setEvent({ ...event, endDate: e.target.value })}
              className="input"
            />
          </Field>
          <div className="md:col-span-2">
            <ImageUploader
              label="Cover image"
              value={event.coverImage}
              onChange={(url) => setEvent({ ...event, coverImage: url })}
            />
          </div>
          <Field label="Category">
            <input
              value={event.category}
              onChange={(e) => setEvent({ ...event, category: e.target.value })}
              className="input"
              placeholder="Summit, Awards, Drive…"
            />
          </Field>
          <Field label="Status">
            <select
              value={event.status}
              onChange={(e) => setEvent({ ...event, status: e.target.value as any })}
              className="input"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={!!event.featured}
              onChange={(e) => setEvent({ ...event, featured: e.target.checked })}
            />
            <span className="text-sm text-maroon/70">Featured on homepage</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-maroon/10">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : isNew ? "Create event" : "Save changes"}
          </button>
        </div>
      </form>

      {!isNew && (
        <div className="bg-white border border-gold/10 rounded-xl p-8 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl text-maroon">Ticket tiers</h2>
              <p className="text-xs text-maroon/50">General, VIP, Sponsor, etc.</p>
            </div>
            <button
              type="button"
              onClick={addTier}
              className="inline-flex items-center gap-2 px-4 py-2 border border-maroon/20 rounded-full text-[11px] uppercase tracking-widest text-maroon hover:bg-maroon hover:text-ivory transition-colors"
            >
              <Plus size={14} /> Add tier
            </button>
          </div>

          {tiers.length === 0 ? (
            <p className="text-sm text-maroon/50 py-8 text-center">No tiers yet.</p>
          ) : (
            <div className="space-y-3">
              {tiers.map((t) => (
                <TierRow
                  key={t.$id}
                  tier={t}
                  onChange={(nt) => setTiers(tiers.map((x) => (x.$id === nt.$id ? nt : x)))}
                  onSave={() => saveTier(t)}
                  onDelete={() => removeTier(t.$id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`.input{border:1px solid rgba(180,13,74,0.15);border-radius:0.5rem;padding:0.65rem 0.85rem;font-size:0.875rem;width:100%;background:white;}
      .input:focus{outline:none;border-color:#c5a059;}`}</style>
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
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-widest text-maroon/60">
        {label}
        {required && " *"}
      </span>
      {children}
    </label>
  );
}

function TierRow({
  tier,
  onChange,
  onSave,
  onDelete,
}: {
  tier: TicketTier;
  onChange: (t: TicketTier) => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-2 items-end border border-maroon/10 rounded-lg p-3">
      <div className="col-span-3">
        <span className="text-[10px] uppercase tracking-widest text-maroon/50">Name</span>
        <input
          value={tier.name}
          onChange={(e) => onChange({ ...tier, name: e.target.value })}
          className="input"
        />
      </div>
      <div className="col-span-2">
        <span className="text-[10px] uppercase tracking-widest text-maroon/50">Price (₹)</span>
        <input
          type="number"
          min={0}
          value={tier.price}
          onChange={(e) => onChange({ ...tier, price: Number(e.target.value) })}
          className="input"
        />
      </div>
      <div className="col-span-2">
        <span className="text-[10px] uppercase tracking-widest text-maroon/50">Capacity</span>
        <input
          type="number"
          min={0}
          value={tier.capacity}
          onChange={(e) => onChange({ ...tier, capacity: Number(e.target.value) })}
          className="input"
        />
      </div>
      <div className="col-span-3">
        <span className="text-[10px] uppercase tracking-widest text-maroon/50">Description</span>
        <input
          value={tier.description || ""}
          onChange={(e) => onChange({ ...tier, description: e.target.value })}
          className="input"
        />
      </div>
      <div className="col-span-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onSave}
          className="px-3 py-2 bg-maroon text-ivory rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-maroon"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-maroon/50 hover:text-red-600"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
