import type { ReactNode, RefObject } from "react";
import { useScrollDirection } from "../../../../hooks/useScrollDirection";

type Props = {
  ref: RefObject<HTMLElement | null>;
  progress: number;
  expanded: boolean;
  slots: { identity: ReactNode; context: ReactNode; actions: ReactNode };
};
/** Shared reading chrome; the feature supplies identity, context and navigation actions. */
export function ReadingHeaderFrame({ ref, progress, expanded, slots }: Props) {
  const { hidden, floating, reveal } = useScrollDirection(ref);
  return (
    <header
      ref={ref}
      className="site-header-shell"
      data-hidden={hidden && !expanded}
      data-floating={floating}
      onFocusCapture={reveal}
    >
      <div className="site-header reading-header">
        <div className="reading-context">
          {slots.identity}
          {slots.context}
        </div>
        {slots.actions}
      </div>
      <div
        className="reading-progress"
        role="progressbar"
        aria-label="Case study reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  );
}
