import { privacy } from "@/content/legal";
import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";

export function generateMetadata() {
  return legalMetadata(privacy, "/privacy");
}

export default function Page() {
  return <LegalPage doc={privacy} />;
}
