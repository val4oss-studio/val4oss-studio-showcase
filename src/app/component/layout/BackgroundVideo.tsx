'use client';
/*
 * BackgroundVideo — Ambient video layer scrubbed by the page scroll.
 *
 * The clip never plays on its own: its currentTime is mapped to the document
 * scroll progress (top of page = first frame, bottom = last frame), then eased
 * toward that target so the motion stays fluid between two scroll events.
 * Same rAF + passive listener pattern as SectionConnector.
 *
 * Most visitors are on mobile, so the layer ships everywhere — but phones get
 * a downscaled encode: the clip ends up dimmed under a tint, so resolution is
 * the cheapest thing to give up. Frame count is not — see docs/background_video.md.
 */

import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';

/*
 * Two encodes of the same clip. H.264 rather than VP9 on purpose: scrubbing
 * seeks on every frame, and iOS decodes VP9 in software while H.264 gets
 * hardware acceleration everywhere. Both are encoded with a short, fixed GOP
 * so a seek never has to decode more than a handful of frames.
 */
const VIDEO_SOURCES = {
  mobile:  '/background_video_mobile.mp4',
  desktop: '/background_video.mp4',
} as const;

type VideoVariant = keyof typeof VIDEO_SOURCES;

/* 48rem — same breakpoint as the rest of the design system */
const WIDE_VIEWPORT_QUERY = '(min-width: 48rem)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/* Share of the remaining distance covered each frame: 0 = frozen, 1 = raw jump */
const SMOOTHING = 0.12;

/* Below this gap (in seconds) the frame is settled — stop the rAF loop */
const SETTLED_THRESHOLD = 0.01;

export function BackgroundVideo(): JSX.Element | null {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<VideoVariant | null>(null);
  const [sourceFailed, setSourceFailed] = useState(false);

  /* Pick the encode for this viewport — re-evaluated on rotation, and on a
     system motion-preference change, which drops the layer entirely. */
  useEffect(() => {
    const viewport = window.matchMedia(WIDE_VIEWPORT_QUERY);
    const motion = window.matchMedia(REDUCED_MOTION_QUERY);

    const sync = (): void => {
      if (motion.matches) {
        setVariant(null);
        return;
      }
      setVariant(viewport.matches ? 'desktop' : 'mobile');
    };

    /*
     * Purely decorative: hold the download until the page has loaded so it
     * never competes with the hero image and the fonts for bandwidth — the
     * difference is worth several seconds on a phone over 4G.
     */
    if (document.readyState === 'complete') {
      sync();
    } else {
      window.addEventListener('load', sync, { once: true });
    }

    viewport.addEventListener('change', sync);
    motion.addEventListener('change', sync);

    return () => {
      window.removeEventListener('load', sync);
      viewport.removeEventListener('change', sync);
      motion.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!variant) return;

    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let target = 0;  /* video time the scroll asks for */
    let current = 0; /* video time actually applied, eased toward target */

    const readScroll = (): void => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const duration = Number.isFinite(video.duration) ? video.duration : 0;

      target = Math.max(0, Math.min(1, progress)) * duration;
    };

    const tick = (): void => {
      current += (target - current) * SMOOTHING;

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        video.currentTime = current;
      }

      /* Idle as soon as the frame has settled — no permanent rAF loop */
      raf = Math.abs(target - current) > SETTLED_THRESHOLD
        ? requestAnimationFrame(tick)
        : 0;
    };

    const onScroll = (): void => {
      readScroll();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    /*
     * iOS leaves the decoder cold until the clip has played once, which makes
     * the first currentTime seeks unreliable. A muted + playsInline clip is
     * allowed to autoplay, so prime the decoder then pause immediately.
     * Rejection (Low Power Mode) is harmless — seeking still works, it just
     * stays coarse until the first touch.
     */
    const prime = (): void => {
      video.play().then(() => video.pause()).catch(() => undefined);
    };

    video.addEventListener('loadedmetadata', onScroll);
    video.addEventListener('loadeddata', prime, { once: true });
    /* passive: true — the scroll listener never blocks the main thread */
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll(); /* initial sync: restored scroll position, anchor links… */

    return () => {
      video.removeEventListener('loadedmetadata', onScroll);
      video.removeEventListener('loadeddata', prime);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [variant, sourceFailed]);

  if (!variant) return null;

  /* The mobile encode is a build artefact, not a repo file — if it is missing,
     fall back to the full one rather than dropping the background silently. */
  const source = sourceFailed ? VIDEO_SOURCES.desktop : VIDEO_SOURCES[variant];

  return (
    <div className="bg-video-layer" aria-hidden="true">
      <video
        ref={videoRef}
        className="bg-video"
        src={source}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        onError={() => setSourceFailed(true)}
      />
      <div className="bg-video-tint" />
    </div>
  );
}
