export interface Term {
  term: string;
  description: string;
}

/** Related terms shown on each report, by TEÁOR section. */
export const GLOSSARY: Record<string, Term[]> = {
  A: [
    { term: "Single Area Payment (SAPS)", description: "EU direct support paid to Hungarian farmers per hectare of eligible land." },
    { term: "Arable land", description: "Land used for growing annual crops such as cereals, oilseeds and vegetables." },
    { term: "Hectare (ha)", description: "A unit of land area equal to 10,000 square metres." },
  ],
  B: [
    { term: "Concession fee", description: "A payment to the state for the right to extract mineral resources." },
    { term: "Overburden", description: "Rock and soil removed to reach a mineral deposit." },
    { term: "Reserves", description: "The part of a deposit that can be extracted economically." },
  ],
  C: [
    { term: "Tier-1 supplier", description: "A manufacturer that supplies components directly to large assembly plants." },
    { term: "Greenfield investment", description: "A new plant built from scratch, often supported by Hungarian state incentives." },
    { term: "Capacity utilisation", description: "Share of installed production capacity actually in use." },
  ],
  D: [
    { term: "Regulated tariff", description: "A state-set energy price paid by eligible households." },
    { term: "Feed-in tariff (METÁR)", description: "Hungary's support scheme for renewable electricity generation." },
    { term: "Capacity (MW)", description: "The maximum power output a plant can deliver." },
  ],
  E: [
    { term: "Utility fee freeze (rezsicsökkentés)", description: "Hungary's regulated household utility pricing scheme." },
    { term: "Landfill tax", description: "A levy on waste sent to landfill, designed to promote recycling." },
    { term: "Circular economy", description: "An approach that keeps materials in use for as long as possible." },
  ],
  F: [
    { term: "Housing subsidy (CSOK)", description: "Government support for families buying or building homes." },
    { term: "Construction permit", description: "Official approval needed before building work begins." },
    { term: "Public procurement", description: "Government purchasing of construction and infrastructure projects." },
  ],
  G: [
    { term: "Like-for-like sales", description: "Sales growth measured on stores open in both periods." },
    { term: "Margin cap", description: "Temporary Hungarian rules limiting retail margins on selected goods." },
    { term: "E-commerce penetration", description: "Share of retail sales made online." },
  ],
  H: [
    { term: "Road toll (e-útdíj)", description: "Distance-based charge on heavy goods vehicles in Hungary." },
    { term: "Modal split", description: "Share of freight or passenger traffic carried by each transport mode." },
    { term: "Last-mile delivery", description: "The final leg of a parcel's journey to the customer." },
  ],
  I: [
    { term: "Tourist tax", description: "A local levy paid by visitors per night of stay." },
    { term: "RevPAR", description: "Revenue per available room, a hotel performance measure." },
    { term: "SZÉP Card", description: "A tax-favoured employee benefit card usable for accommodation and dining." },
  ],
  J: [
    { term: "5G rollout", description: "Deployment of fifth-generation mobile networks across Hungary." },
    { term: "ARPU", description: "Average revenue per user, a telecom performance measure." },
    { term: "Nearshoring", description: "Outsourcing IT work to nearby countries such as Hungary." },
  ],
  K: [
    { term: "Base rate (MNB)", description: "The central bank policy rate that anchors Hungarian lending and deposit rates." },
    { term: "Net interest margin", description: "The gap between interest earned on loans and paid on deposits." },
    { term: "Solvency II", description: "EU regulatory framework for insurers' capital requirements." },
  ],
  L: [
    { term: "Yield", description: "Annual rental income as a share of property value." },
    { term: "Price per m²", description: "A standard measure of Hungarian property prices." },
    { term: "Vacancy rate", description: "The share of floor space that is unoccupied." },
  ],
  M: [
    { term: "Billable hours", description: "Time charged to clients, the main revenue driver for professional firms." },
    { term: "Chamber membership", description: "Mandatory registration with a professional chamber in some regulated trades." },
    { term: "Utilisation rate", description: "Share of working time that is billed to clients." },
  ],
  N: [
    { term: "Agency work", description: "Temporary staff supplied to client firms by an employment agency." },
    { term: "Outsourcing", description: "Contracting support functions to an external provider." },
    { term: "Minimum wage", description: "The statutory monthly minimum set by the government." },
  ],
  O: [
    { term: "Central budget", description: "The annual spending plan of the Hungarian state." },
    { term: "Public employee", description: "A person employed by government bodies." },
    { term: "Municipal funding", description: "Transfers from the central budget to local governments." },
  ],
  P: [
    { term: "Vocational training (szakképzés)", description: "School-based technical education linked to employers." },
    { term: "Student headcount", description: "Number of enrolled pupils and students." },
    { term: "Tuition fee", description: "Charges paid by self-funded students in higher education." },
  ],
  Q: [
    { term: "NEAK", description: "The National Health Insurance Fund that pays for most Hungarian healthcare." },
    { term: "Private health insurance", description: "Voluntary cover for faster access or extra services." },
    { term: "Waiting time", description: "Time between referral and treatment." },
  ],
  R: [
    { term: "TAO support", description: "Corporate tax-funded support for Hungarian team sports." },
    { term: "Gaming licence", description: "State authorisation required to offer gambling services." },
    { term: "Attendance", description: "Number of visitors to events or venues." },
  ],
  S: [
    { term: "KATA", description: "A former simplified tax regime for small independent contractors." },
    { term: "Footfall", description: "The number of customers visiting a location." },
    { term: "Repair economy", description: "Businesses that extend the life of goods through repair." },
  ],
  T: [
    { term: "Domestic staff", description: "People employed by households for housework or care." },
    { term: "Own-use production", description: "Goods and services made by households for their own consumption." },
    { term: "Undeclared work", description: "Paid activity not reported to authorities." },
  ],
  U: [
    { term: "Diplomatic mission", description: "An embassy or consulate of a foreign state." },
    { term: "International organisation", description: "A body set up by agreement between states." },
    { term: "Extraterritoriality", description: "Exemption from local jurisdiction." },
  ],
};
