import { useEffect } from "react";

/**
 * Reusable SEO component to manage document head metadata and structured JSON-LD schemas.
 * Does not require external libraries, lightweight and performance-friendly.
 */
export default function SEO({
  title,
  description,
  canonical,
  image,
  type = "website",
  schema,
}) {
  useEffect(() => {
    // 1. Title
    const defaultTitle = "PLE multi vendor E-commerce";
    document.title = title ? `${title} | Peoples League of Electronics` : defaultTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (attrName, attrValue, contentValue) => {
      if (!contentValue) return;
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentValue);
    };

    // 2. Description
    updateMetaTag("name", "description", description || "Peoples League of Electronics - Multi-vendor electronics e-commerce platform.");

    // 3. Canonical URL
    const canonicalUrl = canonical || window.location.origin + window.location.pathname;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 4. Open Graph Meta Tags
    updateMetaTag("property", "og:title", title || defaultTitle);
    updateMetaTag("property", "og:description", description || "Peoples League of Electronics");
    updateMetaTag("property", "og:url", canonicalUrl);
    updateMetaTag("property", "og:type", type);
    if (image) {
      updateMetaTag("property", "og:image", image);
    }

    // 5. Twitter Meta Tags
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", title || defaultTitle);
    updateMetaTag("name", "twitter:description", description || "Peoples League of Electronics");
    if (image) {
      updateMetaTag("name", "twitter:image", image);
    }

    // 6. JSON-LD Structured Data
    let schemaScript = document.getElementById("seo-json-ld");
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.setAttribute("type", "application/ld+json");
        schemaScript.setAttribute("id", "seo-json-ld");
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else {
      if (schemaScript) {
        schemaScript.remove();
      }
    }

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById("seo-json-ld");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, canonical, image, type, schema]);

  return null;
}
