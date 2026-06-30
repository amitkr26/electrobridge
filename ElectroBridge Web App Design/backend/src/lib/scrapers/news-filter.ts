const BLOCKED_PATTERNS = [
  /mango/i, /cricket/i, /bollywood/i, /movie\s+review/i,
  /entertainment/i, /kollywood/i, /tollywood/i, /recipe/i,
  /horoscope/i, /astrology/i, /cooking/i, /beauty\s+tips/i,
  /fashion/i, /wedding/i, /pregnancy/i, /baby\s+care/i,
  /weight\s+loss/i, /hair\s+care/i, /skin\s+care/i, /kl\s*rahu/i,
  /politics/i, /election/i, /sports/i, /football/i, /ufc/i,
  /wwe/i, /movie\s+release/i, /box\s+office/i, /song/i, /album/i,
  /celebrit/i, /gossip/i, /cricket\s+score/i, /ipl/i, /kabaddi/i,
  /obituary/i, /death\s+notice/i, /classified/i, /advertisement/i,
  /sponsored/i, /promoted/i, /paid\s+content/i,
];

const ELECTRONICS_KEYWORDS = [
  "semiconductor", "electronics", "vlsi", "vls i", "chip", "microchip",
  "transistor", "wafer", "fab", "foundry", "embedded", "microcontroller",
  "fpga", "asic", "pcb", "circuit", "sensor", "mems", "photonics",
  "optoelectronics", "spintronics", "antenna", "radar", "rf",
  "signal processing", "power electronics", "battery", "solar cell",
  "led", "laser", "nanotechnology", "nanoelectronics", "quantum dot",
  "graphene", "silicon", "gallium", "gan", "sic", "germanium", "indium",
  "intel", "nvidia", "tsmc", "samsung", "qualcomm", "amd", "arm",
  "broadcom", "texas instruments", "analog devices", "synopsys", "cadence",
  "drdo", "isro", "csir", "barc", "semicon india", "india semiconductor mission",
  "chip design", "e da", "electronic design automation", "soc", "system on chip",
  "5g", "6g", "iot", "ai chip", "neural processing", "edge computing",
  "electric vehicle", "ev battery", "motor drive", "inverter",
  "space electronics", "satellite", "defence electronics",
  "thin film", "printed circuit", "electronics weekly", "eetimes",
  "advanced packaging", "chiplets", "hybrid bonding", "euv", "lithography",
  "memory", "dram", "nand", "flash", "ssd", "cpu", "gpu",
  "risc v", "open source hardware", "industry 4.0",
  "vlsi design", "digital design", "analog design", "mixed signal",
  "verilog", "vhdl", "systemverilog", "uvm", "physical design",
  "phd", "fellowship", "postdoc", "research position", "jrf",
  "research assistant", "srf", "project assistant", "junior research fellow",
  "senior research fellow", "research associate", "scientist",
  "faculty position", "assistant professor", "associate professor", "professor",
  "iisc", "iit", "nit", "iiit", "tifr", "rri", "ceeri",
  "quantum computing", "quantum technology", "robotics",
  "telecom", "optical communication", "fiber optic",
  "integrated photonics", "silicon photonics",
  "heterogeneous integration", "through silicon via", "tsv",
  "2.5d", "3d ic", "system in package", "sip",
];

function matchesAny(text: string, patterns: string[]): boolean {
  const lower = text.toLowerCase();
  return patterns.some((pat) => lower.includes(pat));
}

function isBlocked(title: string, summary: string): boolean {
  return BLOCKED_PATTERNS.some((pat) => pat.test(title) || pat.test(summary));
}

function isElectronicsRelated(title: string, summary: string): boolean {
  return matchesAny(title, ELECTRONICS_KEYWORDS)
    || matchesAny(summary, ELECTRONICS_KEYWORDS);
}

export function isElectronicsNews(
  title: string,
  summary: string | null,
  tier: number = 1,
): boolean {
  const safeSummary = summary || "";
  if (isBlocked(title, safeSummary)) return false;
  if (tier === 1) return isElectronicsRelated(title, safeSummary);
  return matchesAny(title, ELECTRONICS_KEYWORDS);
}

interface TagRule {
  keywords: string[];
  tag: string;
}

