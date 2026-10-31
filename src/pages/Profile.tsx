import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowUpRight,
  BadgeCheck,
  Copy,
  Gift,
  Loader2,
  LogOut,
  Share2,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getCommunityPlan } from "@/lib/community-membership";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import {
  createBazaarRedemption,
  getMemberSubscription,
  getReferralWallet,
  type ReferralWallet,
} from "@/lib/referrals-api";

export default function ProfilePage() {
  const { user, member, loading: authLoading, logout } = useAuth();
  const [subscription, setSubscription] =
    useState<Awaited<ReturnType<typeof getMemberSubscription>>>(null);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [wallet, setWallet] = useState<ReferralWallet | null>(null);
  const [walletError, setWalletError] = useState("");
  const [walletLoading, setWalletLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (member)
      getMemberSubscription()
        .then(setSubscription)
        .catch(() => setSubscription(null));
  }, [member]);

  useEffect(() => {
    if (!member) {
      setWallet(null);
      setWalletLoading(false);
      return;
    }
    setWalletLoading(true);
    getReferralWallet()
      .then((result) => {
        setWallet(result);
        setWalletError("");
      })
      .catch((error) => {
        setWalletError(error instanceof Error ? error.message : "Could not load your referral wallet.");
        toast.error(error instanceof Error ? error.message : "Could not load your referral wallet.");
      })
      .finally(() => setWalletLoading(false));
  }, [member]);

  const copyReferral = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied.`);
    } catch {
      toast.error(`Could not copy your ${label.toLowerCase()}.`);
    }
  };

  const redeemPoints = async () => {
    setRedeeming(true);
    try {
      const reward = await createBazaarRedemption();
      toast.success(`Reward issued: ${reward.token}. ${reward.points} points redeemed.`);
      setWallet(await getReferralWallet());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create a Bazaar reward.");
    } finally {
      setRedeeming(false);
    }
  };

  const shareReferral = async () => {
    if (!wallet) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join Pink Saathi",
          text: `Join Pink Saathi with my referral link: ${wallet.referralUrl}`,
          url: wallet.referralUrl,
        });
        return;
      }
      await copyReferral(wallet.referralUrl, "Referral link");
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Could not share your referral link.");
      }
    }
  };

  useEffect(() => {
    if (!member?.memberNumber) {
      setQrCodeUrl(null);
      return;
    }

    QRCode.toDataURL(`${member.memberNumber}`, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 240,
      color: { dark: "#5b0b2b", light: "#faf7f2" },
    })
      .then(setQrCodeUrl)
      .catch(() => setQrCodeUrl(null));
  }, [member]);

  const share = async () => {
    if (!member) return;
    setSharing(true);
    try {
      const blob = await createMemberCardImage();
      const file = new File([blob], `pink-shakti-${member.memberNumber}.png`, {
        type: "image/png",
      });
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({
          title: "PINK SHAKTI Pink Saathi card",
          text: "Pink Saathi member card",
          files: [file],
        });
        return;
      }
    } catch (error) {
      if (!(error instanceof Error) || error.name !== "AbortError") {
        toast.error("Could not create the Pink Saathi card image.");
      }
    } finally {
      setSharing(false);
    }
  };

  const downloadCard = async () => {
    if (!member) return;
    setSharing(true);
    try {
      const blob = await createMemberCardImage();
      const link = document.createElement("a");
      link.download = `pink-shakti-${member.memberNumber}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      setCopied(true);
      toast.success("Member card image downloaded");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not download the Pink Saathi card image.");
    } finally {
      setSharing(false);
    }
  };

  async function createMemberCardImage() {
    const card = document.getElementById("member-card");
    if (!card) throw new Error("Member card is unavailable");
    const dataUrl = await toPng(card, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#5b0b2b",
    });
    const response = await fetch(dataUrl);
    return response.blob();
  }

  if (authLoading) return <LoadingScreen label="Loading your profile..." />;
  if (!user) return <Navigate to="/login?from=/profile" replace />;

  return (
    <main className="min-h-screen bg-ivory pb-20">
      <section className="relative overflow-hidden bg-maroon px-5 pb-16 pt-12 text-ivory sm:px-8 sm:pb-20 sm:pt-16">
        <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full border border-gold/15" />
        <div className="pointer-events-none absolute -bottom-40 left-[12%] size-96 rounded-full border border-ivory/10" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.32em] text-gold">
              Pink Saathi · My account
            </p>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl">Your profile</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/65">
              Your membership, community card and referral rewards — all in one place.
            </p>
          </div>
          <button
            onClick={async () => {
              await logout();
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ivory/20 px-4 py-2.5 text-xs text-ivory/75 transition-colors hover:border-gold hover:text-gold"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </section>
      <div className="relative mx-auto -mt-7 max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        {!member ? (
          <div className="rounded-3xl border border-gold/15 bg-white p-8 text-center shadow-lg shadow-maroon/5 sm:p-12">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold">
              <BadgeCheck size={26} />
            </div>
            <h2 className="mb-3 font-display text-2xl text-maroon">Your member card is waiting</h2>
            <p className="mb-6 text-sm text-maroon/60">
              Join the community to create your digital PINK SHAKTI card.
            </p>
            <Link
              to="/join"
              className="inline-flex bg-maroon text-ivory rounded-full px-7 py-3 text-[11px] font-bold uppercase tracking-widest"
            >
              Join the community
            </Link>
          </div>
        ) : (
          <>
          <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div
              id="member-card"
              className="relative aspect-[1.586/1] min-h-[250px] overflow-hidden rounded-[1.5rem] border border-gold/50 bg-maroon p-6 text-ivory shadow-xl shadow-maroon/15 sm:p-8"
            >
              <div className="absolute -right-20 -top-24 size-64 rounded-full border border-gold/30" />
              <div className="absolute -right-8 -bottom-32 size-72 rounded-full border border-blush/20" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-xl tracking-[0.18em] text-ivory">PINK SHAKTI</p>
                  <p className="text-[9px] uppercase tracking-[0.32em] text-gold mt-1">
                    360° women ecosystem
                  </p>
                </div>
                <div className="rounded-full border border-gold/50 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-gold">
                  Pink Saathi
                </div>
              </div>
              <div className="relative mt-10 sm:mt-12 max-w-[62%]">
                <p className="text-[9px] uppercase tracking-[0.25em] text-ivory/55 mb-2">
                  Cardholder
                </p>
                <h2 className="font-display text-2xl sm:text-3xl leading-tight">
                  {member.fullName}
                </h2>
                <p className="text-gold mt-2 tracking-[0.12em] text-xs sm:text-sm break-all">
                  {member.memberNumber}
                </p>
              </div>
              <div className="absolute bottom-5 left-6 right-6 sm:left-8 sm:right-8 flex items-end justify-between gap-4">
                <div className="text-[9px] uppercase tracking-[0.18em] text-ivory/55">
                  <p>{getCommunityPlan(subscription?.planId || "aarambh").name} Pink Saathi</p>
                  {/* <p className="mt-1">Member {member.memberNumber}</p> */}
                </div>
              </div>
              {qrCodeUrl && (
                <div className="absolute right-6 bottom-14 rounded-lg bg-ivory p-1.5 shadow-lg sm:right-8">
                  <img
                    src={qrCodeUrl}
                    alt="Scannable subscription ID QR code"
                    className="size-16 sm:size-20"
                  />
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-gold/15 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                  <BadgeCheck size={21} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold">
                    Membership
                  </p>
                  <h2 className="font-display text-2xl text-maroon">Pink Saathi details</h2>
                </div>
              </div>
              <div className="divide-y divide-maroon/5 text-sm">
                <Detail
                  label="Current plan"
                  value={getCommunityPlan(subscription?.planId || "aarambh").name}
                />
                <Detail label="Email" value={member.email} />
                <Detail label="Phone" value={member.phone} />
                <Detail label="Occupation" value={member.occupation} />
                <Detail
                  label="Member since"
                  value={member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-IN") : "—"}
                />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={share}
                  disabled={sharing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-maroon px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold hover:text-maroon disabled:opacity-60"
                >
                  {sharing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
                  {sharing ? "Preparing..." : copied ? "Card downloaded" : "Share card"}
                </button>
                <button
                  onClick={downloadCard}
                  disabled={sharing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-maroon/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-maroon transition-colors hover:border-gold hover:text-gold disabled:opacity-60"
                >
                  Download card
                </button>
              </div>
            </div>
          </div>
            <section className="overflow-hidden rounded-3xl border border-gold/20 bg-white shadow-sm">
              <div className="relative flex flex-col gap-5 overflow-hidden bg-maroon p-6 text-ivory sm:flex-row sm:items-start sm:justify-between sm:p-8">
                <div className="pointer-events-none absolute -right-8 -top-20 size-56 rounded-full border border-gold/20" />
                <div>
                  <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-gold">
                    <Sparkles size={13} /> Pink Saathi community
                  </p>
                  <h2 className="font-display text-3xl text-ivory">Share the sisterhood</h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ivory/65">
                    Invite a woman to join Pink Saathi. When her membership qualifies, your referral earns points toward Sakhi Bazaar rewards.
                  </p>
                </div>
                <div className="relative flex min-w-40 items-center gap-3 rounded-2xl border border-gold/25 bg-white/5 px-5 py-4 sm:flex-col sm:items-start">
                  <WalletCards className="text-gold" size={19} />
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.19em] text-ivory/55">
                      Points available
                    </p>
                    <p className="font-display text-3xl leading-none text-ivory">
                      {wallet?.availablePoints.toLocaleString("en-IN") ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-7 p-5 sm:p-8">
              {wallet ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                    <div className="min-w-0 rounded-2xl border border-gold/20 bg-ivory/70 px-4 py-3">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-maroon/45">Your referral code</p>
                      <p className="mt-1 break-all font-mono text-xl font-bold tracking-[0.12em] text-maroon">{wallet.code}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyReferral(wallet.code, "Referral code")}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-maroon transition-colors hover:bg-maroon hover:text-ivory"
                    >
                      <Copy size={14} /> Copy code
                    </button>
                    <button
                      type="button"
                      onClick={shareReferral}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-maroon/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-maroon transition-colors hover:border-gold hover:text-gold"
                    >
                      <Share2 size={14} /> Share link
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <WalletStat label="Total earned" value={wallet.totalEarned} />
                    <WalletStat label="Total redeemed" value={wallet.totalRedeemed} />
                    <WalletStat
                      label="Qualified / pending referrals"
                      value={`${wallet.referrals.filter((item) => item.status === "qualified").length} / ${wallet.pendingReferrals}`}
                    />
                  </div>
                  <h3 className="mb-3 mt-8 font-display text-xl text-maroon">Referral activity</h3>
                  {wallet.referrals.length ? (
                    <div className="divide-y divide-maroon/5 rounded-2xl border border-maroon/5 px-4">
                      {wallet.referrals.slice(0, 6).map((referral) => (
                        <div
                          key={referral.$id}
                          className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                        >
                          <div>
                            <p className="font-medium text-maroon">{referral.planName}</p>
                            <p className="mt-0.5 text-xs text-maroon/45">
                              {new Date(referral.createdAt).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-maroon">+{referral.pointsAwarded} pts</p>
                            <p className="text-[10px] capitalize text-maroon/45">{referral.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-maroon/15 px-5 py-7 text-center">
                      <p className="font-display text-lg text-maroon">Your first invite is waiting</p>
                      <p className="mt-1 text-xs text-maroon/50">
                        Share your link to start your referral journey.
                      </p>
                    </div>
                  )}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <h3 className="flex items-center gap-2 font-display text-xl text-maroon">
                      <Gift className="text-gold" size={18} /> Sakhi Bazaar rewards
                    </h3>
                    <button
                      type="button"
                      onClick={redeemPoints}
                      disabled={redeeming}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-maroon px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold hover:text-maroon disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {redeeming ? <Loader2 size={14} className="animate-spin" /> : <Gift size={14} />}
                      Redeem points
                    </button>
                  </div>
                  {wallet.redemptions.length > 0 ? (
                    <div className="mt-3 divide-y divide-maroon/5 rounded-2xl border border-maroon/5 px-4">
                      {wallet.redemptions.slice(0, 4).map((redemption) => (
                        <div key={redemption.$id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                          <div className="min-w-0">
                            <p className="break-all font-mono font-semibold text-maroon">{redemption.token}</p>
                            <p className="mt-0.5 text-xs text-maroon/50">
                              {redemption.points} pts · ₹{redemption.discount} off ·{" "}
                              <span className="capitalize">{redemption.status}</span>
                            </p>
                          </div>
                          {redemption.status === "issued" && (
                            <button
                              type="button"
                              onClick={() => copyReferral(redemption.token, "Redemption code")}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon transition-colors hover:text-gold"
                            >
                              <Copy size={13} /> Copy
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-maroon/50 mt-3">No redemption codes yet.</p>
                  )}
                  <h3 className="mb-3 mt-8 font-display text-xl text-maroon">Points activity</h3>
                  {wallet.transactions.filter((item) => item.type !== "lock").length ? (
                    <div className="divide-y divide-maroon/5 rounded-2xl border border-maroon/5 px-4">
                      {wallet.transactions.filter((item) => item.type !== "lock").slice(0, 5).map((transaction) => (
                        <div key={transaction.$id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                          <p className="text-maroon/65">{transaction.description}</p>
                          <p className="shrink-0 font-semibold text-maroon">
                            {transaction.points < 0 || transaction.type === "debit" ? "−" : "+"}
                            {Math.abs(transaction.points)} pts
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-maroon/50">Your points activity will appear here.</p>
                  )}
                </>
              ) : (
                <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-ivory/70 px-5 py-5 text-sm text-maroon/60">
                  {walletLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-gold" />
                      Loading your referral wallet...
                    </>
                  ) : (
                    <>
                      <p className="flex-1">{walletError || "Referral wallet is not available."}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setWalletLoading(true);
                          getReferralWallet()
                            .then((result) => {
                              setWallet(result);
                              setWalletError("");
                            })
                            .catch((error) =>
                              setWalletError(
                                error instanceof Error
                                  ? error.message
                                  : "Could not load your referral wallet.",
                              ),
                            )
                            .finally(() => setWalletLoading(false));
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-maroon transition-colors hover:text-gold"
                      >
                        Try again <ArrowUpRight size={14} />
                      </button>
                    </>
                  )}
                </div>
              )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-maroon/40">{label}</p>
      <p className="break-all text-right text-sm text-maroon">{value}</p>
    </div>
  );
}

function WalletStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-gold/10 bg-ivory/70 p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-maroon/45">{label}</p>
      <p className="mt-1 font-display text-2xl text-maroon">
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
      </p>
    </div>
  );
}

function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center text-maroon/60 text-sm">
        <Loader2 className="size-7 animate-spin text-gold mx-auto mb-3" />
        {label}
      </div>
    </div>
  );
}
