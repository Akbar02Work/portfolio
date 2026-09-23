import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpRight, Check, Copy, Eye, X } from "lucide-react";
import { useState, type MouseEvent, type ReactNode, type RefObject } from "react";
import { CONTACT_EMAIL, contactLinks, revealPhone } from "@/data/contacts";
import { useI18n } from "@/i18n/useI18n";
import { useCopyFeedback } from "@/hooks/useCopyFeedback";
import { isAllowedExternalUrl } from "@/lib/externalLinks";
import { sanitizeUrl } from "@/lib/urlSanitizer";

type CopyKey = "email" | "phone";

const rowClass =
  "group grid w-full grid-cols-[1fr_auto] min-[380px]:grid-cols-[5.5rem_1fr_auto] sm:grid-cols-[7rem_1fr_auto] items-center gap-x-4 gap-y-1 py-4 text-left border-b border-neutral-200 dark:border-neutral-800 transition-colors hover:text-volt-ink dark:hover:text-volt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt-ink dark:focus-visible:outline-volt";

const RowLabel = ({ children }: { children: ReactNode }) => (
  <span className="col-span-2 min-[380px]:col-span-1 font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
    {children}
  </span>
);

const RowValue = ({ children }: { children: ReactNode }) => (
  <span className="min-w-0 truncate text-base sm:text-lg font-medium text-gray-900 dark:text-white group-hover:text-volt-ink dark:group-hover:text-volt transition-colors">
    {children}
  </span>
);

const iconClass = "w-4 h-4 flex-none text-neutral-400 group-hover:text-volt-ink dark:group-hover:text-volt transition-colors";

const CopiedMark = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1.5 font-mono text-caption uppercase tracking-[0.14em] text-volt-ink dark:text-volt">
    <span className="hidden min-[420px]:inline">{label}</span>
    <Check className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
  </span>
);

const safeLinks = contactLinks.flatMap((link) => {
  const href = sanitizeUrl(link.href);
  return href && isAllowedExternalUrl(href) ? [{ ...link, href }] : [];
});

const ContactList = () => {
  const { t } = useI18n();
  const { copiedKey, copy } = useCopyFeedback<CopyKey>();
  const [phone, setPhone] = useState<ReturnType<typeof revealPhone> | null>(null);

  const handleEmail = async (event: MouseEvent<HTMLAnchorElement>) => {
    // Cmd/Ctrl+click keeps the default mailto behaviour.
    if (event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    const copied = await copy("email", CONTACT_EMAIL);
    if (!copied) window.location.href = `mailto:${CONTACT_EMAIL.toLowerCase()}`;
  };

  const handlePhone = () => {
    const next = phone ?? revealPhone();
    setPhone(next);
    void copy("phone", next.value);
  };

  const [telegram, ...otherLinks] = safeLinks;

  const renderLink = (link: (typeof safeLinks)[number]) => (
    <li key={link.id}>
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
        <RowLabel>{link.label}</RowLabel>
        <RowValue>{link.handle}</RowValue>
        <ArrowUpRight className={iconClass} strokeWidth={2} aria-hidden="true" />
      </a>
    </li>
  );

  return (
    <>
      <ul className="border-t border-neutral-200 dark:border-neutral-800 list-none">
        {telegram && renderLink(telegram)}
        <li>
          <a
            href={`mailto:${CONTACT_EMAIL.toLowerCase()}`}
            onClick={handleEmail}
            className={rowClass}
            aria-label={t.contact.emailAria(CONTACT_EMAIL)}
          >
            <RowLabel>{t.contact.email}</RowLabel>
            <RowValue>{CONTACT_EMAIL}</RowValue>
            {copiedKey === "email" ? <CopiedMark label={t.contact.copied} /> : <Copy className={iconClass} strokeWidth={2} aria-hidden="true" />}
          </a>
        </li>
        <li>
          <button
            type="button"
            onClick={handlePhone}
            className={rowClass}
            aria-label={phone ? t.contact.phoneCopyAria(phone.display) : t.contact.phoneRevealAria}
          >
            <RowLabel>{t.contact.phone}</RowLabel>
            <RowValue>
              {phone ? (
                <span className="tabular-nums">{phone.display}</span>
              ) : (
                <span className="text-neutral-500 dark:text-neutral-400 group-hover:text-volt-ink dark:group-hover:text-volt">
                  {t.contact.showNumber}
                </span>
              )}
            </RowValue>
            {copiedKey === "phone" ? (
              <CopiedMark label={t.contact.copied} />
            ) : phone ? (
              <Copy className={iconClass} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye className={iconClass} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </li>
        {otherLinks.map(renderLink)}
      </ul>
      <p className="sr-only" aria-live="polite">
        {copiedKey === "email" ? t.contact.emailCopied : copiedKey === "phone" ? t.contact.phoneCopied : ""}
      </p>
    </>
  );
};

type ContactDialogProps = {
  /** Uncontrolled usage: the element that opens the dialog. */
  trigger?: ReactNode;
  /** Controlled usage (e.g. from the navbar). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Where focus goes on close when there is no trigger (controlled usage). */
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export const ContactDialog = ({ trigger, open, onOpenChange, returnFocusRef }: ContactDialogProps) => {
  const { t } = useI18n();
  return (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    {trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-6 bg-black/40 dark:bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none">
        <DialogPrimitive.Content
          onCloseAutoFocus={(event) => {
            const target = returnFocusRef?.current;
            if (!target?.isConnected) return;
            event.preventDefault();
            target.focus();
          }}
          className="relative w-full md:max-w-lg max-h-[90dvh] overflow-y-auto bg-background border-t md:border border-neutral-200 dark:border-neutral-800 rounded-t-3xl md:rounded-3xl shadow-2xl px-6 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] md:p-10 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-8 md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=open]:zoom-in-95 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none"
        >
          <div aria-hidden="true" className="md:hidden absolute top-3 left-1/2 -translate-x-1/2 h-1 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 mb-3">
            {t.contact.eyebrow}
          </p>
          <DialogPrimitive.Title className="text-heading-2 text-gray-900 dark:text-white">
            {t.contact.title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 mb-8 text-body-sm text-neutral-500 dark:text-neutral-400">
            {t.contact.availability}
          </DialogPrimitive.Description>
          <ContactList />
          <DialogPrimitive.Close
            className="touch-no-ring absolute right-4 top-4 md:right-6 md:top-6 p-2 rounded-full text-neutral-500 hover:text-gray-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-volt-ink dark:focus-visible:outline-volt"
            aria-label={t.contact.close}
          >
            <X className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
  );
};
