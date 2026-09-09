# Scroll-Scrubbed Background Video

Ambient video layer behind the whole page, whose playhead is driven by the
scroll position instead of by time. Portable recipe — reusable on any client
site built on this stack.

---

## How it works

```
window scroll  →  progress 0..1  →  eased  →  video.currentTime
                                                    ↓
  html (page colour)  <  .bg-video-layer (fixed)  <  main / footer (z-index 1)
                            video + tint
```

The clip never plays. Every frame is reached by seeking, which is why the
encode matters more than anything else here.

---

## 1. Encode the clip

Two encodes of the same source: phones download a quarter of the pixels.
`libopenh264` is Cisco's H.264 encoder, shipped in patent-free ffmpeg builds
(`ffmpeg-free` on Fedora/RHEL) — no proprietary package to install.

```bash
SRC=path/to/source.mp4

# Desktop — 960x540
ffmpeg -i "$SRC" -c:v libopenh264 \
  -vf scale=960:-2 -pix_fmt yuv420p \
  -g 12 -keyint_min 12 \
  -b:v 900k \
  -movflags +faststart -an \
  public/background_video.mp4

# Mobile — 480x270
ffmpeg -i "$SRC" -c:v libopenh264 \
  -vf scale=480:-2 -pix_fmt yuv420p \
  -g 12 -keyint_min 12 \
  -b:v 350k \
  -movflags +faststart -an \
  public/background_video_mobile.mp4
```

### Why these flags

| flag | why |
| --- | --- |
| `-c:v libopenh264` | H.264 is hardware-decoded everywhere. iOS decodes VP9 in **software**, which stutters badly when seeking on every frame. |
| `-g 12 -keyint_min 12` | A keyframe every 12 frames. A seek decodes at most 11 extra frames (2–3 ms at these sizes). All-keyframe (`-g 1`) works too but is 4–5x the file size for no gain. |
| `-movflags +faststart` | Moves the `moov` index to the front. Without it the browser must download the whole file before it can seek. |
| `-pix_fmt yuv420p` | Safari/iOS compatibility. |
| `-b:v` | `libopenh264` has no `-crf`. Size ≈ `bitrate × duration ÷ 8` — 350k over 10 s ≈ 440 KB. |
| `-an` | The clip is silent and never plays. |
| no `-r` | Deliberate: keeps every source frame. See below. |

### Sizing rule — frame count is what makes it smooth

The stutter people report is almost never the keyframes. It is having too few
frames spread over too much scroll:

```
scroll_px    ≈ (sections − 1) × viewport_height
px_per_frame = scroll_px ÷ frame_count        →  aim for ≤ 15 px
frame_count  = source_fps × duration          →  capped by the source
```

A 24 fps / 10 s source gives 240 frames. Over ~3 400 px of phone scroll that
is one image every 14 px, or roughly 20 image changes per second at a normal
scroll speed — smooth. Halve the framerate and it becomes visibly steppy.

**Never set `-r` above the source framerate**: ffmpeg duplicates frames, the
file grows and nothing gets smoother. If the source is too short on frames,
`minterpolate` can synthesise real intermediate ones:

```bash
-vf "scale=480:-2,minterpolate=fps=48:mi_mode=mci:mc_mode=aobmc:vsbmc=1"
```

### Verify

```bash
ffprobe -v error -select_streams v:0 -count_frames \
  -show_entries stream=nb_read_frames,r_frame_rate,width,height \
  -show_entries format=duration,size \
  -of default=noprint_wrappers=1 public/background_video_mobile.mp4
```

Expect the full source frame count, and a size near `bitrate × duration ÷ 8`.
Keep only the two encodes in `public/` — everything there is served publicly
and copied into the container image.

---

## 2. The component

`src/app/component/layout/BackgroundVideo.tsx` — client component, mounted
once in the layout.

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';

const VIDEO_SOURCES = {
  mobile:  '/background_video_mobile.mp4',
  desktop: '/background_video.mp4',
} as const;

