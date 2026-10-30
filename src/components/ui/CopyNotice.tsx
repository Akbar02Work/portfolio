export const CopyNotice = ({ label, hint }: { label: string; hint: string }) => (
  <div role="status" className="my-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-4 py-3 text-sm">
    <p className="font-semibold text-volt-ink dark:text-volt">{label}</p>
    <p className="mt-1 text-neutral-600 dark:text-neutral-300">{hint}</p>
  </div>
);
