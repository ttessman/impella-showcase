/** Adapters map data; native UI markup and interaction state belong to bases. */
export const cmsAdapterBoundary = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      markup: "CMS adapters must delegate UI markup to a base React component.",
      state:
        "UI state/effects belong to the base component, not its CMS adapter.",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type === "JSXIdentifier" && /^[a-z]/.test(node.name.name))
          context.report({ node, messageId: "markup" });
      },
      ImportDeclaration(node) {
        if (node.source.value !== "react") return;
        for (const specifier of node.specifiers) {
          if (
            specifier.type === "ImportSpecifier" &&
            ["useState", "useReducer", "useEffect", "useLayoutEffect"].includes(
              specifier.imported.name,
            )
          )
            context.report({ node: specifier, messageId: "state" });
        }
      },
    };
  },
};

/** Base UI receives plain React props rather than CMS nodes, context or renderers. */
export const cmsBaseBoundary = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      dependency:
        "Base React components must not depend on CMS node contracts, document context, adapters or renderers.",
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (
          /(?:types\/cms|\/renderers\/|\/DocumentContext$|Bundle$)/.test(
            node.source.value,
          )
        )
          context.report({ node, messageId: "dependency" });
      },
    };
  },
};
