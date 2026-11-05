# Not Just Story — Cinema Production Suite & Shooting Checklist

A web application designed for film production sets, featuring 100% free real-time multi-device cloud synchronization, take logging, director notes, department filtering, camera preset references, and GSAP animations.

---

## 100% Free Sync — Zero Paid Database Required

- **Free Real-Time WebSocket Pub/Sub**: Works out of the box with zero database subscriptions, zero API keys, and zero credit cards.
- **Instant On-Set Collaboration**: When two or more devices (e.g. director's iPad, DOP's phone, runner's laptop) open the site with the same room code (e.g. `natal-2027`), changes broadcast in under 100ms via public secure WebSockets.
- **Offline First**: All ticks, takes, and notes persist locally in `localStorage` on each device, so nothing is lost even when disconnected.
- **Free Vercel Hosting**: Deploys on Vercel's free hobby tier.
- **Optional Upstash Redis Free Tier**: If you want permanent serverless cloud caching across cold starts, Upstash Redis offers 10,000 commands/day completely free without requiring a credit card.

---

## Features

- **Multi-Device Real-Time Sync**: Synchronize checklist ticks, logged takes, and notes across laptops, tablets, and smartphones on set for free.
- **On-Set QR Code Sharing**: Generate an instant QR code for camera operators, sound recordists, and runners to scan and join the session.
- **Shot & Take Logger**: Track multiple takes (Take 1, Take 2, Hero Take ⭐) and director notes directly attached to individual shots.
- **Department Filters**: Switch views instantly between Camera/DOP, Lighting, Sound, Direction, Art & Props, Cast, Safety, and Production.
- **Spotlight Search (Ctrl+K / Cmd+K)**: Fuzzy search across all 200+ checklist items, scene numbers, props, and gear.
- **GSAP & Confetti Animations**: Staggered card transitions, spring micro-interactions, liquid progress bar, and completion celebrations.
- **Web Audio Slate Sound FX**: Low-latency synthesized cinema clapper click on tick (toggleable with mute).
- **Print Mode**: Clean high-contrast printable shot list for clipboards on set.

---

## Project Structure

- `index.html`: Main HTML entry point.
- `style.css`: Separated CSS styles, light/dark themes, responsive layouts, and print styles.
- `data.js`: Structured film checklist dataset with 200+ items and department tags.
- `app.js`: Application logic, GSAP animations, free WebSocket sync engine, take logger, and Web Audio effects.
- `api/sync.js`: Vercel serverless function handling room state persistence and activity logs.
- `api/health.js`: Serverless health check endpoint.
- `vercel.json`: Vercel deployment and CORS configuration.
- `package.json`: Project metadata and npm scripts.

---

## Deploying to Vercel (100% Free)

### Step 1: Push to Git
Run this in PowerShell:

```bash
git add .
git commit -m "Add free realtime cross-device sync"
git push -u origin main --force
```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com) (free account).
2. Click **Add New...** > **Project**.
3. Select `Gynneee/Checklist` and click **Deploy**.
4. That's it! Your site is live with full free cross-device sync.

---

## Syncing Across Devices on Set

1. Open your deployed URL on your phone or laptop (e.g. `https://your-project.vercel.app`).
2. Click the **Sync & Share** icon in the header (top right).
3. Have your crew point their smartphone camera at the QR code, or share the room link.
4. Set each crew member's name and role (e.g. Director, Camera DOP, Sound).
5. All ticks, takes, and notes will sync in real time across all devices for free.
