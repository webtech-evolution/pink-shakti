import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarDays,
  LogOut,
  Users,
  LayoutDashboard,
  Crown,
  Store,
  ShoppingCart,
  BadgeCheck,
  Database,
  MessageSquareText,
  Gift,
} from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/registrations", label: "Registrations", icon: Users },
  { to: "/admin/members", label: "Community members", icon: Users },
  { to: "/admin/memberships", label: "Memberships", icon: Crown },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: BadgeCheck },
  { to: "/admin/merchants", label: "Merchants", icon: Store },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/leads", label: "Leads", icon: MessageSquareText },
  { to: "/admin/referrals", label: "Referral & rewards", icon: Gift },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ivory">
      <aside className="fixed inset-y-0 left-0 w-64 bg-maroon text-ivory flex flex-col p-6 z-40">
        <Link to="/" className="font-display text-xl tracking-widest mb-1">
          PINK SHAKTI
        </Link>
        <span className="text-[10px] tracking-[0.3em] text-gold uppercase mb-10">Admin</span>

        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-gold text-maroon font-semibold" : "text-ivory/70 hover:bg-ivory/5"
                }`
              }
            >
              <l.icon size={16} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ivory/10 pt-4 mt-4">
          <p className="text-[10px] uppercase tracking-widest text-ivory/40 mb-1">Signed in</p>
          <p className="text-xs truncate mb-3">{user?.email}</p>
          <button
            onClick={async () => {
              await logout();
              navigate("/admin/login");
            }}
            className="flex items-center gap-2 text-xs text-ivory/60 hover:text-gold"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <main className="ml-64 p-10">
        <Outlet />
      </main>
    </div>
  );
}
