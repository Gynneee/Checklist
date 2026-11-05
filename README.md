# Not Just Story — Cinema Production Suite & Shooting Checklist

A web application designed for film production sets, featuring real-time multi-device cloud synchronization, take logging, director notes, department filtering, camera preset references, and GSAP animations.

---

## Features

- **Multi-Device Real-Time Sync**: Synchronize checklist ticks, logged takes, and notes across laptops, tablets, and smartphones on set.
- **Vercel Serverless Backend**: Powered by `/api/sync` and `/api/health` with automatic support for Vercel KV / Upstash Redis key-value cloud database.
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
- `app.js`: Application logic, GSAP animations, sync engine, take logger, and Web Audio effects.
- `api/sync.js`: Vercel serverless function handling room state persistence and activity logs.
- `api/health.js`: Serverless health check endpoint.
- `vercel.json`: Vercel deployment and CORS configuration.
- `package.json`: Project metadata and npm scripts.

---

## Deploying to Vercel

### Step 1: Push to Git
Initialize git and push the repository to GitHub:

```bash
git init
git add .
git commit -m "Initial commit of Not Just Story cinema checklist"
git branch -M main
git remote add origin https://github.com/Gynneee/Checklist.git
git push -u origin main --force
```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Select your GitHub repository and click **Deploy**.
4. Vercel will automatically detect the static frontend and `/api` serverless backend.

### Step 3: Enable Cloud Persistence (Optional, Recommended)
To persist data permanently across cloud cold starts:
1. In your Vercel project dashboard, navigate to the **Storage** tab.
2. Click **Create Database** and choose **KV (Redis)**.
3. Connect the KV database to your project. Vercel will automatically populate `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
4. Redeploy or trigger a new deployment. All devices connected to the same room will sync to this database.

---

## Syncing Across Devices on Set

1. Open your deployed URL on any device (e.g. `https://your-project.vercel.app`).
2. Click the **Sync & Share** icon in the header (top right).
3. Have your crew point their smartphone camera at the QR code, or share the room link.
4. Set each crew member's name and role (e.g. Director, Camera DOP, Sound).
5. All ticks, takes, and notes will sync in real time across all devices.
