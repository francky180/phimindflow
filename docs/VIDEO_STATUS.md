# PHIMINDFLOW — Video Status

Last verified: 2026-04-01

## Status: FUNCTIONAL

The Remotion video subsystem is installed and has produced a rendered output.

## Technical Details

| Property | Value |
|----------|-------|
| Framework | Remotion 4.0.443 |
| Duration | 15 seconds (450 frames @ 30fps) |
| Resolution | 1920x1080 |
| Output | video/out/forex-video.mp4 (1.3 MB) |
| React | 19.2.4 |
| TypeScript | 6.0.2 |

## Scenes (6 total)

1. **Brand Intro** — PHIMINDFLOW title/brand reveal
2. **Problem** — Why most traders fail
3. **3-Step Process** — Broker → Course → Management flow
4. **Why This Order** — System explanation
5. **Results** — Performance indicators
6. **CTA** — Call to action with funnel entry

## File Structure

```
video/
├── src/
│   ├── index.ts                 # Entry point (registers Root)
│   ├── Root.tsx                 # Composition: PhimindflowPromo
│   └── PhimindflowVideo.tsx     # Main component (6 scenes)
├── out/
│   └── forex-video.mp4          # Rendered output
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
└── remotion.config.ts           # JPEG format, overwrite output
```

## How to Use

```bash
cd video

# Install dependencies (if fresh clone)
npm install

# Preview in browser
npx remotion preview src/index.ts

# Render to MP4
npx remotion render src/index.ts PhimindflowPromo out/forex-video.mp4
```

## Integration with Main Site

The video is a separate project within the monorepo. It is NOT embedded in the website currently. The rendered MP4 can be:
- Uploaded to social media for promotion
- Embedded in the site via a `<video>` tag or hosted on a CDN
- Used in ad campaigns

## What's Missing

- No automatic integration with the website
- No CI/CD pipeline for video rendering
- Video content may need updating if website copy changes significantly