type VideoVariant = keyof typeof VIDEO_SOURCES;

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

    /* Decorative: hold the download until the page has loaded so it never
       competes with the hero image and the fonts for bandwidth. */
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

    /* iOS leaves the decoder cold until the clip has played once, which makes
       the first seeks unreliable. A muted + playsInline clip may autoplay, so
       prime it then pause. Rejection (Low Power Mode) is harmless. */
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
```

Export it from `src/app/component/layout/index.ts`:

```ts
export { BackgroundVideo } from './BackgroundVideo';
```

### What each part buys you

* **`SMOOTHING` (lerp)** — without it the playhead jumps straight to the
  target and the motion looks mechanical. It eases between scroll events.
* **rAF that stops when settled** — no permanent animation loop draining the
  battery once the user stops scrolling.
* **Deferred download** — nothing is fetched until `window.load`, so a
  decorative asset never delays the LCP on a slow connection.
* **iOS priming** — `play()` then `pause()` wakes the decoder; without it the
  first seeks on Safari are unreliable.
* **`prefers-reduced-motion`** — the layer is not rendered at all, not merely
  hidden.
* **`onError` fallback** — a missing mobile encode falls back to the full one
  rather than leaving a blank background.

---

## 3. The CSS

### Base layer — the stacking trap

A `position: fixed` layer inside `<body>` is painted **over** by an opaque
`body` background. Give the page colour to `html` only:

```css
@layer base {
  /* html paints the canvas; body stays transparent so the fixed
     .bg-video-layer shows through behind the content. */
  html {
    background-color: var(--color-bg-page);
    scroll-behavior: smooth;
  }

  body {
    background-color: transparent;
  }
}
```

### The layer itself

```css
@layer components {
  .bg-video-layer {
    position: fixed;
    inset: 0;
    height: 100lvh; /* lvh: no gap when the mobile URL bar collapses */
    z-index: 0;
    pointer-events: none;
    isolation: isolate; /* confines the tint blend mode to this layer */
    animation: var(--animate-fade-in); /* mounted client-side, so fade it in */
  }

  .bg-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(0.5) contrast(1.1) brightness(0.55);
    opacity: 0.45;
    mask-image: radial-gradient(
      ellipse 90% 80% at 50% 45%,
      #000 30%,
      transparent 95%
    );
    -webkit-mask-image: radial-gradient(
      ellipse 90% 80% at 50% 45%,
      #000 30%,
      transparent 95%
    );
  }

  /* Page-coloured veil — drowns the clip back into the palette */
  .bg-video-tint {
    position: absolute;
    inset: 0;
    background: var(--color-bg-page);
    opacity: 0.55;
  }

  /* Pushes the remaining greys towards the brand accent */
  .bg-video-tint::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color-gold);
    mix-blend-mode: color;
    opacity: 0.35;
  }
}
```

### Tuning knobs

Three values, set by eye, in this order:

1. `.bg-video { opacity }` — how present the motion is (0.15 → 0.50).
2. `.bg-video-tint { opacity }` — how hard the palette pulls it back
   (0.40 → 0.70).
3. `.bg-video-tint::after { opacity }` — how strongly it is re-tinted.

`grayscale()` and the `mix-blend-mode: color` layer together guarantee the
clip **cannot** leave the palette, whatever its original colours. If the
source already matches the brand, lower the `grayscale()` to keep its own
tones instead of rebuilding them.

On a client site, swap `--color-bg-page` and `--color-gold` for that project's
tokens — nothing else here is brand-specific.

---

## 4. Wire it into the layout

`src/app/[locale]/layout.tsx`. The layer must be a **direct child of
`<body>`** — a `filter`, `transform` or `will-change` on any ancestor would
break `position: fixed`.

```tsx
import { BackgroundVideo, Footer } from '@/app/component/layout';

// …

<body className="min-h-full flex flex-col">
  <BackgroundVideo />
  <main className="relative z-1 flex-1">
    {children}
  </main>
  <Footer … />
</body>
```

Then lift every sibling above the layer. `main` gets `relative z-1` inline;
the footer already has `position: relative`, so it only needs the index:

```css
  .footer {
    position: relative;
    z-index: 1; /* above .bg-video-layer */
    /* … */
  }
```

Sections need nothing: they have no background of their own, so the video
shows through them.

---

## Checklist

- [ ] Two encodes in `public/`, nothing else — that folder ships publicly.
- [ ] `nb_read_frames` equals the source frame count on both.
- [ ] `≤ 15 px` of scroll per frame at the target viewport.
- [ ] `html` opaque, `body` transparent.
- [ ] `main` and the footer at `z-index: 1`.
- [ ] Server answers `206 Partial Content` on a `Range` request — Safari
      refuses to play a video otherwise.
- [ ] Test on a real phone: check heat and battery, not just smoothness.

---

## Variants

**More frames without more bytes.** If the clip is short on frames, map the
scroll to a there-and-back pass — `progress` 0→0.5 plays forward, 0.5→1
rewinds. Doubles the frames per pixel for free, and unlike a plain loop there
is no seam, since it turns around on the last frame.

**Per-section scrubbing.** Map to a single section's
`getBoundingClientRect()` instead of the document, the way `SectionConnector`
does, when the video should only animate across one part of the page.
