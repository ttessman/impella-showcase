import { imageOptions } from "../components/CMS/bundles/MediaBundle/MediaFields";
function makeBundle(bundle: StudioBundleName): StudioBundle {
  const id = `block-${crypto.randomUUID()}`;
  switch (bundle) {
    case "heading":
      return { id, bundle, metadata: { level: 2 }, content: "New heading" };
    case "text_block":
      return {
        id,
        bundle,
        metadata: { variant: "plain" },
        content: "Add a note from your next creative adventure.",
      };
    case "media":
      return {
        id,
        bundle,
        metadata: {
          src: `/${imageOptions[0]}`,
          alt: "Illustrated green mountains under a golden sun",
          title: "Field journal illustration",
          width: 800,
          height: 480,
          variant: "inline",
        },
        content: [
          {
            id: `caption-${id}`,
            bundle: "text_block",
            metadata: {},
            content: "A fictional field journal illustration.",
          },
        ],
      };
    case "section":
      return {
        id,
        bundle,
        metadata: {
          label: "New section",
          variant: "preview",
          navigation: false,
        },
        content: [],
      };
    case "references_accordion":
      return {
        id,
        bundle,
        metadata: { label: "References" },
        content: [
          "Fictional field journal, volume one.",
          "Fictional studio notes, edition two.",
        ].map((content, index) => ({
          id: `reference-${index}-${id}`,
          bundle: "text_block",
          metadata: {},
          content,
        })),
      };
  }
}

import { useRef, useState } from "react";
import { bundles } from "../components/UI/ContentStudio/PageComposer";
import example from "../content/studio.json" with { type: "json" };
/** Return fresh validated state for every editor instance/reset. */
export function defaultPage() {
  return parsePage(JSON.stringify(example));
}
import { parsePage } from "../utils/studio";
import type {
  StudioBundle,
  StudioDocument,
  StudioBundleName,
} from "../utils/studio";
import {
  findBlock,
  moveBlock,
  relocateBlock,
  removeBlock,
  sections,
  updateBlock,
} from "../utils/studio";
import { useBlockDrag } from "./useBlockDrag";

/** Owns valid content, authoring selection and the explicit JSON draft lifecycle. */
export function useContentEditor() {
  const [page, setPage] = useState<StudioDocument>(defaultPage);
  const [selected, setSelected] = useState<string | null>("intro");
  const [destination, setDestination] = useState("root");
  const [draft, setDraft] = useState<string | null>(null);
  const [message, setMessage] = useState(
    "Working example loaded. Select a block to edit.",
  );
  const [error, setError] = useState("");
  const palette = useRef<HTMLButtonElement>(null);
  const dirty = draft !== null;
  const json = JSON.stringify(page, null, 2);
  const current = selected ? findBlock(page.content, selected) : undefined;
  function commit(next: StudioDocument, announcement?: string): boolean {
    try {
      const checked = parsePage(JSON.stringify(next));
      setPage(checked);
      setError("");
      if (announcement) setMessage(announcement);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }
  const drag = useBlockDrag({
    disabled: dirty,
    announce: setMessage,
    drop: (id, target) => {
      const blocks = relocateBlock(page.content, id, target);
      if (blocks === page.content) {
        setMessage(
          "Move cancelled. A section cannot move inside itself or its descendants.",
        );
        return;
      }
      if (
        commit(
          { ...page, content: blocks },
          "Block moved. JSON and preview updated.",
        )
      )
        setSelected(id);
    },
  });
  function revealProperties(id: string) {
    requestAnimationFrame(() =>
      document
        .getElementById(`properties-${id}`)
        ?.scrollIntoView({ block: "nearest" }),
    );
  }
  function add(bundle: StudioBundleName) {
    const block = makeBundle(bundle);
    const blocks =
      destination === "root"
        ? [...page.content, block]
        : updateBlock(page.content, destination, (b) =>
            b.bundle === "section"
              ? { ...b, content: [...b.content, block] }
              : b,
          );
    if (
      commit(
        { ...page, content: blocks },
        `${bundles.find((b) => b.value === bundle)!.label} added. Edit its properties below.`,
      )
    ) {
      setSelected(block.id);
      revealProperties(block.id);
    }
  }
  function validate(apply: boolean) {
    try {
      const next = parsePage(draft ?? json);
      setError("");
      if (apply) {
        drag.cancel();
        setPage(next);
        setDraft(null);
        setSelected(next.content[0]?.id ?? null);
        setDestination("root");
        setMessage("JSON applied. Editor and preview updated.");
      } else
        setMessage(
          "JSON is valid. Apply changes to update the editor and preview.",
        );
    } catch (e) {
      setError((e as Error).message);
      setMessage("JSON was not applied. Your last valid page is preserved.");
    }
  }

  function selectBlock(id: string) {
    setSelected(id);
    revealProperties(id);
    if (findBlock(page.content, id)?.bundle === "section") setDestination(id);
  }
  function changeBlock(updated: StudioBundle) {
    commit({
      ...page,
      content: updateBlock(page.content, updated.id, () => updated),
    });
  }
  function reorder(id: string, delta: number) {
    commit(
      {
        ...page,
        content: moveBlock(page.content, id, delta),
      },
      "Block order updated.",
    );
  }
  function remove(id: string) {
    const blocks = removeBlock(page.content, id);
    if (commit({ ...page, content: blocks }, "Block removed.")) {
      if (selected && !findBlock(blocks, selected)) setSelected(null);
      if (destination !== "root" && !findBlock(blocks, destination))
        setDestination("root");
      palette.current?.focus();
    }
  }
  function reset() {
    drag.cancel();
    setPage(defaultPage());
    setDraft(null);
    setSelected("intro");
    setDestination("root");
    setError("");
    setMessage("Original example restored.");
  }
  function editJson(value: string) {
    drag.cancel();
    setDraft(value);
    setError("");
    setMessage("JSON draft pending. Preview shows the last applied page.");
  }
  function discardDraft() {
    setDraft(null);
    setError("");
    setMessage("Draft discarded. Last applied page restored.");
  }
  return {
    page,
    selected,
    current,
    destination,
    draft,
    dirty,
    json,
    message,
    error,
    palette,
    drag,
    destinations: sections(page.content).filter((section) => section.depth < 5),
    actions: {
      add,
      selectBlock,
      changeBlock,
      reorder,
      remove,
      reset,
      editJson,
      discardDraft,
      setDestination,
      validate,
      updateTitle: (title: string) =>
        commit({ ...page, metadata: { ...page.metadata, title } }),
    },
  };
}
export type ContentEditor = ReturnType<typeof useContentEditor>;
