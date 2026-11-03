# Light headings variant (saved 2026-11-02)

What production showed on 2026-11-02 when Vercel paired the `showcase` pages with the old `main`
stylesheet (stale build cache). The client liked the lighter section headings and may want them.
Measured on https://site-tripas.vercel.app/en (commit 72bfce4) against localhost (`showcase` 23deab1).

## Side by side

| Element | Light variant (production) | `showcase` now |
|---|---|---|
| Hero headline (h1) | 103.5px / 48px mobile, **600**, sentence case, -0.03em | same (set on the element, unaffected) |
| Hero subline | 22.4px, 400 | same |
| Section headings (h2: "Homes you could live in…", "Why book direct.", reviews, how it works) | **56px** desktop / 32.6px mobile, **300**, sentence case, -0.03em, line-height 1.06 | 63.2px / 32px, 600, -0.035em, line-height 1 |
| Card titles (h3: "For two", perk titles) | 22px, **300**, **sentence case**, normal tracking | 22px, 600, **UPPERCASE**, +0.02em |
| FAQ questions (h3) | 17px, 600, sentence case | 17px, 600, UPPERCASE, +0.02em |
| Experience titles (h3) | 22px, 600, sentence case | same |
| Caps labels (nav, EN/PT, "Book direct", rating, eyebrows) | **12px, 500**, uppercase, **0.16em** | 13px, 600, uppercase, 0.1em |
| Cookie banner title (h2) | 30px, 300 | 36px, 600 |
| Why book direct background | none (the `pop` colour didn't exist in that stylesheet) | `bg-pop` #cbc2b4 |

## The CSS behind the light variant (old `main` globals.css)

```css
--text-h2: clamp(2rem, 1.45rem + 2.4vw, 3.5rem);   /* 32px → 56px */
--text-h2--line-height: 1.06;
--text-h2--letter-spacing: -0.03em;
--text-h3: clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem);
--text-h3--line-height: 1.15;
--text-h3--letter-spacing: -0.02em;
--text-label: 0.75rem;                 /* 12px */
--text-label--line-height: 1.2;
--text-label--letter-spacing: 0.16em;

@layer base {
  h1, h2, h3, h4 { font-weight: 300; text-wrap: balance; }   /* no h3 uppercase rule */
}
.label { /* size/line-height/tracking from the tokens above */ text-transform: uppercase; font-weight: 500; }
```

## To adopt it on `showcase`

In `src/app/globals.css`: set `h1, h2, h3, h4` (and the `h1, h2` rule) to `font-weight: 300`, drop the
`h3` uppercase/tracking rule, use the `--text-h2` clamp above. Keep the hero h1 at 600 (its own class)
unless the light look should reach the hero too. Decide separately whether the caps labels go back to
12px/500/0.16em: the nav was just set to 13px/600/0.1em on request, so that part may stay.
