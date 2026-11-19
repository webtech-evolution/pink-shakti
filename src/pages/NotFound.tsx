import { Link } from "react-router-dom";
import { usePageMeta } from "@/lib/use-page-meta";

export default function NotFoundPage() {
  usePageMeta(
    "Page Not Found | Pink Shakti",
    "This page doesn't exist. Go back to Pink Shakti's home page, membership plans or contact page.",
  );
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <meta name="robots" content="noindex" />
      <div className="max-w-md text-center">
        <p className="font-display text-7xl text-maroon">404</p>
        <h1 className="mt-4 font-display text-3xl text-maroon">
          Oops, this page took a different path
        </h1>
        <p className="mt-3 text-sm text-maroon/60">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {[
            ["/", "Go to Home"],
            ["/membership", "See Pink Saathi plans"],
            ["/contact", "Contact us"],
          ].map(([to, label], i) => (
            <Link
              key={to}
              to={to}
              className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${i === 0 ? "bg-maroon text-ivory hover:bg-gold hover:text-maroon" : "border border-maroon/20 text-maroon hover:bg-maroon hover:text-ivory"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