const TAG_RULES: TagRule[] = [
  { keywords: ["tsmc", "samsung foundry", "intel foundry", "foundry", "fab", "wafer"], tag: "Foundry" },
  { keywords: ["euv", "lithography", "asml", "chiplet", "advanced packaging", "hybrid bonding", "2.5d", "3d ic", "fan out", "heterogeneous integration"], tag: "Advanced Packaging" },
  { keywords: ["transistor", "gate all around", "gaa", "nanosheet", "finfet", "cmos", "bcd"], tag: "Device Tech" },
  { keywords: ["silicon", "gan", "gallium", "wide bandgap", "power semiconductor", "silicon carbide"], tag: "Wide Bandgap" },
  { keywords: ["graphene", "quantum dot", "spintronics", "mems", "nems", "nano"], tag: "Nanotechnology" },
  { keywords: ["synopsys", "cadence", "mentor", "siemens eda", "ansys", "electronic design automation", "eda", "verilog", "vhdl", "systemverilog", "uvm"], tag: "EDA" },
  { keywords: ["soc", "system on chip", "asic", "fpga", "microcontroller", "risc v", "risc-v", "arm", "x86", "microarchitecture"], tag: "Chip Design" },
  { keywords: ["ai chip", "npu", "tensor", "neural processing", "hpu", "ml accelerator"], tag: "AI Chips" },
  { keywords: ["silicon carbide", "gan", "gallium nitride", "gallium arsenide", "gaas", "indium", "germanium", "wafer material", "substrate"], tag: "Materials" },
  { keywords: ["asml", "applied materials", "lam research", "kla", "tokyo electron", "teradyne", "test equipment", "metrology", "inspection", "semiconductor equipment"], tag: "Equipment" },
  { keywords: ["semiconductor market", "chip shortage", "chip supply", "chip demand", "revenue", "shipment", "unit shipment", "market share", "acquisition", "merger", "ipo"], tag: "Markets" },
  { keywords: ["chip act", "subsidy", "export control", "chip war", "trade", "tariff", "sanction", "policy"], tag: "Policy" },
  { keywords: ["india", "india semiconductor mission", "semicon india", "ies a", "esdm", "meity", "ceeri", "amey", "iit", "nit", "iiit", "iisc", "bangalore", "bengaluru", "hyderabad", "ahmedabad", "noida", "greater noida", "dholera"], tag: "India" },
  { keywords: ["phd", "fellowship", "postdoc", "jrf", "srf", "research position", "vacancy", "admission", "notification"], tag: "Jobs/Research" },
  { keywords: ["conference", "symposium", "workshop", "webinar", "summit", "expo", "exhibition", "trade show", "call for paper"], tag: "Events" },
  { keywords: ["iot", "sensor", "smart", "connected", "wireless", "bluetooth", "wifi", "zigbee", "lora"], tag: "IoT" },
  { keywords: ["electric vehicle", "ev", "battery technology", "bms", "charging", "power electronics", "inverter", "motor drive", "solid state battery"], tag: "EV/Power" },
  { keywords: ["5g", "6g", "rf", "mmwave", "antenna", "beamforming", "massive mimo", "telecom"], tag: "5G/6G" },
  { keywords: ["space", "satellite", "isro", "defence", "aerospace", "military", "radar", "sonar"], tag: "Aerospace & Defence" },
  { keywords: ["quantum computing", "quantum processor", "qubit", "quantum technology", "superconducting"], tag: "Quantum" },
  { keywords: ["intel", "amd", "nvidia", "qualcomm", "apple silicon", "ryzen", "xeon", "core ultra", "snapdragon", "dimensity", "exynos", "tensor"], tag: "Processors" },
  { keywords: ["chip", "semiconductor", "electronics", "wafer", "transistor", "circuit"], tag: "Semiconductor" },
];

const TAG_BLACKLIST = [
  "hips", "hip", "he", "hid", "she", "ie", "ear", "ice", "bill",
  "fine", "kind", "will", "just", "more", "also", "new", "first",
  "next", "last", "over", "open", "part", "some", "such", "than",
  "that", "them", "then", "this", "well", "said", "year", "make",
  "like", "time", "has", "had", "have", "from", "they", "what",
  "when", "where", "which", "who", "whom", "why", "how", "all",
  "any", "can", "not", "one", "two", "to", "for", "and", "the",
  "with", "was", "are"
];

const TAG_MAX = 6;

export function autoTagArticle(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const matches = new Set<string>();
  for (const rule of TAG_RULES) {
    for (const kw of rule.keywords) {
      if (kw.length <= 3) {
        const re = new RegExp(`\\b${kw}\\b`, "i");
        if (re.test(text)) { matches.add(rule.tag); break; }
      } else if (text.includes(kw)) { matches.add(rule.tag); break; }
    }
  }
  const filtered = Array.from(matches).filter(
    (tag) => !TAG_BLACKLIST.includes(tag.toLowerCase()),
  );
  return filtered.slice(0, TAG_MAX);
}