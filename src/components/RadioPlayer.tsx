import { useCallback, useEffect, useRef, useState } from "react";
import ReactYouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
const YouTube = (ReactYouTube as any).default || ReactYouTube;
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  Wifi,
  WifiOff,
  Users,
} from "lucide-react";
import { TRACKS } from "@/lib/tracks";

/* ─── helpers ────────────────────────────────────────────────── */

function fmt(s: number) {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/** Stable session id for this browser tab */
function getSessionId(): string {
  const key = "pp_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

/* ─── component ──────────────────────────────────────────────── */

export function RadioPlayer() {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPct, setBufferedPct] = useState(0); // 0-100
  const [volume, setVolume] = useState(80);
  
  // Start as true on server (avoids hydration mismatch), sync on client
  const [isOnline, setIsOnline] = useState(true);
  const [liveCount, setLiveCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const track = TRACKS[index]!;

  /* ── navigation ─────────────────────────────────────────────── */
  const next = useCallback(() => setIndex((i) => (i + 1) % TRACKS.length), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length),
    [],
  );

  /* ── online / offline ───────────────────────────────────────────── */
  useEffect(() => {
    // Sync actual value on client mount (server always renders as true)
    setIsOnline(navigator.onLine);

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  /* ── live user count ping ────────────────────────────────────── */
  useEffect(() => {
    const sessionId = getSessionId();
    const ping = async () => {
      if (!navigator.onLine) return;
      try {
        const res = await fetch("/api/ping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (typeof data.count === "number") setLiveCount(data.count);
      } catch {
        /* ignore – just keep last count */
      }
    };
    ping();
    const id = setInterval(ping, 15_000);
    return () => clearInterval(id);
  }, []);

  /* ── youtube polling ────────────────────────────────────────── */
  useEffect(() => {
    if (!player) return;
    
    // Set initial volume when player is ready
    player.setVolume(volume);

    const interval = setInterval(async () => {
      try {
        const state = await player.getPlayerState();
        
        // 1 = playing, 2 = paused, 3 = buffering, 5 = cued
        if (state === 1) {
          setPlaying(true);
          setIsLoading(false);
        } else if (state === 2 || state === 5) {
          setPlaying(false);
          setIsLoading(false);
        } else if (state === 3) {
          setIsLoading(true);
        }

        const currentTime = await player.getCurrentTime();
        if (currentTime !== undefined) setPosition(currentTime);

        const videoDuration = await player.getDuration();
        if (videoDuration !== undefined) setDuration(videoDuration);

        const loadedFraction = await player.getVideoLoadedFraction();
        if (loadedFraction !== undefined) setBufferedPct(loadedFraction * 100);
        
      } catch (e) {
        // Player might be destroyed or not fully ready
      }
    }, 500);

    return () => clearInterval(interval);
  }, [player]);

  /* ── track change logic ─────────────────────────────────────── */
  // Whenever the index changes, if we are playing, the YouTube component will auto-play
  // because we use the onReady / onStateChange to handle it.
  
  /* ── volume ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (player) {
      player.setVolume(volume);
    }
  }, [volume, player]);

  /* ── controls ───────────────────────────────────────────────── */
  const toggle = () => {
    if (!player) return;
    if (playing) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const seek = (value: number) => {
    if (player) {
      player.seekTo(value, true);
      setPosition(value);
    }
  };

  const changeVolume = (delta: number) =>
    setVolume((v) => Math.min(100, Math.max(0, v + delta)));

  /* ── youtube events ─────────────────────────────────────────── */
  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    setIsLoading(false);
    // Do not auto-play initially to respect browser policies,
    // only autoplay if we were already playing a previous track.
  };

  const onStateChange = (event: YouTubeEvent) => {
    // 0 = ended
    if (event.data === 0) {
      next();
    }
  };

  const onPlay = (event: YouTubeEvent) => {
    setPlaying(true);
    setIsLoading(false);
  };
  
  const onPause = (event: YouTubeEvent) => {
    setPlaying(false);
  };

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <div className="ipod-body w-full max-w-[19rem] rounded-[2.25rem] p-3.5 sm:max-w-[21rem] sm:p-4">
      {/* Hidden YouTube iframe */}
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
        <YouTube
          videoId={track.id}
          onReady={onReady}
          onStateChange={onStateChange}
          onPlay={onPlay}
          onPause={onPause}
          opts={{
            height: "0",
            width: "0",
            playerVars: {
              autoplay: playing ? 1 : 0, // Auto-play when switching tracks if already playing
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
            },
          }}
        />
      </div>

      {/* ── screen ──────────────────────────────────────────────── */}
      <div className="ipod-screen rounded-2xl px-3.5 py-3">

        {/* Status bar */}
        <div className="flex items-center justify-between text-[9px] tracking-[0.15em] text-paper/60 uppercase">
          <span className="flex items-center gap-1">
            {isLoading && playing ? (
              <span className="animate-pulse">⏳ Buffering…</span>
            ) : playing ? (
              "▶ Now Playing"
            ) : (
              "❚❚ Paused"
            )}
          </span>

          <div className="flex items-center gap-2">
            {/* Live user count */}
            <span className="flex items-center gap-1 text-paper/50">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
              </span>
              <Users className="size-2.5" />
              <span>{liveCount}</span>
            </span>

            {/* Online / Offline badge */}
            <span
              className={`flex items-center gap-0.5 font-semibold ${
                isOnline ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {isOnline ? (
                <Wifi className="size-2.5" />
              ) : (
                <WifiOff className="size-2.5" />
              )}
              <span>{isOnline ? "Online" : "Offline"}</span>
            </span>
          </div>
        </div>

        {/* Track artwork + info */}
        <div className="mt-3 flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={`https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`}
              alt={`${track.title} artwork`}
              width={72}
              height={72}
              loading="lazy"
              className={`size-16 rounded-full object-cover ring-2 ring-accent/50 ${
                playing ? "animate-record-spin" : ""
              }`}
            />
            <span className="pointer-events-none absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background ring-1 ring-paper/30" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-hand text-base leading-tight text-paper">
              {track.title}
            </p>
            <p className="truncate text-[10px] tracking-wide text-paper/60 uppercase">
              {track.artist} · {track.year}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <p className="font-mono text-[10px] text-paper/50 tabular-nums">
                {index + 1} / {TRACKS.length}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar with buffer overlay */}
        <div className="mt-3">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-paper/20">
            {/* Buffered (gray layer) */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-paper/30 transition-all duration-300"
              style={{ width: `${bufferedPct}%` }}
            />
            {/* Played (accent layer) */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-accent"
              style={{
                width: `${duration > 0 ? (position / duration) * 100 : 0}%`,
              }}
            />
            {/* Invisible range input on top for interaction */}
            <input
              type="range"
              min={0}
              max={Math.max(duration, 1)}
              value={Math.min(position, duration || 1)}
              aria-label="Seek"
              onChange={(e) => seek(Number(e.target.value))}
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
            />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-paper/55 tabular-nums">
            <span>{fmt(position)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>

      {/* ── click wheel ─────────────────────────────────────────── */}
      <div className="mt-4 flex justify-center pb-1">
        <div className="ipod-wheel relative grid size-44 place-items-center rounded-full sm:size-48">
          {/* Volume up (top) */}
          <button
            onClick={() => changeVolume(10)}
            aria-label="Volume up"
            className="absolute top-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-ink/55 uppercase transition hover:text-ink"
          >
            <Volume2 className="size-3" /> {volume}%
          </button>

          {/* Previous (left) */}
          <button
            onClick={prev}
            aria-label="Previous song"
            className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full p-2 text-ink/55 transition hover:text-ink"
          >
            <SkipBack className="size-4 fill-current" />
          </button>

          {/* Next (right) */}
          <button
            onClick={next}
            aria-label="Next song"
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-ink/55 transition hover:text-ink"
          >
            <SkipForward className="size-4 fill-current" />
          </button>

          {/* Volume down (bottom) */}
          <button
            onClick={() => changeVolume(-10)}
            aria-label="Volume down"
            className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-ink/55 uppercase transition hover:text-ink"
          >
            <Volume2 className="size-3" /> −
          </button>

          {/* Play / Pause (centre) */}
          <button
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="ipod-body grid size-18 place-items-center rounded-full text-ink transition active:scale-95 sm:size-20"
          >
            {playing ? (
              <Pause className="size-6 fill-current" />
            ) : (
              <Play className="size-6 translate-x-px fill-current" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
