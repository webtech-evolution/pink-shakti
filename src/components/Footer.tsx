import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ivory text-maroon border-t-2 border-gold pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4">
            <div className="flex flex-col mb-6">
              <span className="font-display text-2xl tracking-widest uppercase font-semibold leading-tight">
                Pink Shakti
              </span>
              <span className="text-xs tracking-[0.4em] uppercase text-rose">Ecosystem</span>
            </div>
            <p className="text-maroon/70 text-sm leading-relaxed max-w-xs">
              India's premier ecosystem for women empowerment, uniting leaders to create a stronger,
              more equitable future.
            </p>
            <div className="flex gap-4 mt-8">
              <a
                href="https://instagram.com/pinkshaktiofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-full border border-gold/60 text-gold flex items-center justify-center hover:bg-rose hover:text-ivory hover:border-rose transition-all"
              >
                <Instagram size={16} />
              </a>
              {/* <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
              >
                <Youtube size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
              >
                <Facebook size={16} />
              </a> */}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold uppercase text-[11px] tracking-[0.2em] text-gold mb-8">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm text-maroon/70">
              <li>
                <Link to="/about" className="hover:text-rose transition-colors">
                  Our Vision
                </Link>
              </li>
              <li>
                <Link to="/pillars" className="hover:text-rose transition-colors">
                  Our Pillars
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-rose transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-rose transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/stories" className="hover:text-rose transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link to="/circles" className="hover:text-rose transition-colors">
                  Community Circles
                </Link>
              </li>
              <li>
                <Link to="/showcase" className="hover:text-rose transition-colors">
                  Showcase & Stage
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-rose transition-colors">
                  Sell with Sakhi Bazaar
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-rose transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/partner" className="hover:text-rose transition-colors">
                  Partner & Sponsor
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-rose transition-colors">
                  Resources
                </Link>
              </li>
              {/* <li>
                <Link to="/events" className="hover:text-gold transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link to="/awards" className="hover:text-gold transition-colors">
                  Awards Nomination
                </Link>
              </li>
              <li>
                <Link to="/media" className="hover:text-gold transition-colors">
                  Media Gallery
                </Link>
              </li> */}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold uppercase text-[11px] tracking-[0.2em] text-gold mb-8">
              Pink Saathi
            </h4>
            <ul className="space-y-4 text-sm text-maroon/70">
              {/* <li>
                <Link to="/membership" className="hover:text-rose transition-colors">
                  Join Portal
                </Link>
              </li> */}
              <li>
                <Link to="/membership" className="hover:text-gold transition-colors">
                  Pink Saathi Benefits
                </Link>
              </li>
              {/* <li>
                <Link to="/membership" className="hover:text-gold transition-colors">
                  Corporate Plans
                </Link>
              </li> */}
              {/* <li>
                <Link to="/partners" className="hover:text-gold transition-colors">
                  Partner Directory
                </Link>
              </li> */}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-bold uppercase text-[11px] tracking-[0.2em] text-gold mb-8">
              Newsletter
            </h4>
            <p className="text-sm text-maroon/70 mb-6">
              Stay updated with the latest in our ecosystem — events, stories, and exclusive
              opportunities.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent border-b border-gold/50 px-0 py-3 text-sm text-maroon placeholder:text-maroon/40 focus:outline-none focus:border-rose"
              />
              <button
                type="submit"
                className="px-6 py-3 border-b border-gold text-rose font-bold uppercase text-[11px] tracking-widest hover:text-ivory hover:bg-rose transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gold/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-maroon/50 font-semibold">
            &copy; 2026 PINK SHAKTI. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              to="/privacy"
              className="text-[10px] uppercase tracking-[0.2em] text-maroon/50 font-semibold hover:text-rose transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-[10px] uppercase tracking-[0.2em] text-maroon/50 font-semibold hover:text-rose transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/csr"
              className="text-[10px] uppercase tracking-[0.2em] text-maroon/50 font-semibold hover:text-rose transition-colors"
            >
              CSR Integration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
