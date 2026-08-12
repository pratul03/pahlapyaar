import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ListMusic, X } from "lucide-react";
import backdrop from "@/assets/public/school-backdrop.jpg";
import backdropMobile from "@/assets/public/school-backdrop-mobile.jpg";
import { RadioPlayer } from "@/components/RadioPlayer";
import { TRACKS } from "@/lib/tracks";

const TITLE = "पहला प्यार — Pehla Pyaar | 2015s school-love radio";
const DESCRIPTION =
  "A one-page nostalgia radio for school-se-shuru love stories. Hindi songs from the notebook-and-mixtape years, played end to end.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "music.radio_station" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const t = setInterval(tick, 15_000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-mono text-xs tracking-[0.25em] text-foreground/70 tabular-nums">
      {now ?? "--:--"}
    </span>
  );
}

function Index() {
  const [showList, setShowList] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <picture>
        <source media="(max-width: 767px)" srcSet={backdropMobile} />
        <img
          src={backdrop}
          alt="Two school students exchanging a folded paper note outside a small-town Indian school at golden hour"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
      </picture>
      <div className="absolute inset-0 bg-linear-to-b from-background/55 via-background/25 to-background/85" />

      <div className="relative flex min-h-screen flex-col px-4 py-5 sm:px-8">
        <header className="flex items-start justify-between gap-3">
          <Clock />
          <div className="hidden items-center gap-2 pt-0.5 sm:flex">
            <span className="size-2 animate-soft-pulse rounded-full bg-accent" />
            <span className="text-xs tracking-wide text-foreground/70">
              {TRACKS.length} songs · 2010–2017
            </span>
          </div>
          <button
            onClick={() => setShowList(true)}
            className="glass-panel inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-foreground/10"
          >
            <ListMusic className="size-3.5" />
            Songs
          </button>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <p className="font-hand text-sm tracking-[0.3em] text-foreground/70 uppercase">
            स्कूल से शुरू
          </p>
          <h1 className="animate-ink-in mt-3 font-display text-6xl leading-[0.95] text-paper text-shadow-poster sm:text-8xl md:text-9xl">
            पहला
            <br />
            प्यार
          </h1>
          <p className="mt-5 text-[11px] tracking-[0.42em] text-paper/85 uppercase text-shadow-poster">
            Pehla Pyaar · class of the 2015s
          </p>
          <p className="mt-6 max-w-md font-hand text-lg text-paper/90 text-shadow-poster">
            कुछ नाम किताब के आख़िरी पन्ने पर रह गए, कुछ ज़िंदगी भर साथ चले।
          </p>
          <p className="mt-6 max-w-md font-hand text-2xl text-paper/90 text-shadow-poster">
            Kuch naam kitaab ke aakhiri panne par reh gaye, kuch zindagi bhar saath chale.
          </p>
        </section>

        <footer className="flex flex-col items-center gap-4 pb-2">
          <RadioPlayer />
          <p className="font-hand text-xs text-foreground/60">
            made with ❤️ and for 2010s first love
          </p>
        </footer>
      </div>

      {showList && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm"
          onClick={() => setShowList(false)}
        >
          <div
            className="ruled-paper max-h-[70vh] w-full max-w-md -rotate-1 overflow-y-auto rounded-sm p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="font-hand text-2xl font-bold text-ink">
                Ye gaane tere liye
              </h2>
              <button
                onClick={() => setShowList(false)}
                aria-label="Close song list"
                className="rounded-full p-1 text-ink/60 transition hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>
            <ol className="mt-4 space-y-2.5 font-hand text-ink/90">
              {TRACKS.map((t, i) => (
                <li key={t.id} className="flex gap-3 text-base">
                  <span className="w-5 shrink-0 text-ink/50">{i + 1}.</span>
                  <span>
                    {t.title}{" "}
                    <span className="text-sm text-ink/55">
                      — {t.artist}, {t.year}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </main>
  );
}
