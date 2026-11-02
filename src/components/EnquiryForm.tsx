import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "textarea";
  options?: string[];
  required?: boolean;
};

export const CONTACT_EMAIL = "pinkshakti360@gmail.com";

// shortcut: no backend yet, so submissions open the visitor's email app with the form filled in; switch to the new admin API when it exists.
export function EnquiryForm({
  subject,
  fields,
  button = "Send",
  note,
}: {
  subject: string;
  fields: Field[];
  button?: string;
  note?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = fields.map((f) => `${f.label}: ${values[f.name] ?? ""}`).join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const input =
    "w-full rounded-xl border border-maroon/15 bg-white px-4 py-3 text-sm text-maroon focus:border-gold focus:outline-none";
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <label
          key={f.name}
          className={`grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-maroon/70 ${f.type === "textarea" ? "sm:col-span-2" : ""}`}
        >
          {f.label}
          {f.required && " *"}
          {f.options ? (
            <select
              required={f.required}
              className={input}
              value={values[f.name] ?? ""}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
            >
              <option value="">Select</option>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : f.type === "textarea" ? (
            <textarea
              required={f.required}
              rows={4}
              className={input}
              value={values[f.name] ?? ""}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
            />
          ) : (
            <input
              required={f.required}
              type={f.type ?? "text"}
              className={input}
              value={values[f.name] ?? ""}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
            />
          )}
        </label>
      ))}
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-8 py-4 bg-maroon text-ivory text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gold hover:text-maroon transition-all group"
        >
          {button}{" "}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="mt-3 text-xs text-maroon/50">
          {sent
            ? `Your email app should open with your details filled in. If it doesn't, write to ${CONTACT_EMAIL}.`
            : (note ?? `This opens your email app addressed to ${CONTACT_EMAIL}.`)}
        </p>
      </div>
    </form>
  );
}

export const cityOptions = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Other"];
export const iAmOptions = [
  "Home business",
  "Boutique/Fashion",
  "Food/Bakery",
  "Beauty/Wellness",
  "Artist/Handicraft",
  "Tutor/Coach",
  "Professional",
  "Student",
  "Other",
];
