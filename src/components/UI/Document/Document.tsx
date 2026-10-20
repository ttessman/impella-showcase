type DocumentDefinition = {
  title: string;
  subtitle: string;
  sections: readonly { heading: string; paragraphs: readonly string[] }[];
};

export function Document({ definition }: { definition: DocumentDefinition }) {
  return (
    <article className="document-view">
      <p className="eyebrow">{definition.subtitle}</p>
      <h2>{definition.title}</h2>
      {definition.sections.map((section) => (
        <section key={section.heading}>
          <h3>{section.heading}</h3>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
