export function CaseStudyHero() {
  return (
    <div className="hero-band">
      <div id="top" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">CASE STUDY / MOBILE CONTENT ARCHITECTURE</p>
          <h1>
            Content, composed
            <br />
            <em>natively.</em>
          </h1>
          <p className="hero-summary">
            Modernizing a clinical app around the people using it—and the people
            keeping its content current.
          </p>
          <p className="hero-detail">
            I helped shape the technical direction of Impella’s modernization:
            proposing native CMS rendering, building the content system, and
            developing interactive tools alongside the wider product team.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#architecture">
              Explore the architecture <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href="#playground">
              Open content studio ↓
            </a>
          </div>
          <div className="hero-meta">
            <span>React Native</span>
            <span>Headless Drupal</span>
            <span>Typed JSON</span>
          </div>
        </div>
        <figure className="hero-evidence">
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-evidence-label">
            <span>THE DELIVERED EXPERIENCE</span>
            <span>01 / 08</span>
          </div>
          <img
            src={`${import.meta.env.BASE_URL}assets/production/apple-home.webp`}
            alt="Apple listing screenshot: Impella home with six authored collection tiles"
            width="460"
            height="996"
            fetchPriority="high"
          />
          <figcaption>
            Authored entry points. A native experience.
            <br />
            <span>Apple listing evidence · Capture date unverified</span>
          </figcaption>
        </figure>
      </div>
      <div className="summary-strip">
        <div>
          <span>THE PROBLEM</span>
          <p>
            An aging app.
            <br />
            Fragmented resources and tools.
          </p>
        </div>
        <div>
          <span>THE DECISION</span>
          <p>
            Author structured data.
            <br />
            Render with native components.
          </p>
        </div>
        <div>
          <span>MY CONTRIBUTION</span>
          <p>
            Native content architecture,
            <br />
            interactive tools & authoring guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
