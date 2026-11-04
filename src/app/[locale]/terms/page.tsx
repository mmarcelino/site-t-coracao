import { terms } from "@/content/legal";
import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";

export function generateMetadata() {
  return legalMetadata(terms, "/terms");
}

export default function Page() {
  return <LegalPage doc={terms} />;
}
