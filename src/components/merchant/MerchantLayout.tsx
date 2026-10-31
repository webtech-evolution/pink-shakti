import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, LogOut, Store, Package, ShoppingCart } from "lucide-react";

const links = [
  { to: "/merchant", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/merchant/products", label: "Products", icon: Package },
  { to: "/merchant/orders", label: "Orders", icon: ShoppingCart },
];


export function MerchantLayout() {
  const { user, merchant, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ivory">
      <aside className="fixed inset-y-0 left-0 w-64 bg-maroon text-ivory flex flex-col p-6 z-40">
        <Link to="/" className="font-display text-xl tracking-widest mb-1">
          PINK SHAKTI
        </Link>
        <span className="text-[10px] tracking-[0.3em] text-gold uppercase mb-10">Merchant</span>

        <nav className="flex flex-col gap-1 flex-1">
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
          <p className="text-xs truncate">{user?.email}</p>
          {merchant?.businessName && (
            <p className="text-[11px] text-gold flex items-center gap-1 mt-1">
              <Store size={11} /> {merchant.businessName}
            </p>
          )}
          <button
            onClick={async () => {
              await logout();
              navigate("/merchant/login");
            }}
            className="mt-3 flex items-center gap-2 text-xs text-ivory/60 hover:text-gold"
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
