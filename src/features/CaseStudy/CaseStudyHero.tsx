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
            As a frontend engineer at Bounteous, I proposed and built the native
            content-rendering system and developed clinical tool interfaces
            alongside the wider product team.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#playground">
              Explore the content studio <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href="#architecture">
              Read the architectural decision ↓
            </a>
          </div>
          <div className="hero-meta">
            <span>React Native</span>
            <span>Headless Drupal</span>
            <span>JSON - TYPESCRIPT</span>
          </div>
        </div>
        <figure className="hero-evidence">
          <div className="hero-grid-lines" aria-hidden="true" />
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
