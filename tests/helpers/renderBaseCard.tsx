import { renderToStaticMarkup } from "react-dom/server";
import { Card } from "../../src/components/card/Card/Card";
import { Heading } from "../../src/components/CMS/bundles/Heading/Heading";
import { TextBlock } from "../../src/components/CMS/bundles/TextBlock/TextBlock";

/** Direct React use has no CMS renderer or document provider. */
export function renderBaseCard(
  variant: "outlined" | "tinted" | "source-summary",
) {
  return renderToStaticMarkup(
    <Card
      id="notes-card"
      variant={variant}
      slots={{
        header: (
          <Heading id="card-heading" level={3}>
            Shared frame
          </Heading>
        ),
        content: <TextBlock>Ordered body content.</TextBlock>,
        footer: (
          <TextBlock>
            Footer remains last despite its authored position.
          </TextBlock>
        ),
      }}
    />,
  );
}
