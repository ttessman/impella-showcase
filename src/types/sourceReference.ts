export type SourceFileIllustration = {
  path: string;
  context: string;
  example: string;
};
export type SourceReferenceData = {
  title: string;
  summary: string;
  files: readonly SourceFileIllustration[];
  initialFile?: string;
};
