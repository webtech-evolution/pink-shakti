import { Link } from "react-router-dom";
import { usePageMeta } from "@/lib/use-page-meta";

export default function NotFoundPage() {
  usePageMeta("Page Not Found | PINK SHAKTI");
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-maroon">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-maroon">Page not found</h2>
        <p className="mt-2 text-sm text-maroon/60">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-maroon px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-ivory hover:bg-gold hover:text-maroon transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
