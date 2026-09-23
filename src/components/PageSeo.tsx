import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_URL } from "@/data/siteMetadata";
import { useI18n } from "@/i18n/useI18n";
import { HTML_LANG, LOCALES, OG_LOCALE, localizePath } from "@/i18n/locales";
import { withBase } from "@/lib/urls";

type PageSeoProps = {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
};

const absoluteUrl = (path: string) => new URL(withBase(path), SITE_URL).href;

export const PageSeo = ({ title, description, image = "/og-image.png", noIndex = false }: PageSeoProps) => {
  const { pathname } = useLocation();
  const { locale, t } = useI18n();
  const pageTitle = title ?? t.seo.homeTitle;
  const pageDescription = description ?? t.seo.homeDescription;
  const canonicalUrl = absoluteUrl(pathname);
  const imageUrl = absoluteUrl(image);

  return (
    <Helmet htmlAttributes={{ lang: HTML_LANG[locale] }}>
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />
      {!noIndex &&
        LOCALES.map((alternate) => (
          <link
            key={alternate}
            rel="alternate"
            hrefLang={HTML_LANG[alternate]}
            href={absoluteUrl(localizePath(pathname, alternate))}
          />
        ))}
      {!noIndex && <link rel="alternate" hrefLang="x-default" href={absoluteUrl(localizePath(pathname, "en"))} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={OG_LOCALE[locale]} />
      <meta property="og:site_name" content={t.seo.siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};
