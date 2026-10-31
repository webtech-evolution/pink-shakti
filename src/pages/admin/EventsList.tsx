import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listEvents, deleteEvent } from "@/lib/events-api";
import type { EventDoc } from "@/lib/types";
import { Pencil, Trash2, Plus, Ticket } from "lucide-react";
import { toast } from "sonner";

export default function AdminEventsList() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    listEvents()
      .then(setEvents)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      await deleteEvent(id);
      toast.success("Event deleted");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-maroon">Events</h1>
          <p className="text-maroon/50 text-sm mt-1">Create, edit, and manage all events</p>
        </div>
        <Link
          to="/admin/events/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors"
        >
          <Plus size={14} /> New event
        </Link>
      </div>

      <div className="bg-white border border-gold/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-maroon/50 text-sm">Loading…</div>
        ) : events.length === 0 ? (
          <div className="p-10 text-center text-maroon/50 text-sm">No events yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-maroon/40 border-b border-maroon/10 bg-ivory/60">
                <th className="p-4">Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.$id} className="border-b border-maroon/5 hover:bg-ivory/40">
                  <td className="p-4">
                    <div className="font-semibold text-maroon">{e.title}</div>
                    <div className="text-[11px] text-maroon/40">{e.slug}</div>
                  </td>
                  <td className="text-maroon/70">
                    {new Date(e.startDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="text-maroon/70">{e.location}</td>
                  <td>
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
                        e.status === "published"
                          ? "bg-green-100 text-green-700"
                          : e.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="text-right pr-4">
                    <div className="inline-flex items-center gap-3 text-maroon/60">
                      <Link
                        to={`/admin/events/${e.$id}`}
                        className="hover:text-gold inline-flex items-center gap-1"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Link>
                      <Link
                        to={`/admin/registrations?event=${e.$id}`}
                        className="hover:text-gold inline-flex items-center gap-1"
                        title="Registrations"
                      >
                        <Ticket size={14} />
                      </Link>
                      <button
                        onClick={() => onDelete(e.$id)}
                        className="hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
