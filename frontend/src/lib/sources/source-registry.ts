export interface InstitutionalSource {
  id: string;
  name: string;
  shortCode?: string;
}

export const INSTITUTIONAL_SOURCES: InstitutionalSource[] = [
  { id: "drdo", name: "DRDO", shortCode: "drdo" },
  { id: "isro", name: "ISRO", shortCode: "isro" },
  { id: "csir", name: "CSIR", shortCode: "csir" },
  { id: "iit-delhi", name: "IIT Delhi", shortCode: "iit-delhi" },
  { id: "iit-bombay", name: "IIT Bombay", shortCode: "iit-bombay" },
  { id: "iit-madras", name: "IIT Madras", shortCode: "iit-madras" },
  { id: "iisc", name: "IISc Bangalore", shortCode: "iisc" },
];
