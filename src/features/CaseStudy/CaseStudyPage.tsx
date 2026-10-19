import { RichText } from "../../components/content/RichText/RichText";
import { sectionDefinitions, caseStudyCopy } from "../../content/caseStudy";
import { CaseStudyHero } from "./CaseStudyHero";
import { SourceReference } from "../../components/source/SourceReference/SourceReference";
import { sourceExamples } from "../../content/sourceExamples";
import { NavigationEvidence } from "../../components/media/NavigationEvidence/NavigationEvidence";
import { ArticleEvidence } from "../../components/media/ArticleEvidence/ArticleEvidence";
import ContentStudio from "../ContentStudio/ContentStudio";
import { Section } from "../../components/layout/Section/Section";
import { Diagram } from "../../components/diagrams/Diagram/Diagram";
import { ProductGallery } from "../../components/media/ProductGallery/ProductGallery";
import {
  deliverables,
  sourceModules,
  storeLinks,
} from "../../content/evidence";
export function CaseStudyPage() {
  return (
    <>
      <main id="main">
        <CaseStudyHero />
        <Section definition={sectionDefinitions.overview}>
          <div className="two-column">
            <p>
              <RichText content={caseStudyCopy.overview.background} />
            </p>
            <div>
              <p>
                <RichText content={caseStudyCopy.overview.contribution} />
              </p>
              <p className="note">
                <RichText content={caseStudyCopy.overview.team} />
              </p>
            </div>
          </div>
        </Section>
        <Section definition={sectionDefinitions.architecture}>
          <div className="decision-grid">
            <article>
              <p className="eyebrow">
                <RichText content={caseStudyCopy.architecture.initialLabel} />
              </p>
              <h3>
                <RichText content={caseStudyCopy.architecture.initialTitle} />
              </h3>
              <p>
                <RichText content={caseStudyCopy.architecture.initialBody} />
              </p>
            </article>
            <article>
              <p className="eyebrow">
                <RichText content={caseStudyCopy.architecture.proposedLabel} />
              </p>
              <h3>
                <RichText content={caseStudyCopy.architecture.proposedTitle} />
              </h3>
              <p>
                <RichText content={caseStudyCopy.architecture.proposedBody} />
              </p>
            </article>
          </div>
          <Diagram kind="pipeline" />
          <p className="note">
            <RichText content={caseStudyCopy.architecture.tradeoff} />
          </p>
        </Section>
        <Section definition={sectionDefinitions.contract}>
          <div className="source-grid">
            {sourceModules.map((m, i) => (
              <article key={m.title}>
                <span className="diagram-index">0{i + 1}</span>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
                <code>{m.path}</code>
              </article>
            ))}
          </div>
          <p className="note">
            <RichText content={caseStudyCopy.contract.sourceNote} />
          </p>
        </Section>
        <Section definition={sectionDefinitions.articles}>
          <ArticleEvidence />
        </Section>
        <Section definition={sectionDefinitions.collections}>
          <Diagram kind="collections" />
          <div className="two-column">
            <p>
              <RichText content={caseStudyCopy.collections.composition} />
            </p>
            <p>
              <RichText content={caseStudyCopy.collections.organization} />
            </p>
          </div>
          <SourceReference source={sourceExamples.collections} />
        </Section>
        <Section definition={sectionDefinitions.navigation}>
          <Diagram kind="navigation" />
          <div className="two-column">
            <p>
              <RichText content={caseStudyCopy.navigation.regionalMenus} />
            </p>
            <p>
              <RichText content={caseStudyCopy.navigation.landingScreens} />
            </p>
          </div>
          <NavigationEvidence />
          <p className="note">
            <RichText content={caseStudyCopy.navigation.evidenceNote} />
          </p>
          <SourceReference source={sourceExamples.navigation} />
        </Section>
        <Section definition={sectionDefinitions.tools}>
          <div className="tools-grid">
            <Diagram kind="checklist" />
            <div>
              <h3>
                <RichText content={caseStudyCopy.tools.checklistTitle} />
              </h3>
              <p>
                <RichText content={caseStudyCopy.tools.checklists} />
              </p>
              <h3>
                <RichText content={caseStudyCopy.tools.calculatorTitle} />
              </h3>
              <p>
                <RichText content={caseStudyCopy.tools.calculators} />
              </p>
              <p className="note">
                <RichText content={caseStudyCopy.tools.clinicalBoundary} />
              </p>
            </div>
          </div>
          <SourceReference source={sourceExamples.calculators} />
        </Section>
        <Section definition={sectionDefinitions.product}>
          <ProductGallery />
          <p className="note">
            <RichText content={caseStudyCopy.product.evidenceNote} />
          </p>
          <p className="store-links">
            Public product listings:{" "}
            <a href={storeLinks.apple}>Apple App Store ↗</a>
            <a href={storeLinks.google}>Google Play ↗</a>
            <span>
              Reviewed October 19, 2026. Listings describe the broader product,
              not individual ownership.
            </span>
          </p>
        </Section>
        <Section definition={sectionDefinitions.ownership}>
          <div className="deliverable-list">
            {deliverables.map(([title, body], i) => (
              <div key={title}>
                <span className="diagram-index">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <p className="note">
            <RichText content={caseStudyCopy.ownership.impact} />
          </p>
        </Section>
        <Section definition={sectionDefinitions.playground}>
          <ContentStudio />
        </Section>
        <Section definition={sectionDefinitions.reflection}>
          <div className="two-column">
            <div>
              <h3>
                <RichText content={caseStudyCopy.reflection.lessonTitle} />
              </h3>
              <p>
                <RichText content={caseStudyCopy.reflection.lesson} />
              </p>
              <p>
                <RichText content={caseStudyCopy.reflection.stewardship} />
              </p>
            </div>
            <div className="future-concept">
              <p className="eyebrow">
                <RichText content={caseStudyCopy.reflection.futureLabel} />
              </p>
              <h3>
                <RichText content={caseStudyCopy.reflection.futureTitle} />
              </h3>
              <p>
                <RichText content={caseStudyCopy.reflection.futureRetrieval} />
              </p>
              <p>
                <RichText content={caseStudyCopy.reflection.futureBoundary} />
              </p>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
