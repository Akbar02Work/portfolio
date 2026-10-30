import { LocalizedText } from "@/components/ui/LocalizedText";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpRight, Check, Copy, Eye, X } from "lucide-react";
import { useState, type MouseEvent, type ReactNode, type RefObject } from "react";
import { CONTACT_EMAIL, contactLinks, revealPhone, type ContactLink } from "@/data/contacts";
import { useI18n } from "@/i18n/useI18n";
import { useCopyFeedback } from "@/hooks/useCopyFeedback";
import { CopySwap } from "@/components/ui/CopySwap";
import { CopyNotice } from "@/components/ui/CopyNotice";
import { isAllowedExternalUrl } from "@/lib/externalLinks";
import { sanitizeUrl } from "@/lib/urlSanitizer";

type CopyKey = "email" | "phone" | ContactLink["id"];

const rowClass =
  "group grid w-full grid-cols-[1fr_auto] min-[380px]:grid-cols-[5.5rem_1fr_auto] sm:grid-cols-[7rem_1fr_auto] items-center gap-x-4 gap-y-1 py-4 text-left border-b border-neutral-200 dark:border-neutral-800 transition-colors hover:text-volt-ink dark:hover:text-volt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt-ink dark:focus-visible:outline-volt";

const RowLabel = ({ children }: { children: ReactNode }) => (
  <span className="col-span-2 min-[380px]:col-span-1 font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
    {children}
  </span>
);

const RowValue = ({ children, wrap = false }: { children: ReactNode; wrap?: boolean }) => (
  <span className={`${wrap ? "whitespace-normal break-words" : "truncate"} min-w-0 max-w-full px-0.5 -mx-0.5 py-0.5 -my-0.5 text-base sm:text-lg font-medium text-gray-900 dark:text-white group-hover:text-volt-ink dark:group-hover:text-volt transition-colors`}>
    {children}
  </span>
);

const iconClass = "w-4 h-4 flex-none text-neutral-400 group-hover:text-volt-ink dark:group-hover:text-volt transition-colors";

const CopiedMark = () => (
  <span className="inline-flex items-center gap-1.5 font-mono text-caption uppercase tracking-[0.14em] text-volt-ink dark:text-volt">
    <span className="sr-only"><LocalizedText>{copy => copy.contact.copied}</LocalizedText></span>
    <Check className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
  </span>
);

const safeLinks = contactLinks.flatMap((link) => {
  const href = sanitizeUrl(link.href);
  return href && isAllowedExternalUrl(href) ? [{ ...link, href }] : [];
});

const EMAIL_AT = CONTACT_EMAIL.indexOf("@");
const EMAIL_USER = CONTACT_EMAIL.slice(0, EMAIL_AT);
const EMAIL_DOMAIN = CONTACT_EMAIL.slice(EMAIL_AT);

