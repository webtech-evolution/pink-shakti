import { schemaReference } from "@/lib/schema-reference";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export default function AdminSchema() {
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-4xl text-maroon">Database schema</h1>
      <p className="text-maroon/50 text-sm mt-1 mb-8">
        Recreate these collections exactly as listed, then the membership pages and this panel work again.
      </p>

      {schemaReference.map((c) => (
        <section key={c.id} className="bg-white border border-gold/10 rounded-xl p-8 mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-2xl text-maroon">{c.title}</h2>
              <button
                onClick={() => copy(c.id)}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-maroon/50 hover:text-gold mt-1"
              >
                <Copy size={11} /> {c.id}
              </button>
            </div>
          </div>

          <p className="text-sm text-maroon/70 leading-relaxed mb-4">{c.purpose}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-maroon/40 border-b border-maroon/10 bg-ivory/60">
                  <th className="p-3">Attribute</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Size / values</th>
                  <th className="p-3">Required</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {c.attributes.map((a) => (
                  <tr key={a.key} className="border-b border-maroon/5 align-top">
                    <td className="p-3 font-mono text-[13px] text-maroon">{a.key}</td>
                    <td className="p-3 text-maroon/70">{a.type}</td>
                    <td className="p-3 text-maroon/60">{a.size || "—"}</td>
                    <td className="p-3">
                      {a.required ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <span className="text-maroon/30">—</span>
                      )}
                    </td>
                    <td className="p-3 text-maroon/50 text-[13px]">{a.notes || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6 text-[13px]">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-maroon/40 mb-2">Indexes</p>
              <ul className="space-y-1 text-maroon/70">
                {c.indexes.map((i) => (
                  <li key={i} className="font-mono text-[12px]">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-maroon/40 mb-2">Permissions</p>
              <p className="text-maroon/70">{c.permissions}</p>
              <p className="text-[10px] uppercase tracking-widest text-maroon/40 mt-4 mb-2">
                Environment variable
              </p>
              <button
                onClick={() => copy(`${c.envVar}=${c.id}`)}
                className="font-mono text-[12px] text-maroon/70 hover:text-gold text-left"
              >
                {c.envVar}={c.id}
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
