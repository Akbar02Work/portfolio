import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_URL } from "@/data/siteMetadata";
import { withBase } from "@/lib/urls";

type PageSeoProps = {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
};

export const PageSeo = ({
  title = HOME_TITLE,
  description = HOME_DESCRIPTION,
  image = "/og-image.png",
  noIndex = false,
}: PageSeoProps) => {
  const { pathname } = useLocation();
  const canonicalUrl = new URL(withBase(pathname), SITE_URL).href;
  const imageUrl = new URL(withBase(image), SITE_URL).href;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Akbar Azizov Portfolio" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};
