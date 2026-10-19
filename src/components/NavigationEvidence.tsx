const examples = [
  {
    file: "home.png",
    width: 1260,
    height: 2736,
    title: "Home with persistent tabs",
    source: "Supplied capture · Region unverified",
    alt: "Impella home with Favorites and Browse regions above Favorites, Browse, Tools and IFUs bottom tabs",
    body: "Favorites, Browse, Tools and IFUs are visible destinations in the bottom navigation. Home also presents saved resources and a Browse preview.",
  },
  {
    file: "apple-home.webp",
    width: 460,
    height: 996,
    title: "Home with collection tiles",
    source: "Apple listing · Region unverified",
    alt: "Impella home with six collection tiles above Favorites and no bottom tab bar visible in the capture",
    body: "Six collection tiles provide entry points from Home, with Favorites below. No persistent bottom tab bar is visible in this capture.",
  },
];

export function NavigationEvidence() {
  return (
    <div className="navigation-evidence">
      {examples.map((example) => {
        const source = `${import.meta.env.BASE_URL}assets/production/${example.file}`;
        return (
          <figure key={example.file}>
            <a
              href={source}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${example.title} screenshot at full size`}
            >
              <img
                src={source}
                width={example.width}
                height={example.height}
                loading="lazy"
                alt={example.alt}
              />
            </a>
            <figcaption>
              <p className="eyebrow">{example.source}</p>
              <h3>{example.title}</h3>
              <p>{example.body}</p>
              <a
                className="text-link"
                href={source}
                target="_blank"
                rel="noreferrer"
              >
                View screenshot ↗
              </a>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
