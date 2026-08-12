# पहला प्यार — Pehla Pyaar

> A one-page nostalgia site for school-se-shuru love stories — the ones that went the
> distance and the ones that didn't. Built in the same spirit as
> [Truck Wala / Horn OK Please](https://hornokplease.xyz/), but the highway-trucker
> aesthetic is swapped for ruled-notebook, mixtape-era teenage romance (2010–2017).

---

## 1. What makes the reference site work

Before copying the aesthetic, it helps to name what it's actually doing:

- **One dominant visual metaphor** — a cassette "loading" inside truck-art framing.
  Everything else (color, type, copy) supports that one image.
- **Bilingual title stack** — a big Hindi headline + Roman-script subtitle
  (देवनागरी for feel, English for readability).
- **A single playlist, no clutter** — one embedded YouTube Music playlist, a
  play button, nothing else competing for attention.
- **Saturated, era-specific palette** — deep teal/green (`#0a4a50`), not generic
  "Indian flag" colors. It's specific to truck-art paint, not a stereotype grab-bag.
- **A tiny bit of humor/superstition text** — "बुरी नज़र वाले तेरा मुँह काला" (the
  classic truck-back line) — signals authenticity over polish.

Your version should find the equivalent "one true metaphor" for teenage first love
in the 2010–2017 window, not just reskin the truck theme with hearts.

## 2. Suggested core metaphor

Pick **one** of these as the site's visual anchor (don't mix all of them):

| Metaphor | Why it fits 2010–2017 school romance |
|---|---|
| **A folded notebook page / love letter unfolding** | Passing notes in class was still very real pre-2015 |
| **A "loading" WhatsApp/BBM chat bubble with typing dots** | The texting-era equivalent of the cassette loading |
| **A mixtape/CD with marker handwriting** ("Ye gaana tere liye hai") | Matches the cassette idea almost 1:1, just one format later |
| **A school ID card / attendance register flipping open** | Ties directly to "starts at school" |

Recommendation: **notebook page + handwritten marker CD label**, combined —
opening shot is a spiral notebook page turning to reveal the playlist, styled like
a mixtape label was scribbled on it.

## 3. Visual language

**Color palette** — pick one dominant + one accent, not a rainbow:
- Faded notebook-blue (`#2b4c7e`) or ruled-paper cream (`#f4ecd8`) as base
- One saturated accent: rose-red (`#c23b4b`) or Bollywood-poster orange (`#e2711d`)
- Keep it as restrained as the reference site's single teal — resist adding gold/glitter

**Typography**
- Headline: a Devanagari font with personality (Baloo 2, Hind, or Tiro Devanagari
  Hindi) for पहला प्यार
- Body/English: a handwriting or marker-style font (Caveat, Kalam, Patrick Hand)
  for the "notebook scribble" feel — Kalam is literally designed to look like Hindi
  students' handwriting extended to Latin script, very on-theme
- Avoid clean sans-serifs except for small UI text (play/pause, credits)

**Texture**
- Paper grain / ruled-notebook-line background (subtle, not busy)
- Slight rotation/skew on elements (like a photo taped in at an angle)
- Doodles: small hearts, initials in a heart, arrows, "4EVER", a broken heart for
  the "some people split" side — these can literally be hand-drawn/scanned

**Motion**
- One key animation only, like the cassette-loading spinner: e.g. a page turning,
  ink "writing itself" across the headline, or a typing-dots bubble

## 4. Content structure (mirrors the reference site 1:1)

```
[eyebrow tag]     "Class of 20XX" or "स्कूल से शुरू"
[playlist link]   YouTube Music playlist embed
[headline hindi]  पहला प्यार
[headline roman]  Pehla Pyaar
[tagline]         one line of shayari/Hindi text — bittersweet, not just cute
[hero visual]     notebook/mixtape animation, loading state
[player]          embedded playlist, minimal chrome — 0:00 / 0:00 like the ref
[footer note]     small credit / "made with ❤️ and 2010s heartbreak"
```

Keep it **one page, one playlist, one visual** — the reference site's power is
restraint, not density.

## 5. Playlist curation notes

Since the emotional arc is "starts sweet, some go long, some split" — consider
splitting the single playlist into a **loose three-act order** rather than random
shuffle: early-love upbeat tracks → longing/distance tracks → breakup/moving-on
tracks. 2010–2017 gives you a strong natural pool (Bollywood + Indi-pop of that
era leaned hard into exactly this arc). You don't need a genre outside that
window — staying strictly 2010–2017 is what will make it feel like a specific
mixtape rather than a generic love-songs playlist.

## 6. Where to generate the images

For hand-drawn/notebook-style assets (doodles, torn paper, marker textures, the
CD-label lettering), AI image generators work well since you need a **consistent
illustration style**, not photography:

- **Ideogram** (ideogram.ai) — currently the strongest for rendering actual text/
  lettering cleanly (Hindi headlines, marker-style English words), which matters
  a lot for a design built around handwritten text
- **Midjourney** (midjourney.com) — best raw illustration quality for
  notebook-doodle / scrapbook textures; use `--style raw` with references to
  keep it from going too polished/glossy
- **Adobe Firefly** (firefly.adobe.com) — good if you want commercially-safe
  licensing for a public site, and has a nice "sketch"/texture style preset
- **Leonardo.Ai** (leonardo.ai) — has fine-tuned models specifically for sticker/
  doodle/scrapbook aesthetics, useful for the small heart/arrow doodle assets
- **Canva's Magic Media** (canva.com) — if you want to generate *and* lay out
  the page assets in the same tool, fastest path from image to finished graphic

For real photo-texture elements (actual ruled paper, torn notebook edges, old
CD/cassette photos, corkboard), skip AI and use stock instead — it'll look more
authentic than an AI approximation of a physical texture:

- **Unsplash** (unsplash.com) and **Pexels** (pexels.com) — free, search "notebook
  paper texture," "old cassette tape," "school desk," "polaroid photos"
- **Freepik** (freepik.com) — has a huge library of pre-made scrapbook/doodle PNG
  assets (hearts, tape, torn paper) if you'd rather not generate from scratch

**Practical tip:** generate/collect 8–10 doodle assets (hearts, arrows, tape
strips, torn corners) as individual transparent PNGs rather than one big
illustration — that way you can scatter them across the page like stickers,
which is closer to how the reference site's truck-art framing reads as "assembled
from real objects" rather than one flat graphic.

## 7. Naming ideas

Keeping the same "Hindi phrase + one plain English word" pattern as "Truck Wala":
- **Pehla Pyaar** (पहला प्यार) — direct, matches your brief exactly
- **Notebook Wale** (नोटबुक वाले) — playful callback to "Truck Wala"'s "-wala" suffix
- **Woh Pehli Mohabbat** — slightly more literary/shayari-leaning
