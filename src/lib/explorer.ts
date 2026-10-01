import { DIVISIONS } from "@/data/divisions";
import { SECTIONS, SECTION_BY_CODE } from "@/data/sections";
import type { ExplorerItem } from "@/components/IndustryExplorer";

export const EXPLORER_ITEMS: ExplorerItem[] = DIVISIONS.map((d) => ({
  code: d.code, section: d.section, sectionName: SECTION_BY_CODE[d.section].nameEn,
  nameEn: d.nameEn, nameHu: d.nameHu, shortEn: d.shortEn,
}));

export const EXPLORER_SECTIONS = SECTIONS.map((s) => ({ code: s.code, name: s.nameEn }));
