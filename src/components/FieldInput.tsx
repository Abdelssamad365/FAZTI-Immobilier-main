import type { FieldDef, FieldValue } from "@/lib/fields";
import { TRI_OPTIONS } from "@/lib/fields";
import { useI18n } from "@/lib/i18n";

const chip = (on: boolean) =>
  `rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${on ? "border-foreground bg-foreground text-deep-foreground" : "border-border bg-card text-primary hover:border-ring"}`;

/** One editor for any configured field (publish form). */
export function FieldInput({ f, value, onChange }: { f: FieldDef; value: FieldValue | undefined; onChange: (v: FieldValue | undefined) => void }) {
  const { lang } = useI18n();
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-bold text-foreground">{f.label[lang]}{f.unit ? ` (${f.unit[lang]})` : ""}</div>
      {f.type === "number" ? (
        <input type="number" min={0} value={typeof value === "number" ? value : ""} onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          className="h-9 w-32 rounded-md border border-border bg-card px-2 text-sm outline-none focus:border-ring" />
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {(f.type === "tri" ? TRI_OPTIONS : f.options ?? []).map((o) => {
            const arr = Array.isArray(value) ? value : [];
            const on = f.type === "multi" ? arr.includes(o.value) : value === o.value;
            return (
              <button type="button" key={o.value} aria-pressed={on} className={chip(on)}
                onClick={() => f.type === "multi" ? onChange(on ? arr.filter((x) => x !== o.value) : [...arr, o.value]) : onChange(on ? undefined : o.value)}>
                {o[lang]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { chip };
