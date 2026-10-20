import { renderToStaticMarkup } from "react-dom/server";
import { Card } from "../../src/components/UI/Card/Card";
import { Heading } from "../../src/components/UI/Heading/Heading";
import { BlockText } from "../../src/components/UI/Text/variants/BlockText";

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
        content: <BlockText>Ordered body content.</BlockText>,
        footer: (
          <BlockText>
            Footer remains last despite its authored position.
          </BlockText>
        ),
      }}
    />,
  );
}
