import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listMerchants, updateMerchant } from "@/lib/memberships-api";
import type { Merchant, MerchantStatus } from "@/lib/types";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";

const statusColor: Record<MerchantStatus, string> = {
  pending_payment: "bg-yellow-100 text-yellow-700",
  pending_onboarding: "bg-amber-100 text-amber-700",
  pending_review: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-gray-100 text-gray-600",
};

export default function AdminMerchantsList() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MerchantStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () =>
    listMerchants()
      .then((m) => setMerchants(m))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const approve = async (m: Merchant) => {
    const acc =
      prompt("Razorpay linked account ID (starts with acc_). Leave blank to skip:")?.trim() ||
      undefined;
    try {
      await updateMerchant(m.$id, { status: "approved", razorpayAccountId: acc });
      toast.success(`${m.businessName || m.email} approved`);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const reject = async (m: Merchant) => {
    const reason = prompt("Rejection reason (shown to merchant):")?.trim();
    if (!reason) return;
    try {
      await updateMerchant(m.$id, { status: "rejected", rejectionReason: reason });
      toast.success("Merchant rejected");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const suspend = async (m: Merchant) => {
    if (!confirm("Suspend this merchant?")) return;
    try {
      await updateMerchant(m.$id, { status: "suspended" });
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const filtered = filter === "all" ? merchants : merchants.filter((m) => m.status === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-maroon">Merchants</h1>
        <p className="text-maroon/50 text-sm mt-1">Review, approve, and manage merchant accounts</p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(
          ["all", "pending_review", "pending_payment", "approved", "rejected", "suspended"] as const
        ).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors ${
              filter === s
                ? "bg-maroon text-ivory"
                : "bg-white border border-maroon/15 text-maroon/60 hover:border-maroon/40"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gold/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-maroon/50 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-maroon/50 text-sm">
            No merchants{filter !== "all" ? ` with status "${filter}"` : ""}.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-maroon/40 border-b border-maroon/10 bg-ivory/60">
                <th className="p-4">Business / User</th>
                <th>Billing</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <>
                  <tr key={m.$id} className="border-b border-maroon/5 hover:bg-ivory/40">
                    <td className="p-4">
                      <div className="font-semibold text-maroon">
                        {m.businessName || "(no business name)"}
                      </div>
                      <div className="text-[11px] text-maroon/50">
                        {m.fullName} · {m.email}
                      </div>
                    </td>
                    <td className="text-maroon/70">Monthly by volume</td>
                    <td>
                      <span
                        className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${statusColor[m.status]}`}
                      >
                        {m.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="text-maroon/50 text-xs">
                      {m.$createdAt ? new Date(m.$createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="text-right pr-4">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setExpanded(expanded === m.$id ? null : m.$id)}
                          className="text-maroon/50 hover:text-maroon p-1"
                          title="Details"
                        >
                          {expanded === m.$id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {m.status === "pending_review" && (
                          <>
                            <button
                              onClick={() => approve(m)}
                              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-3 py-1.5 bg-green-600 text-white rounded-full hover:bg-green-700"
                            >
                              <Check size={11} /> Approve
                            </button>
                            <button
                              onClick={() => reject(m)}
                              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-3 py-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                            >
                              <X size={11} /> Reject
                            </button>
                          </>
                        )}
                        {m.status === "approved" && (
                          <button
                            onClick={() => suspend(m)}
                            className="text-[10px] uppercase tracking-widest px-3 py-1.5 border border-maroon/20 rounded-full hover:bg-maroon hover:text-ivory"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === m.$id && (
                    <tr className="bg-ivory/40">
                      <td colSpan={5} className="p-6">
                        <div className="grid md:grid-cols-3 gap-4 text-xs">
                          <Info label="Phone" value={m.phone} />
                          <Info label="GST" value={m.gstNumber} />
                          <Info
                            label="Address"
                            value={`${m.address}, ${m.city}, ${m.state} ${m.pincode}`}
                          />
                          <Info
                            label="Bank account"
                            value={`${m.bankAccountName} · ${m.bankAccountNumber}`}
                          />
                          <Info label="IFSC" value={m.ifsc} />
                          <Info label="Razorpay account" value={m.razorpayAccountId || "—"} />
                          {m.kycDocUrl && (
                            <div className="md:col-span-3">
                              <p className="text-[10px] uppercase tracking-widest text-maroon/40 mb-1">
                                KYC document
                              </p>
                              <a href={m.kycDocUrl} target="_blank" rel="noreferrer">
                                <img
                                  src={m.kycDocUrl}
                                  alt="KYC"
                                  className="max-h-48 rounded-lg border border-maroon/10"
                                />
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-maroon/40">{label}</p>
      <p className="text-maroon/80 mt-0.5">{value || "—"}</p>
    </div>
  );
}
