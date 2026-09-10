// ponytail: @google-cloud/documentai removed — not installed and not needed for
// the pdf-parse fallback path. Re-enable with `npm install @google-cloud/documentai`
// and uncomment the original implementation below if Document AI is required later.

// import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
// import { logger } from "@/lib/logger";

export async function parseWithDocumentAI(_pdfBuffer: Buffer) {
  throw new Error(
    'Document AI parser is not available. Install @google-cloud/documentai to enable.',
  );
}
