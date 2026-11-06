import { cacheLife } from "next/cache";
import { faq } from "@/content/faq";
import { site } from "@/content/site";
import { getBuildings, getListings, getNeighbourhoods } from "@/lib/data";
import { createFormatter } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";

/**
 * /llms.txt: a plain summary of the business, the homes and the FAQ for AI assistants (ChatGPT,
 * Claude and others; see llmstxt.org), linking to the pages that hold the details. Built from the
 * same data as the site; answers still marked TO CONFIRM are left out so assistants don't repeat
 * them. Prices change daily, so none are quoted here.
 */
async function build(): Promise<string> {
  "use cache";
  cacheLife("hours");
  const [listings, buildings, neighbourhoods] = await Promise.all([
    getListings("en"),
    getBuildings(),
    getNeighbourhoods("en"),
  ]);
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.name} rents apartments in restored historic buildings in central Porto, Portugal, run by a local team since ${site.foundedYear} and welcoming more than ${createFormatter("en").number(site.guestsPerYear)} guests a year. Guests can book directly on this website (also listed on Airbnb and Booking.com).`,
    "",
    `- Website (Portuguese): ${absoluteUrl("pt", "/")}`,
    `- Website (English): ${absoluteUrl("en", "/")}`,
    `- All apartments: ${absoluteUrl("en", "/apartments")}`,
    `- Contact: ${site.phone} (also WhatsApp), ${site.email}`,
    `- Office: ${site.address.street}, ${site.address.postalCode} ${site.address.city}, ${site.address.country}`,
    "",
    "## Apartments",
    "",
  ];
  for (const building of buildings) {
    const homes = listings.filter((l) => l.buildingId === building.id);
    if (!homes.length) continue;
    lines.push(`### ${building.name}`, "");
    for (const l of homes) {
      const facts = [
        `sleeps ${l.accommodates}`,
        l.bedrooms ? `${l.bedrooms} bedroom${l.bedrooms > 1 ? "s" : ""}` : "studio",
        `${Math.max(1, Math.floor(l.bathrooms))} bathroom${l.bathrooms >= 2 ? "s" : ""}`,
        l.areaSqm ? `${l.areaSqm} m²` : "",
        l.address.street,
      ].filter(Boolean);
      lines.push(`- [${l.title}](${absoluteUrl("en", { pathname: "/apartments/[slug]", params: { slug: l.slug } })}): ${facts.join(", ")}.`);
    }
    lines.push("");
  }
  lines.push("## Neighbourhoods", "");
  for (const n of neighbourhoods) lines.push(`- **${n.name}**: ${n.intro}`);
  lines.push("", "## Frequently asked questions", "");
  for (const item of faq.filter((f) => !f.toConfirm)) lines.push(`### ${item.question.en}`, "", item.answer.en, "");
  return lines.join("\n");
}

export async function GET() {
  return new Response(await build(), { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
