import { assetUrl } from "../../../../utils/assets";
import type { NodeOf } from "../../renderers/ContentViewRender";
import { Hero } from "../../../UI/Hero/Hero";
import { ContentViewRender } from "../../renderers/ContentViewRender";
export function HeroBundle({ node }: { node: NodeOf<"hero"> }) {
  const m = node.metadata;
  return (
    <Hero
      id={node.id}
      header={m.header}
      variant={m.variant}
      asidePadding={m.aside_padding}
      contentWidth={m.content_width}
      background={
        m.background
          ? { ...m.background, src: assetUrl(m.background.src) }
          : undefined
      }
      areas={{
        content: <ContentViewRender blocks={m.content} />,
        actions: m.actions.length ? (
          <ContentViewRender blocks={m.actions} />
        ) : undefined,
        aside: m.aside.length ? (
          <ContentViewRender blocks={m.aside} />
        ) : undefined,
        footer: m.footer.length ? (
          <ContentViewRender blocks={m.footer} />
        ) : undefined,
      }}
    />
  );
}
