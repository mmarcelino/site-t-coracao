import { cookies } from "@/content/legal";
import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";

export function generateMetadata() {
  return legalMetadata(cookies, "/cookies");
}

export default function Page() {
  return <LegalPage doc={cookies} />;
}
