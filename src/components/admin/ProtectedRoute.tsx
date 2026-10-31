import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute() {
  const { user, isAdmin, loading, configured, logout } = useAuth();
  const location = useLocation();
  const signingOut = useRef(false);

  useEffect(() => {
    if (!loading && user && !isAdmin && !signingOut.current) {
      signingOut.current = true;
      void logout();
    }
  }, [isAdmin, loading, logout, user]);

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <h1 className="font-display text-3xl text-maroon mb-4">Appwrite not configured</h1>
          <p className="text-maroon/60 text-sm leading-relaxed">
            Add your Appwrite credentials to <code>.env</code>. See <code>APPWRITE_SETUP.md</code>{" "}
            in the project root for the full setup steps.
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

  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ adminRequired: true }} replace />;
  }
  return <Outlet />;
}
