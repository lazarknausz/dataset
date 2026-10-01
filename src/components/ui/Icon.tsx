const PATHS: Record<string, string> = {
  info: "M12 8h.01M11 12h1v5h1M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  glance: "M5 4h14v16H5zM9 8h6M9 12h6M9 16h4",
  chart: "M4 20V4M4 20h16M8 15l4-4 3 3 5-6",
  pie: "M12 3v9h9M12 3a9 9 0 1 0 9 9",
  pin: "M12 21s-7-6-7-11a7 7 0 1 1 14 0c0 5-7 11-7 11ZM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  forces: "M4 7h10l-3-3M20 17H10l3 3M4 17h4M16 7h4",
  building: "M4 21V8l8-4 8 4v13M9 21v-5h6v5M9 11h.01M15 11h.01",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  coins: "M12 6c4 0 7-1 7-2.5S16 1 12 1 5 2 5 3.5 8 6 12 6ZM5 3.5v5C5 10 8 11 12 11s7-1 7-2.5v-5M5 8.5v5C5 15 8 16 12 16s7-1 7-2.5v-5",
  list: "M5 6h14M5 12h14M5 18h9",
  download: "M12 4v11M7 11l5 5 5-5M5 20h14",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4",
  up: "M12 19V5M6 11l6-6 6 6",
  home: "M4 11l8-7 8 7v9H4z",
};

export function Icon({ name, size = 20 }: { name: keyof typeof PATHS | string; size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name] ?? PATHS.info} />
    </svg>
  );
}
