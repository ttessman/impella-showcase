import {
  ArrowDownIcon,
  ArrowTopRightIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  Cross2Icon,
  DragHandleDots2Icon,
  LayoutIcon,
  Pencil1Icon,
  QuestionMarkCircledIcon,
  ResetIcon,
  ViewHorizontalIcon,
  ViewVerticalIcon,
} from "@radix-ui/react-icons";

/** Semantic names and aliases are owned here; callers never choose library components. */
const ICON_KEYWORDS = [
  [Cross2Icon, ["close", "cancel", "remove"]],
  [Pencil1Icon, ["compose", "edit"]],
  [ResetIcon, ["reset-example", "reset", "refresh"]],
  [LayoutIcon, ["reset-layout"]],
  [ChevronLeftIcon, ["collapse"]],
  [ChevronRightIcon, ["expand"]],
  [ViewVerticalIcon, ["columns"]],
  [ViewHorizontalIcon, ["rows"]],
  [ArrowUpIcon, ["up", "arrow-up"]],
  [ArrowDownIcon, ["down", "arrow-down"]],
  [ArrowTopRightIcon, ["open", "external", "external-link"]],
  [ChevronDownIcon, ["chevron-down"]],
  [DragHandleDots2Icon, ["grip", "drag"]],
  [CodeIcon, ["code"]],
  [QuestionMarkCircledIcon, ["help", "unknown"]],
] as const;
export type IconName = (typeof ICON_KEYWORDS)[number][1][number];

const ICON_REGISTRY = Object.fromEntries(
  ICON_KEYWORDS.flatMap(([component, keywords]) =>
    keywords.map((keyword) => [keyword, component]),
  ),
) as Record<IconName, typeof Cross2Icon>;

/** AideIcon-style registry wrapper; the surrounding control owns its accessible label. */
export function Icon({ type, size = 18 }: { type: IconName; size?: number }) {
  const IconComponent =
    ICON_REGISTRY[type.trim().toLowerCase() as IconName] ??
    QuestionMarkCircledIcon;
  return (
    <IconComponent
      className="icon"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    />
  );
}
