import { useEffect } from "react";

type FaviconVariant = "light" | "dark";

const candidates = (
  variant: FaviconVariant,
): Array<{ selector: string; href: string }> => [
  { selector: "link[rel='icon'][type='image/svg+xml']", href: `/favicon-variant.svg` },
  { selector: "link[rel='icon'][sizes='32x32']", href: `/favicon-32x32-variant.png` },
  { selector: "link[rel='icon'][sizes='16x16']", href: `/favicon-16x16-variant.png` },
  { selector: "link[rel='apple-touch-icon']", href: `/apple-touch-icon-variant.png` },
];

/**
 * Switches favicon to a light/dark variant if corresponding files exist.
 * Falls back to existing favicon links when variant files are not present.
 */
export function useFaviconVariant(variant: FaviconVariant) {
  useEffect(() => {
    let cancelled = false;

    const updateOne = (sel: string, href: string) => {
      const link = document.head.querySelector<HTMLLinkElement>(sel);
      if (!link) return;
      // Issue a HEAD request to see if the asset exists; if not, do nothing
      fetch(href, { method: "HEAD" })
        .then((res) => {
          if (cancelled) return;
          if (res.ok) link.href = href;
        })
        .catch(() => {
          /* ignore; keep existing */
        });
    };

    candidates(variant).forEach((c) => updateOne(c.selector, c.href));

    return () => {
      cancelled = true;
    };
  }, [variant]);
}


