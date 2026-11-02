import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoAsset from "@/assets/logo.webp";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Pink Saathi", to: "/membership" },
  { label: "Events", to: "/events" },
  { label: "Sakhi Bazaar", to: "/sakhi-bazaar" },
  { label: "Stories", to: "/stories" },
  { label: "Contact Us", to: "/contact" },
  /* Temporarily hidden while the marketplace is in coming-soon mode: My Orders */
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const isScrollingUp = currentY < lastScrollY.current;
      const shouldShow = isScrollingUp || currentY < 80 || mobileOpen;

      setShowHeader(shouldShow);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transform transition-transform duration-300 ease-out ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="mx-3 sm:mx-4 lg:mx-8 relative my-4">
          <nav className="bg-[#faf7f2]/80 backdrop-blur-md border border-gold/10 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <img
                src={logoAsset}
                alt="PINK SHAKTI"
                className="h-14 sm:h-16 w-auto shrink-0 contrast-125"
              />
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="font-display text-lg lg:text-xl tracking-widest uppercase text-[#b40d4a] font-semibold leading-tight truncate">
                  Pink Shakti
                </span>
                <span className="text-[11px] tracking-[0.32em] uppercase text-maroon font-semibold -mt-0.5 truncate">
                  Ecosystem
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-7 min-w-0">
              {navLinks.slice(0, 8).map((link, i) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.12em] lg:tracking-[0.15em] hover:text-gold transition-colors gold-underline whitespace-nowrap ${
                      i >= 5 ? "hidden lg:inline-block" : ""
                    } ${isActive ? "text-gold" : "text-maroon/70"}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                to="/membership"
                className="hidden md:inline-flex px-4 lg:px-6 py-2.5 bg-maroon text-ivory text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gold hover:text-maroon transition-all duration-300 whitespace-nowrap"
              >
                Join Movement
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-maroon"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.7 }}
                style={{ willChange: "transform, opacity", transformOrigin: "top center" }}
                className="md:hidden absolute left-0 right-0 top-full mt-2"
              >
                <div className="bg-[#faf7f2]/95 backdrop-blur-md border border-gold/10 rounded-2xl shadow-xl">
                  <motion.div
                    className="p-6 flex flex-col gap-1"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{
                      open: { transition: { staggerChildren: 0.03, delayChildren: 0.04 } },
                      closed: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
                    }}
                  >
                    {navLinks.map((link) => (
                      <motion.div
                        key={link.to}
                        variants={{
                          open: {
                            opacity: 1,
                            y: 0,
                            transition: { type: "spring", stiffness: 320, damping: 26 },
                          },
                          closed: { opacity: 0, y: -6 },
                        }}
                      >
                        <NavLink
                          to={link.to}
                          end={link.to === "/"}
                          onClick={() => setMobileOpen(false)}
                          className={({ isActive }) =>
                            `block text-sm font-semibold uppercase tracking-[0.15em] hover:text-gold transition-colors py-2 ${
                              isActive ? "text-gold" : "text-maroon/70"
                            }`
                          }
                        >
                          {link.label}
                        </NavLink>
                      </motion.div>
                    ))}
                    <motion.div
                      variants={{
                        open: {
                          opacity: 1,
                          y: 0,
                          transition: { type: "spring", stiffness: 320, damping: 26 },
                        },
                        closed: { opacity: 0, y: -6 },
                      }}
                    >
                      <Link
                        to="/membership"
                        onClick={() => setMobileOpen(false)}
                        className="mt-3 block text-center px-6 py-3 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] rounded-full"
                      >
                        Join Movement
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      <div className="h-28 sm:h-32" aria-hidden="true" />
    </>
  );
}
