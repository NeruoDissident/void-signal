<p align="center"><img src="icons/logo.png" width="180" alt="Void Signal alien signal logo"></p>

# VOID SIGNAL

A retro sci-fi first-person dungeon RPG built for mobile browsers and desktop. Lead four specialists through three procedurally generated alien facilities, recover their security keys, defeat the guardians, and silence the Choir Engine.

**No build step. No runtime dependencies. No accounts or server required.**

## Play

Choose **Quick start** for a balanced Vanguard, Medic, Engineer, and Scout, or **Build your crew** to choose all four names and classes.

- Explore three connected, randomly generated dungeons with distinct palettes and bosses.
- Fight six enemy archetypes in turn-based party combat.
- Equip eight weapons, including ion weapons that deal bonus damage to machines.
- Manage medkits, energy cells, credits, and equipment.
- Gain experience, level up, and spend talent points on damage, health, energy, or armor.
- Use the minimap, full automap, research terminals, and mission journal.
- Return to the shuttle for free recovery and supplies.
- Progress saves automatically in the current browser when local storage is available.

### Controls

| Action | Touch | Keyboard |
| --- | --- | --- |
| Move forward / back | Move / Back | W / S or Up / Down |
| Strafe left / right | Step arrows | A / D |
| Turn left / right | Turn arrows | Q / E or Left / Right |
| Interact / fire | Interact / Fire laser | Space |
| Select crew | Crew card | 1–4 |
| Select enemy | Enemy card | Tap or click |
| Open automap | Map | M |

Each living crew member gets one action per round. Skills cost 3 energy. Guard reduces incoming damage and restores 2 energy. Medkits can revive fallen crew. Rest uses one energy cell to recharge everyone and heal living members.

## Run locally

From this folder:

```sh
python3 -m http.server 8000
```

Open **http://localhost:8000**. A local HTTP server is required to test the service worker; opening `index.html` as a file is not a PWA installation test.

For a phone on the same Wi-Fi, open `http://YOUR-COMPUTER-LAN-IP:8000` to test normal gameplay. PWA installation and service workers require HTTPS, except for localhost on the device running the browser. Use a deployed HTTPS URL for the full phone test.

## Deploy to Vercel

1. Import `NeruoDissident/void-signal` into Vercel.
2. Choose **Other** as the framework preset.
3. Use the repository root as the root directory.
4. Leave the build command empty. If Vercel requests an output directory, use `.`.
5. Deploy and open the resulting HTTPS URL.

`vercel.json` supplies the manifest content type and prevents stale service-worker scripts. The application also works on other static HTTPS hosts; relative URLs support hosting under a subdirectory.

## Add to your home screen

### iPhone / iPad

Open the deployed URL in Safari. Tap **Share → Add to Home Screen → Add**. Keep **Open as Web App** enabled if that option appears. The supplied Apple touch icon becomes the home-screen logo.

### Android / desktop

Tap **Install** in the game when the browser supports installation, or choose **Install app / Add to Home screen** from the browser menu. The in-game button provides instructions when an automatic install prompt is unavailable.

The manifest supplies regular 192px and 512px icons plus a separate maskable icon with extra space for Android icon masks. The installed app opens in standalone mode, without normal browser navigation chrome.

### Offline play and saves

Open the game online and wait for **Offline ready**. The service worker caches the entire playable app, its artwork, and its sounds (which are synthesized locally). It can then launch and play offline.

Saves use the `void-signal-v1` local-storage key. They are local to the browser, device, and site address; they do not sync across devices or automatically transfer from the original chat preview. Clearing site data can erase saves. Private browsing or storage restrictions may prevent persistence. No player data is sent to a server.

After deploying changes, close all open game tabs and the installed app, then reopen it to let a waiting update activate. Updates do not intentionally interrupt an active expedition.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Application shell, install metadata, accessible installation dialog |
| `game.js` | Dungeon generation, rendering, combat, progression, inventory, save system |
| `styles.css` | Responsive layout, touch controls, safe areas, landscape support |
| `pwa.js` | Installation UI, offline readiness, service-worker registration |
| `sw.js` | Versioned offline app cache |
| `manifest.webmanifest` | Install name, launch path, display mode, icons |
| `icons/` | Full logo, standard icons, maskable icon, Apple icon, favicon |
| `vercel.json` | Static hosting response headers |

## Development notes

- Change `CACHE_NAME` in `sw.js` for every release that changes cached files. The cache installs as one complete release; existing sessions keep their current release until closed.
- Preserve or migrate the local-storage key if changing the save schema.
- Dungeon rendering uses Canvas 2D raycasting. Game artwork is drawn in code, and optional audio uses Web Audio.
- Rendering pauses while the page is hidden to reduce background battery use.
- The logo was created with OpenAI's built-in image-generation tool, then resized and padded for home-screen icons. Art direction: an angular mint alien skull with an orbital signal ring and amber beacon on midnight navy, with a bold retro-arcade silhouette and no text.

## Validation

The original campaign was completed through its ending by an automated game-logic test, and all objectives were reachable across 300 generated dungeons. The packaged PWA is checked separately for mobile layout, save reload, manifest/icon loading, and offline launch. Real-device iOS installation should also be checked after HTTPS deployment.

PWA implementation references: [Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest) and [Using service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).
