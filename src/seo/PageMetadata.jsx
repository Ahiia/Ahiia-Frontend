import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageMetadata } from "./pageMetadata.js";

export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pageMetadata(pathname);
    document.title = page.title;
    const setMeta = (attribute, key, content) => {
      let node = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!node) { node = document.createElement("meta"); node.setAttribute(attribute, key); document.head.appendChild(node); }
      node.setAttribute("content", content);
    };
    setMeta("name", "description", page.description);
    setMeta("name", "robots", page.robots);
    setMeta("property", "og:title", page.title);
    setMeta("property", "og:description", page.description);
    setMeta("name", "twitter:title", page.title);
    setMeta("name", "twitter:description", page.description);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (page.canonical) {
      if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
      canonical.href = page.canonical;
      setMeta("property", "og:url", page.canonical);
    } else {
      canonical?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
    }
  }, [pathname]);
  return null;
}
