import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import type { RefObject } from "react";
import { getCreativeUrl, getOldUrl } from "@/constants/siteVersions";
import { useI18n } from "@/i18n/useI18n";

type HiddenVersionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: RefObject<HTMLElement | null>;
};

export const HiddenVersionsDialog = ({ open, onOpenChange, returnFocusRef }: HiddenVersionsDialogProps) => {
  const { t } = useI18n();
  const versions = [
    { title: "Creative", description: t.hiddenVersions.creative, href: getCreativeUrl() },
    { title: "Old", description: t.hiddenVersions.old, href: getOldUrl() },
  ];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none">
          <DialogPrimitive.Content
            onOpenAutoFocus={(event) => {
              const firstChoice = event.target instanceof HTMLElement
                ? event.target.querySelector<HTMLAnchorElement>("[data-hidden-version]")
                : null;
              if (!firstChoice) return;
              event.preventDefault();
              firstChoice.focus();
            }}
            onCloseAutoFocus={(event) => {
              const target = returnFocusRef.current;
              if (!target?.isConnected) return;
              event.preventDefault();
              target.focus();
            }}
            className="relative w-full max-w-[32rem] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-background p-6 sm:p-8 shadow-2xl data-[state=open]:animate-in data-[state=open]:zoom-in-95 motion-reduce:animate-none"
          >
            <DialogPrimitive.Title className="pr-8 text-heading-3 text-gray-900 dark:text-white">
              {t.hiddenVersions.title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-3 text-body-sm text-gray-600 dark:text-slate-300">
              {t.hiddenVersions.description}
            </DialogPrimitive.Description>
            <div className="mt-6 space-y-3">
              {versions.map((version) => (
                <a
                  key={version.title}
                  href={version.href}
                  target="_self"
                  onClick={(event) => {
                    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                    event.preventDefault();
                    window.location.assign(version.href);
                  }}
                  data-hidden-version
                  className="group flex items-center justify-between gap-4 rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-5 transition-colors hover:border-volt-ink dark:hover:border-volt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt-ink dark:focus-visible:outline-volt"
                >
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold text-gray-900 dark:text-white group-hover:text-volt-ink dark:group-hover:text-volt">
                      {version.title}
                    </span>
                    <span className="mt-1 block text-body-sm text-gray-600 dark:text-slate-300">
                      {version.description}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 flex-none text-gray-600 dark:text-slate-300" aria-hidden="true" />
                </a>
              ))}
            </div>
            <DialogPrimitive.Close
              aria-label={t.nav.closeMenu}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-gray-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-volt-ink dark:focus-visible:outline-volt"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
