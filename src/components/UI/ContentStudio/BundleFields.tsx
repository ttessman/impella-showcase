import type { StudioBundle } from "../../../utils/studio";
import { HeadingFields } from "../../CMS/bundles/HeadingBundle/HeadingFields";
import { TextBlockFields } from "../../CMS/bundles/TextBundle/variants/TextBlockFields";
import { MediaFields } from "../../CMS/bundles/MediaBundle/MediaFields";
import { SectionFields } from "../../CMS/bundles/LayoutBundle/SectionFields";
import { ReferencesAccordionFields } from "../../CMS/bundles/AccordionBundle/variants/ReferencesAccordionFields";

/** The studio selects fields; each bundle owns its authoring component. */
export function BundleFields({
  block,
  onChange,
}: {
  block: StudioBundle;
  onChange: (block: StudioBundle) => void;
}) {
  switch (block.bundle) {
    case "heading":
      return <HeadingFields key={block.id} block={block} onChange={onChange} />;
    case "text_block":
      return (
        <TextBlockFields key={block.id} block={block} onChange={onChange} />
      );
    case "media":
      return <MediaFields key={block.id} block={block} onChange={onChange} />;
    case "section":
      return <SectionFields key={block.id} block={block} onChange={onChange} />;
    case "references_accordion":
      return (
        <ReferencesAccordionFields
          key={block.id}
          block={block}
          onChange={onChange}
        />
      );
  }
}
