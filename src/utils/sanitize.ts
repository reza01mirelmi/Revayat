import sanitizeHtml from "sanitize-html";

export const sanitizePostContent = (html: string): string =>
  sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "em", "s", "code", "pre", "hr",
      "ul", "ol", "li", "blockquote", "a",
    ],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });