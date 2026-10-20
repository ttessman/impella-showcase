import type { StudioBundle } from "../../model/studioDocument";
import { HeadingFields } from "../../../../components/CMS/bundles/Heading/HeadingFields";
import { TextBlockFields } from "../../../../components/CMS/bundles/TextBlock/TextBlockFields";
import { MediaFields } from "../../../../components/CMS/bundles/Media/MediaFields";
import { SectionFields } from "../../../../components/CMS/bundles/Section/SectionFields";
import { ReferencesAccordionFields } from "../../../../components/CMS/bundles/ReferencesAccordion/ReferencesAccordionFields";

/** The studio selects fields; each bundle owns its authoring component. */
export function BundleFields({
  block,
  onChange,
}: {
  block: StudioBundle;
  onChange: (block: StudioBundle) => void;
}) {
  switch (block.bundle) {
    case "header":
      return <HeadingFields key={block.id} block={block} onChange={onChange} />;
    case "text_block":
      return (
        <TextBlockFields key={block.id} block={block} onChange={onChange} />
      );
    case "media":
      return <MediaFields key={block.id} block={block} onChange={onChange} />;
    case "demo_section":
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
