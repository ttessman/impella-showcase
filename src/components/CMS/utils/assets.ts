export function assetUrl(src: string) {
  return `${import.meta.env.BASE_URL}${src.replace(/^\//, "")}`;
}
