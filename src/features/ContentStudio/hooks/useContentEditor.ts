import { useRef, useState } from "react";
import { bundles } from "../model/bundleDefinitions";
import { makeBundle } from "../model/bundleFactory";
import { defaultPage } from "../../../content/studioExample";
import { parsePage } from "../model/parseContentPage";
import type {
  StudioBundle,
  StudioDocument,
  StudioBundleName,
} from "../model/studioDocument";
import {
  findBlock,
  moveBlock,
  relocateBlock,
  removeBlock,
  sections,
  updateBlock,
} from "../model/contentTree";
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
  const current = selected
    ? findBlock(page.primary_content_value, selected)
    : undefined;
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
      const blocks = relocateBlock(page.primary_content_value, id, target);
      if (blocks === page.primary_content_value) {
        setMessage(
          "Move cancelled. A section cannot move inside itself or its descendants.",
        );
        return;
      }
      if (
        commit(
          { ...page, primary_content_value: blocks },
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
        ? [...page.primary_content_value, block]
        : updateBlock(page.primary_content_value, destination, (b) =>
            b.bundle === "demo_section"
              ? { ...b, children: [...b.children, block] }
              : b,
          );
    if (
      commit(
        { ...page, primary_content_value: blocks },
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
        setSelected(next.primary_content_value[0]?.id ?? null);
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
    if (findBlock(page.primary_content_value, id)?.bundle === "demo_section")
      setDestination(id);
  }
  function changeBlock(updated: StudioBundle) {
    commit({
      ...page,
      primary_content_value: updateBlock(
        page.primary_content_value,
        updated.id,
        () => updated,
      ),
    });
  }
  function reorder(id: string, delta: number) {
    commit(
      {
        ...page,
        primary_content_value: moveBlock(page.primary_content_value, id, delta),
      },
      "Block order updated.",
    );
  }
  function remove(id: string) {
    const blocks = removeBlock(page.primary_content_value, id);
    if (commit({ ...page, primary_content_value: blocks }, "Block removed.")) {
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
    destinations: sections(page.primary_content_value).filter(
      (section) => section.depth < 5,
    ),
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
      updateTitle: (title: string) => commit({ ...page, title }),
    },
  };
}
export type ContentEditor = ReturnType<typeof useContentEditor>;
