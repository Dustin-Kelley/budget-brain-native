export type HeaderTheme = {
  id: string;
  label: string;
  colors: [string, string];
};

export const headerThemes: HeaderTheme[] = [
  { id: "ocean", label: "Ocean", colors: ["#0ea5e9", "#6366f1"] },
  { id: "sunset", label: "Sunset", colors: ["#f97316", "#ec4899"] },
  { id: "forest", label: "Forest", colors: ["#22c55e", "#14b8a6"] },
  { id: "berry", label: "Berry", colors: ["#a855f7", "#ec4899"] },
  { id: "midnight", label: "Midnight", colors: ["#1e293b", "#475569"] },
  { id: "coral", label: "Coral", colors: ["#f43f5e", "#fb923c"] },
];

export const DEFAULT_HEADER_THEME = "ocean";

export function getHeaderTheme(id: string): HeaderTheme {
  return (
    headerThemes.find((t) => t.id === id) ??
    headerThemes.find((t) => t.id === DEFAULT_HEADER_THEME)!
  );
}
