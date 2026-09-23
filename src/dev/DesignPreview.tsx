/** TEMPORARY design preview panel — see designPreviewStore.ts. */
import { useEffect, useState } from "react";
import { setDesignChoice, useDesignChoice, type LogoVariant } from "./designPreviewStore";

type FontCandidate = {
  id: string;
  label: string;
  /** Variable font: file stem in /fonts/preview and weight range. */
  variable?: { file: string; weights: string };
  /** Static font: file stem pattern `${file}-${subset}-${weight}-normal`. */
  staticFile?: { file: string; weights: number[] };
};

const SANS: FontCandidate[] = [
  { id: "inter", label: "Inter (now)" },
  { id: "onest", label: "Onest", variable: { file: "onest", weights: "100 900" } },
  { id: "geist", label: "Geist", variable: { file: "geist", weights: "100 900" } },
  { id: "manrope", label: "Manrope", variable: { file: "manrope", weights: "200 800" } },
  { id: "plex", label: "IBM Plex Sans", variable: { file: "ibm-plex-sans", weights: "100 700" } },
  { id: "golos", label: "Golos Text", variable: { file: "golos-text", weights: "400 900" } },
  { id: "geologica", label: "Geologica", variable: { file: "geologica", weights: "100 900" } },
];

const MONO: FontCandidate[] = [
  { id: "jetbrains", label: "JetBrains Mono (now)" },
  { id: "plex-mono", label: "IBM Plex Mono", staticFile: { file: "ibm-plex-mono", weights: [400, 500, 600, 700] } },
  { id: "geist-mono", label: "Geist Mono", variable: { file: "geist-mono", weights: "100 900" } },
  { id: "roboto-mono", label: "Roboto Mono", variable: { file: "roboto-mono", weights: "100 700" } },
  { id: "fira-code", label: "Fira Code", variable: { file: "fira-code", weights: "300 700" } },
  { id: "martian-mono", label: "Martian Mono", variable: { file: "martian-mono", weights: "100 800" } },
];

const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const CYRILLIC = "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116";

const faces = (family: string, font: FontCandidate): string => {
  const subsets: Array<[string, string]> = [["latin", LATIN], ["cyrillic", CYRILLIC]];
  if (font.variable) {
    const { file, weights } = font.variable;
    return subsets
      .map(([subset, range]) =>
        `@font-face{font-family:"${family}";font-style:normal;font-weight:${weights};font-display:swap;src:url("/fonts/preview/${file}-${subset}-wght-normal.woff2") format("woff2");unicode-range:${range}}`)
      .join("\n");
  }
  if (font.staticFile) {
    const { file, weights } = font.staticFile;
    return weights
      .flatMap((weight) =>
        subsets.map(([subset, range]) =>
          `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:swap;src:url("/fonts/preview/${file}-${subset}-${weight}-normal.woff2") format("woff2");unicode-range:${range}}`))
      .join("\n");
  }
  return "";
};

const buildCss = (sansId: string, monoId: string): string => {
  const sans = SANS.find((font) => font.id === sansId);
  const mono = MONO.find((font) => font.id === monoId);
  const parts: string[] = [];
  if (sans && (sans.variable || sans.staticFile)) {
    parts.push(faces("Preview Sans", sans));
    parts.push('html,body,.font-sans{font-family:"Preview Sans",ui-sans-serif,system-ui,sans-serif !important}');
  }
  if (mono && (mono.variable || mono.staticFile)) {
    parts.push(faces("Preview Mono", mono));
    parts.push('.font-mono,code,pre{font-family:"Preview Mono",ui-monospace,monospace !important}');
  }
  return parts.join("\n");
};

const optionClass = (active: boolean) =>
  `rounded-md border px-2 py-1 text-left text-[0.75rem] leading-tight transition-colors ${
    active
      ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
      : "border-gray-200 text-gray-700 hover:border-gray-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
  }`;

const Row = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <p className="text-[0.625rem] uppercase tracking-[0.14em] text-gray-500 dark:text-slate-400">{title}</p>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);

const DesignPreview = () => {
  const choice = useDesignChoice();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let style = document.getElementById("design-preview-fonts") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "design-preview-fonts";
      document.head.appendChild(style);
    }
    style.textContent = buildCss(choice.sans, choice.mono);
  }, [choice.sans, choice.mono]);

  const logos: Array<[LogoVariant, string]> = [["tag", "<AKA_/PORTFOLIO/>"], ["akbar", "akbar_"]];

  return (
    <div
      className="fixed bottom-4 left-4 z-[70] w-[19rem] rounded-2xl border border-gray-200 bg-white/95 p-3 text-gray-900 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-950/95 dark:text-white"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.75rem] font-semibold">Design preview · temporary</p>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-md px-2 py-0.5 text-[0.75rem] text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>
      {open && (
        <div className="mt-3 space-y-3">
          <Row title="Logo">
            {logos.map(([id, label]) => (
              <button key={id} type="button" className={optionClass(choice.logo === id)} onClick={() => setDesignChoice({ logo: id })}>
                <span className="font-mono">{label}</span>
              </button>
            ))}
          </Row>
          <Row title="Main font (EN + RU)">
            {SANS.map((font) => (
              <button key={font.id} type="button" className={optionClass(choice.sans === font.id)} onClick={() => setDesignChoice({ sans: font.id })}>
                {font.label}
              </button>
            ))}
          </Row>
          <Row title="Mono font (labels)">
            {MONO.map((font) => (
              <button key={font.id} type="button" className={optionClass(choice.mono === font.id)} onClick={() => setDesignChoice({ mono: font.id })}>
                {font.label}
              </button>
            ))}
          </Row>
          <p className="text-[0.6875rem] leading-snug text-gray-500 dark:text-slate-400">
            Switch to RU to judge Cyrillic. Open with ?design=0 to hide this panel.
          </p>
        </div>
      )}
    </div>
  );
};

export default DesignPreview;
