import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Gates merchant-only routes. Redirects:
 * - Not logged in → /merchant/login
 * - Logged in but no merchant record → /merchant/onboarding (unless already there)
 */
export function MerchantRoute({ requireApproved }: { requireApproved?: boolean }) {
  const { user, merchant, loading, configured } = useAuth();
  const location = useLocation();

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div className="max-w-lg">
          <h1 className="font-display text-3xl text-maroon mb-3">Backend not configured</h1>
          <p className="text-maroon/60 text-sm">
            Add your Appwrite credentials to <code>.env</code>. See <code>APPWRITE_SETUP.md</code>.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-maroon/20 border-t-maroon animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/merchant/login" state={{ from: location }} replace />;
  }

  const onOnboarding = location.pathname.startsWith("/merchant/onboarding");
  if (!merchant && !onOnboarding) {
    return <Navigate to="/merchant/onboarding" replace />;
  }

  if (requireApproved && merchant && merchant.status !== "approved") {
    return <Navigate to="/merchant" replace />;
  }

  return <Outlet />;
}
