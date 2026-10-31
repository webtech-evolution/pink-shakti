import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, Mail, Phone, UserRound } from "lucide-react";
import { listMembers, listSubscriptions } from "@/lib/content-api";
import type { Member, Subscription } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminMembersList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  useEffect(() => {
    Promise.all([listMembers(), listSubscriptions()])
      .then(([memberData, subscriptionData]) => {
        setMembers(memberData);
        setSubscriptions(subscriptionData);
      })
      .catch((error) => toast.error(error?.message || "Could not load members"))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    const headers = [
      "Member ID",
      "User ID",
      "Full name",
      "Email",
      "Phone",
      "Occupation",
      "Date of birth",
      "Address",
      "City",
      "State",
      "Interests",
      "Status",
      "Joined at",
    ];
    const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = members.map((member) =>
      [
        member.memberNumber,
        member.userId,
        member.fullName,
        member.email,
        member.phone,
        member.occupation,
        member.dob,
        member.address,
        member.city,
        member.state,
        member.interests?.join("; "),
        member.status,
        member.joinedAt,
      ].map(escape).join(","),
    );
    const csv = [headers.map(escape).join(","), ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `community-members-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-maroon">Community members</h1>
          <p className="text-maroon/50 text-sm mt-1">
            Members and subscriptions are separate from merchant accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={loading || members.length === 0}
          className="inline-flex items-center gap-2 px-5 py-3 bg-maroon text-ivory rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-maroon transition-colors disabled:opacity-40"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Stat label="Members" value={members.length} />
        <Stat label="Subscriptions" value={subscriptions.length} />
      </div>
      <section className="bg-white border border-gold/10 rounded-xl overflow-hidden mb-8">
        <h2 className="font-display text-xl text-maroon p-6 pb-3">Members</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-maroon/40 border-b border-maroon/10 bg-ivory/60">
              <th className="p-4">Member</th>
              <th>Member ID</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-maroon/50">
                  Loading...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-maroon/50">
                  No members yet.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.$id}
                  onClick={() => setSelectedMember(member)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelectedMember(member);
                  }}
                  tabIndex={0}
                  role="button"
                  className="border-b border-maroon/5 cursor-pointer hover:bg-ivory/60 focus:outline-none focus:bg-ivory/60"
                >
                  <td className="p-4">
                    <div className="font-semibold text-maroon">{member.fullName}</div>
                    <div className="text-[11px] text-maroon/50">{member.occupation}</div>
                  </td>
                  <td className="text-gold font-semibold">{member.memberNumber}</td>
                  <td>
                    <div>{member.email}</div>
                    <div className="text-xs text-maroon/50">{member.phone}</div>
                  </td>
                  <td>
                    <span className="text-[10px] uppercase tracking-widest rounded-full px-2 py-1 bg-green-100 text-green-700">
                      {member.status}
                    </span>
                  </td>
                  <td className="text-maroon/50 text-xs">
                    {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-IN") : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
      <section className="bg-white border border-gold/10 rounded-xl overflow-hidden">
        <h2 className="font-display text-xl text-maroon p-6 pb-3">Subscriptions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-maroon/40 border-b border-maroon/10 bg-ivory/60">
              <th className="p-4">Member ID</th>
              <th>Tier</th>
              <th>Amount</th>
              <th>Period</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-maroon/50">
                  No subscriptions yet.
                </td>
              </tr>
            ) : (
              subscriptions.map((subscription) => (
                <tr key={subscription.$id} className="border-b border-maroon/5">
                  <td className="p-4 text-gold font-semibold">
                    {members.find((member) => member.$id === subscription.memberId)?.memberNumber ||
                      subscription.memberId}
                  </td>
                  <td>{subscription.tier || subscription.planName}</td>
                  <td>
                    {subscription.currency || "INR"} {subscription.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="text-xs text-maroon/60">
                    {new Date(
                      subscription.startedAt || subscription.startsAt || Date.now(),
                    ).toLocaleDateString("en-IN")}{" "}
                    {subscription.expiresAt || subscription.endsAt
                      ? `- ${new Date(
                          (subscription.expiresAt || subscription.endsAt)!,
                        ).toLocaleDateString("en-IN")}`
                      : ""}
                  </td>
                  <td>
                    <span className="text-[10px] uppercase tracking-widest rounded-full px-2 py-1 bg-green-100 text-green-700">
                      {subscription.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <Dialog open={Boolean(selectedMember)} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="bg-ivory border-gold/20 max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-3xl text-maroon flex items-center gap-3">
                  <span className="size-10 rounded-full bg-maroon text-gold flex items-center justify-center"><UserRound size={20} /></span>
                  {selectedMember.fullName}
                </DialogTitle>
                <DialogDescription className="text-maroon/55">
                  {selectedMember.memberNumber} · Community member details
                </DialogDescription>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-5 bg-white rounded-xl border border-gold/10 p-6 text-sm">
                <Detail label="Email" value={selectedMember.email} icon={<Mail size={14} />} />
                <Detail label="Phone" value={selectedMember.phone} icon={<Phone size={14} />} />
                <Detail label="Occupation" value={selectedMember.occupation} />
                <Detail label="Date of birth" value={formatMemberDate(selectedMember.dob)} />
                <Detail label="Status" value={selectedMember.status} />
                <Detail label="Joined" value={formatMemberDate(selectedMember.joinedAt)} />
                <Detail label="Address" value={[selectedMember.address, selectedMember.city, selectedMember.state].filter(Boolean).join(", ")} className="sm:col-span-2" />
                <Detail label="Interests" value={selectedMember.interests?.join(", ") || "-"} className="sm:col-span-2" />
                {selectedMember.about && <Detail label="About" value={selectedMember.about} className="sm:col-span-2" />}
              </div>
              <div className="text-xs text-maroon/45 break-all">Account ID: {selectedMember.userId}</div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gold/10 rounded-xl p-6">
      <p className="text-[10px] uppercase tracking-widest text-maroon/40">{label}</p>
      <p className="font-display text-3xl text-maroon mt-2">{value}</p>
    </div>
  );
}

function Detail({ label, value, icon, className = "" }: { label: string; value: string; icon?: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] uppercase tracking-widest text-maroon/40 flex items-center gap-1">{icon}{label}</p>
      <p className="text-maroon mt-1 break-words">{value || "-"}</p>
    </div>
  );
}

function formatMemberDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
