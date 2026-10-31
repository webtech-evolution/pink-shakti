import { useEffect, useMemo, useState } from "react";
import { Download, Mail, Phone, Search } from "lucide-react";
import { toast } from "sonner";
import { listLeads, updateLeadStatus } from "@/lib/content-api";
import type { Lead, LeadStatus, LeadType } from "@/lib/content-api";

type LeadTypeFilter = "all" | LeadType;
type StatusFilter = "all" | LeadStatus;

const leadTypeLabels: Record<LeadType, string> = {
  contact: "Contact / plan interest",
  partner: "Partner",
  csr: "CSR",
  newsletter: "Newsletter",
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<LeadTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    listLeads()
      .then(setLeads)
      .catch((error: unknown) =>
        toast.error(error instanceof Error ? error.message : "Could not load leads"),
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return leads.filter((lead) => {
      const matchesType = typeFilter === "all" || lead.type === typeFilter;
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const searchable = [lead.name, lead.email, lead.phone, lead.organisation, lead.message]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      return matchesType && matchesStatus && (!term || searchable.includes(term));
    });
  }, [leads, search, statusFilter, typeFilter]);

  const newCount = leads.filter((lead) => lead.status === "new").length;
  const contactedCount = leads.filter((lead) => lead.status === "contacted").length;

  const changeStatus = async (lead: Lead, status: LeadStatus) => {
    setUpdatingId(lead.$id);
    try {
      await updateLeadStatus(lead.$id, status);
      setLeads((current) =>
        current.map((item) => (item.$id === lead.$id ? { ...item, status } : item)),
      );
      toast.success(status === "contacted" ? "Lead marked as contacted" : "Lead reopened");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update lead");
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCsv = () => {
    const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const headers = ["Date", "Type", "Name", "Email", "Phone", "Organisation", "Message", "Status"];
    const rows = filteredLeads.map((lead) =>
      [
        lead.$createdAt,
        lead.type,
        lead.name,
        lead.email,
        lead.phone,
        lead.organisation,
        lead.message,
        lead.status,
      ]
        .map(escape)
        .join(","),
    );
    const url = URL.createObjectURL(
      new Blob([[headers.map(escape).join(","), ...rows].join("\n")], {
        type: "text/csv;charset=utf-8",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `pink-shakti-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-maroon">Leads</h1>
          <p className="mt-1 text-sm text-maroon/50">
            Contact, partnership and membership enquiries
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={loading || filteredLeads.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-maroon px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold hover:text-maroon disabled:opacity-40"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="All leads" value={leads.length} />
        <Stat label="New" value={newCount} />
        <Stat label="Contacted" value={contactedCount} />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative min-w-56 flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-maroon/40"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search leads"
            aria-label="Search leads"
            className="w-full rounded-lg border border-maroon/15 bg-white py-2.5 pl-9 pr-3 text-sm text-maroon focus:border-gold focus:outline-none"
          />
        </label>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as LeadTypeFilter)}
          aria-label="Filter by lead type"
          className="rounded-lg border border-maroon/15 bg-white px-3 py-2.5 text-sm text-maroon"
        >
          <option value="all">All types</option>
          {Object.entries(leadTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          aria-label="Filter by lead status"
          className="rounded-lg border border-maroon/15 bg-white px-3 py-2.5 text-sm text-maroon"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gold/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-maroon/10 bg-ivory/60 text-left text-[10px] uppercase tracking-widest text-maroon/40">
                <th className="p-4">Received</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-maroon/50">
                    Loading leads...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-maroon/50">
                    {leads.length ? "No leads match these filters." : "No leads yet."}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.$id}
                    className="border-b border-maroon/5 align-top hover:bg-ivory/40"
                  >
                    <td className="whitespace-nowrap p-4 text-xs text-maroon/60">
                      {lead.$createdAt ? formatDate(lead.$createdAt) : "-"}
                    </td>
                    <td className="max-w-56 py-4">
                      <p className="font-semibold text-maroon">{lead.name || "Unnamed"}</p>
                      <a
                        href={`mailto:${lead.email}`}
                        className="mt-1 inline-flex items-center gap-1 text-xs text-maroon/60 hover:text-gold"
                      >
                        <Mail size={12} /> {lead.email}
                      </a>
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="mt-1 flex items-center gap-1 text-xs text-maroon/60 hover:text-gold"
                        >
                          <Phone size={12} /> {lead.phone}
                        </a>
                      )}
                    </td>
                    <td className="py-4 text-xs text-maroon/70">
                      {leadTypeLabels[lead.type] || lead.type}
                    </td>
                    <td className="max-w-sm py-4 pr-4 text-xs text-maroon/60">
                      {lead.organisation && <p className="mb-1">{lead.organisation}</p>}
                      <p className="whitespace-pre-line">{lead.message || "-"}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <select
                        value={lead.status === "contacted" ? "contacted" : "new"}
                        disabled={updatingId === lead.$id}
                        onChange={(event) => changeStatus(lead, event.target.value as LeadStatus)}
                        aria-label={`Status for ${lead.name || lead.email}`}
                        className={`rounded-md border px-2 py-1 text-[10px] uppercase tracking-widest disabled:opacity-50 ${
                          lead.status === "contacted"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-yellow-200 bg-yellow-50 text-yellow-800"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-maroon/5 px-4 py-3 text-xs text-maroon/45">
          Showing {filteredLeads.length} of {leads.length} leads
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gold/10 bg-white p-5">
      <p className="text-[10px] uppercase tracking-widest text-maroon/40">{label}</p>
      <p className="mt-2 font-display text-3xl text-maroon">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
