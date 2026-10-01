import type { Section, SectionProfile } from "@/lib/types";

const p = (
  revenueBn: [number, number],
  margin: [number, number],
  wageShare: [number, number],
  revenuePerEmployeeM: [number, number],
  revenuePerBusinessM: [number, number],
  growth: [number, number],
): SectionProfile => ({ revenueBn, margin, wageShare, revenuePerEmployeeM, revenuePerBusinessM, growth });

export const SECTIONS: Section[] = [
  { code: "A", nameEn: "Agriculture, Forestry & Fishing", nameHu: "Mezőgazdaság, erdőgazdálkodás, halászat", profile: p([300, 1400], [6, 14], [10, 18], [14, 30], [25, 90], [-1, 4]) },
  { code: "B", nameEn: "Mining & Quarrying", nameHu: "Bányászat, kőfejtés", profile: p([40, 260], [6, 16], [14, 24], [30, 70], [200, 900], [-3, 3]) },
  { code: "C", nameEn: "Manufacturing", nameHu: "Feldolgozóipar", profile: p([250, 6500], [4, 10], [10, 22], [20, 45], [300, 2500], [0, 5]) },
  { code: "D", nameEn: "Electricity, Gas, Steam & Air Conditioning Supply", nameHu: "Villamosenergia-, gáz-, gőzellátás, légkondicionálás", profile: p([1500, 3500], [5, 12], [6, 12], [90, 160], [800, 4000], [-1, 4]) },
  { code: "E", nameEn: "Water Supply, Sewerage & Waste Management", nameHu: "Vízellátás; szennyvíz gyűjtése, kezelése, hulladékgazdálkodás", profile: p([60, 600], [4, 9], [22, 34], [18, 35], [90, 500], [1, 5]) },
  { code: "F", nameEn: "Construction", nameHu: "Építőipar", profile: p([400, 2800], [4, 9], [18, 30], [14, 26], [40, 250], [0, 6]) },
  { code: "G", nameEn: "Wholesale & Retail Trade; Repair of Motor Vehicles", nameHu: "Kereskedelem; gépjárműjavítás", profile: p([1200, 9000], [2, 6], [5, 12], [28, 70], [60, 400], [1, 5]) },
  { code: "H", nameEn: "Transportation & Storage", nameHu: "Szállítás, raktározás", profile: p([120, 2200], [4, 9], [20, 32], [15, 30], [60, 300], [1, 6]) },
  { code: "I", nameEn: "Accommodation & Food Service Activities", nameHu: "Szálláshely-szolgáltatás, vendéglátás", profile: p([300, 1100], [5, 11], [24, 34], [8, 15], [20, 60], [2, 8]) },
  { code: "J", nameEn: "Information & Communication", nameHu: "Információ, kommunikáció", profile: p([80, 1700], [8, 18], [24, 38], [22, 42], [40, 300], [3, 9]) },
  { code: "K", nameEn: "Financial & Insurance Activities", nameHu: "Pénzügyi, biztosítási tevékenység", profile: p([300, 2400], [14, 32], [14, 24], [40, 120], [200, 2500], [2, 8]) },
  { code: "L", nameEn: "Real Estate Activities", nameHu: "Ingatlanügyletek", profile: p([400, 1600], [14, 28], [4, 10], [40, 100], [15, 60], [2, 7]) },
  { code: "M", nameEn: "Professional, Scientific & Technical Activities", nameHu: "Szakmai, tudományos, műszaki tevékenység", profile: p([100, 1400], [8, 16], [24, 38], [12, 28], [10, 60], [2, 8]) },
  { code: "N", nameEn: "Administrative & Support Service Activities", nameHu: "Adminisztratív és szolgáltatást támogató tevékenység", profile: p([80, 1300], [4, 10], [34, 52], [8, 18], [20, 90], [1, 7]) },
  { code: "O", nameEn: "Public Administration & Defence; Compulsory Social Security", nameHu: "Közigazgatás, védelem; kötelező társadalombiztosítás", profile: p([800, 2200], [0, 2], [40, 60], [10, 16], [500, 3000], [1, 4]) },
  { code: "P", nameEn: "Education", nameHu: "Oktatás", profile: p([250, 1200], [1, 5], [48, 66], [6, 12], [30, 120], [1, 4]) },
  { code: "Q", nameEn: "Human Health & Social Work Activities", nameHu: "Humán-egészségügyi, szociális ellátás", profile: p([180, 1600], [2, 7], [42, 58], [7, 14], [30, 150], [2, 6]) },
  { code: "R", nameEn: "Arts, Entertainment & Recreation", nameHu: "Művészet, szórakoztatás, szabadidő", profile: p([40, 280], [4, 10], [24, 38], [8, 16], [10, 45], [2, 8]) },
  { code: "S", nameEn: "Other Service Activities", nameHu: "Egyéb szolgáltatás", profile: p([30, 220], [6, 13], [18, 30], [5, 12], [5, 25], [1, 6]) },
  { code: "T", nameEn: "Households as Employers; Own-Use Production", nameHu: "Háztartások mint munkáltatók; saját fogyasztású termelés", profile: p([10, 40], [0, 4], [30, 50], [3, 6], [1, 4], [0, 3]) },
  { code: "U", nameEn: "Activities of Extraterritorial Organisations", nameHu: "Területen kívüli szervezetek tevékenysége", profile: p([1, 6], [0, 2], [40, 60], [10, 20], [20, 80], [0, 2]) },
];

export const SECTION_BY_CODE: Record<string, Section> = Object.fromEntries(SECTIONS.map((s) => [s.code, s]));
