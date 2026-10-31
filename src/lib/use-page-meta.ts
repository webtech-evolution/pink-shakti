import { useEffect } from "react";

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    const pageUrl = new URL(window.location.href);
    pageUrl.search = "";
    pageUrl.hash = "";

    const setMeta = (selector: string, attribute: string, value: string) => {
      let tag = document.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(
          attribute,
          selector.includes("property=")
            ? selector.match(/property="([^"]+)"/)?.[1] || ""
            : selector.match(/name="([^"]+)"/)?.[1] || "",
        );
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };

    if (description) {
      setMeta('meta[name="description"]', "name", description);
      setMeta('meta[property="og:description"]', "property", description);
      setMeta('meta[name="twitter:description"]', "name", description);
    }
    setMeta('meta[property="og:title"]', "property", title);
    setMeta('meta[name="twitter:title"]', "name", title);
    setMeta('meta[property="og:url"]', "property", pageUrl.toString());
    setMeta(
      'meta[property="og:image"]',
      "property",
      new URL("/images/og-pink-shakti.jpg", window.location.origin).toString(),
    );
    setMeta(
      'meta[name="twitter:image"]',
      "name",
      new URL("/images/og-pink-shakti.jpg", window.location.origin).toString(),
    );

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl.toString();
  }, [title, description]);
}

export function useStructuredData(id: string, schema: Record<string, unknown> | null) {
  const serialized = schema ? JSON.stringify(schema) : "";

  useEffect(() => {
    const selector = `script[data-structured-data="${id}"]`;
    let script = document.querySelector<HTMLScriptElement>(selector);
    if (!serialized) {
      script?.remove();
      return;
    }
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.structuredData = id;
      document.head.appendChild(script);
    }
    script.textContent = serialized;
    return () => script?.remove();
  }, [id, serialized]);
}