const ContactList = ({ feedback }: { feedback: ReturnType<typeof useCopyFeedback<CopyKey>> }) => {
  const { t } = useI18n();
  const { copiedKey, copiedKeys, checkedKeys, copy } = feedback;
  const [phone, setPhone] = useState<ReturnType<typeof revealPhone> | null>(() => copiedKeys.has("phone") ? revealPhone() : null);
  const [copyFailed, setCopyFailed] = useState<CopyKey | null>(null);

  const handleCopy = async (key: CopyKey, value: string) => {
    setCopyFailed(null);
    const copied = await copy(key, value);
    setCopyFailed(copied ? null : key);
  };

  const handleContactClick = (event: MouseEvent<HTMLAnchorElement>, key: CopyKey, value: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || copiedKeys.has(key)) return;
    event.preventDefault();
    void handleCopy(key, value);
  };

  const handleRevealPhone = () => {
    const next = revealPhone();
    setPhone(next);
    void handleCopy("phone", next.value);
  };

  const [telegram, ...otherLinks] = safeLinks;

  const renderLink = (link: (typeof safeLinks)[number]) => (
    <li key={link.id}>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => handleContactClick(event, link.id, link.href)}
        aria-label={copiedKeys.has(link.id) ? t.contact.linkOpenAria(link.label) : t.contact.linkCopyAria(link.label)}
        title={copiedKeys.has(link.id) ? t.contact.linkOpenHint(link.label) : t.contact.linkCopyAria(link.label)}
        className={rowClass}
      >
        <RowLabel>{link.label}</RowLabel>
        <RowValue>{link.handle}</RowValue>
        <CopySwap
          active={checkedKeys.has(link.id)}
          className="justify-items-end"
          idle={copiedKeys.has(link.id)
            ? <ArrowUpRight className={iconClass} strokeWidth={2} aria-hidden="true" />
            : <Copy className={iconClass} strokeWidth={2} aria-hidden="true" />}
          done={<CopiedMark />}
        />
      </a>
      {copiedKey === link.id ? (
        <CopyNotice label={t.contact.linkCopied(link.label)} hint={t.contact.linkOpenHint(link.label)} />
      ) : null}
      {copyFailed === link.id ? (
        <p role="alert" className="pb-4 text-body-sm text-gray-600 dark:text-slate-300">
          <LocalizedText>{copy => copy.contact.linkCopyFailed}</LocalizedText>
        </p>
      ) : null}
    </li>
  );

  return (
    <>
      <ul className="border-t border-neutral-200 dark:border-neutral-800 list-none">
        {telegram && renderLink(telegram)}
        <li>
          <a
            href={`mailto:${CONTACT_EMAIL.toLowerCase()}`}
            onClick={(event) => handleContactClick(event, "email", CONTACT_EMAIL)}
            className={rowClass}
            aria-label={copiedKeys.has("email") ? t.contact.emailAria(CONTACT_EMAIL) : t.contact.emailCopyAria(CONTACT_EMAIL)}
            title={copiedKeys.has("email") ? t.contact.emailOpenHint : t.footer.emailHint}
          >
            <RowLabel><LocalizedText>{copy => copy.contact.email}</LocalizedText></RowLabel>
            <RowValue wrap>
              {/* Wraps only at "@" on narrow screens. */}
              <span className="flex flex-wrap select-text">
                <span>{EMAIL_USER}</span>
                <span className="whitespace-nowrap">{EMAIL_DOMAIN}</span>
              </span>
            </RowValue>
            <CopySwap
              active={checkedKeys.has("email")}
              className="justify-items-end"
              idle={copiedKeys.has("email")
                ? <ArrowUpRight className={iconClass} strokeWidth={2} aria-hidden="true" />
                : <Copy className={iconClass} strokeWidth={2} aria-hidden="true" />}
              done={<CopiedMark />}
            />
          </a>
          {copiedKey === "email" ? (
            <CopyNotice label={t.contact.emailCopied} hint={t.contact.emailOpenHint} />
          ) : null}
          {copyFailed === "email" ? (
            <p role="alert" className="pb-4 text-body-sm text-gray-600 dark:text-slate-300">
              <LocalizedText>{copy => copy.contact.emailCopyFailed}</LocalizedText>
            </p>
          ) : null}
        </li>
        <li>
          {phone ? (
              <a
                href={`tel:${phone.value}`}
                onClick={(event) => handleContactClick(event, "phone", phone.value)}
                className={rowClass}
                aria-label={copiedKeys.has("phone") ? t.contact.phoneAria(phone.display) : t.contact.phoneCopyAria(phone.display)}
                title={copiedKeys.has("phone") ? t.contact.phoneOpenHint : t.contact.phoneCopyAria(phone.display)}
              >
                <RowLabel><LocalizedText>{copy => copy.contact.phone}</LocalizedText></RowLabel>
                <RowValue><span className="select-text tabular-nums">{phone.display}</span></RowValue>
                <CopySwap
                  active={checkedKeys.has("phone")}
                  className="justify-items-end"
                  idle={copiedKeys.has("phone")
                    ? <ArrowUpRight className={iconClass} strokeWidth={2} aria-hidden="true" />
                    : <Copy className={iconClass} strokeWidth={2} aria-hidden="true" />}
                  done={<CopiedMark />}
                />
              </a>
          ) : (
            <button
              type="button"
              onClick={handleRevealPhone}
              className={rowClass}
              aria-label={t.contact.phoneRevealAria}
            >
              <RowLabel><LocalizedText>{copy => copy.contact.phone}</LocalizedText></RowLabel>
              <RowValue><span className="text-neutral-500 dark:text-neutral-400"><LocalizedText>{copy => copy.contact.showNumber}</LocalizedText></span></RowValue>
              <Eye className={iconClass} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
          {copiedKey === "phone" ? (
            <CopyNotice label={t.contact.phoneCopied} hint={t.contact.phoneOpenHint} />
          ) : null}
          {copyFailed === "phone" ? (
            <p role="alert" className="pb-4 text-body-sm text-gray-600 dark:text-slate-300">
              <LocalizedText>{copy => copy.contact.phoneCopyFailed}</LocalizedText>
            </p>
          ) : null}
        </li>
        {otherLinks.map(renderLink)}
      </ul>
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
  const feedback = useCopyFeedback<CopyKey>(6000);
  return (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    {trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-6 bg-black/40 dark:bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none">
        <DialogPrimitive.Content
          onOpenAutoFocus={(event) => {
            // Radix skips links when auto-focusing, which lands on the phone row;
            // start from the first contact row (Telegram) instead.
            const firstRow = event.target instanceof HTMLElement
              ? event.target.querySelector<HTMLElement>("li > a, li > button")
              : null;
            if (!firstRow) return;
            event.preventDefault();
            firstRow.focus();
          }}
          onCloseAutoFocus={(event) => {
            const target = returnFocusRef?.current;
            if (!target?.isConnected) return;
            event.preventDefault();
            target.focus();
          }}
          className="relative w-full md:max-w-[38rem] max-h-[90dvh] overflow-y-auto bg-background border-t md:border border-neutral-200 dark:border-neutral-800 rounded-t-3xl md:rounded-3xl shadow-2xl px-6 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] md:p-10 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-8 md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=open]:zoom-in-95 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none"
        >
          <div aria-hidden="true" className="md:hidden absolute top-3 left-1/2 -translate-x-1/2 h-1 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 mb-3">
            <LocalizedText>{copy => copy.contact.eyebrow}</LocalizedText>
          </p>
          <DialogPrimitive.Title className="text-heading-2 text-gray-900 dark:text-white">
            <LocalizedText>{copy => copy.contact.title}</LocalizedText>
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 mb-8 text-body-sm text-neutral-500 dark:text-neutral-400">
            <LocalizedText>{copy => copy.contact.availability}</LocalizedText>
          </DialogPrimitive.Description>
          <ContactList feedback={feedback} />
          <DialogPrimitive.Close
            className="touch-no-ring absolute right-4 top-4 md:right-6 md:top-6 translate-y-1.5 p-2 rounded-full text-neutral-500 hover:text-gray-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-volt-ink dark:focus-visible:outline-volt"
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
