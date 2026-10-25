# OmLauncher

A fast, feature-rich Minecraft client manager built with **Tauri v2 + React**, styled with Mojang's "Ore UI" aesthetic.

## 🎯 Primary delivery: GitHub Actions

Instead of building locally, OmLauncher is designed to be built via **GitHub Actions**. Push to `main` and the CI pipeline will compile the Rust backend and bundle the React frontend into distributable installers for Windows and Linux.

### Repository schema

```
OmLauncher/
├── .github/
│   └── workflows/
│       └── build.yml          # GitHub Actions: builds Tauri app on Windows + Linux
├── src-tauri/                 # Rust backend (Tauri v2)
│   ├── Cargo.toml
│   ├── tauri.conf.json        # App config + FS/HTTP/shell permissions
│   └── src/
│       ├── lib.rs             # App entry + state + command registration
│       ├── state.rs           # AppState, Instance, InstanceConfig, LauncherConfig
│       └── commands/
│           ├── mod.rs
│           ├── auth.rs        # login_elyby, get_elyby_token, logout_elyby
│           ├── instance.rs    # list/create/rename/delete/launch/open_folder
│           └── modrinth.rs    # fetch_modrinth_packs, download_modpack
├── src/                       # React frontend (Vite)
│   ├── main.tsx
│   ├── App.tsx                # Login gate → Dashboard routing
│   ├── styles.css             # Ore UI design tokens + Minecraft font imports
│   ├── lib/tauri.ts           # Typed invoke wrappers for every command
│   ├── fonts/                 # Official Mojang fonts (downloaded from minecraft.net)
│   │   ├── MinecraftTen-Regular.ttf / .woff2
│   │   └── MinecraftFive-Regular.ttf / .woff2
│   └── components/
│       ├── LoginView.tsx
│       ├── Dashboard.tsx
│       ├── InstanceCard.tsx
│       ├── InstanceSettings.tsx
│       ├── ModpackBrowser.tsx
│       ├── ModsManager.tsx
│       ├── ResourcePackManager.tsx
│       └── LogsViewer.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── setup.ps1                  # Optional: local dev helper (installs Rust/Node)
├── run.ps1                    # Optional: local dev runner
└── README.md
```

## Fonts (included ✅)

Official Mojang fonts fetched from `minecraft.net` into `src/fonts/`:

| File | Source |
|------|--------|
| `MinecraftTen-Regular.ttf` / `.woff2` | minecraft.net clientlib fonts |
| `MinecraftFive-Regular.ttf` / `.woff2` | minecraft.net clientlib fonts |

Wired in `src/styles.css` via `@font-face` — headings use `MinecraftTen`, UI labels use `MinecraftFive`, with system sans-serif fallbacks.

## Local development (optional)

If you want to run locally instead of via GitHub Actions:

1. **Install Rust** (MSVC toolchain on Windows) + **Node.js** (already present).
2. Install MinGW/VC build tools so `link.exe` is available for Rust.
3. Run:
   ```powershell
   .\setup.ps1   # Installs Rust via winget, npm install, launches app
   .\run.ps1     # Just launches (after setup)
   ```

> ⚠️ Local Rust/Tauri builds require the MSVC linker (`link.exe` from Visual Studio Build Tools). If you don't want to install that, use the GitHub Actions workflow instead — it handles the full toolchain automatically.

## Data directory

All instance data lives under `OmLauncher/` (NOT `.minecraft`):

```
OmLauncher/
├── instances/<name>/
│   ├── .omconfig.json
│   ├── mods/
│   ├── resourcepacks/
│   ├── logs/
│   └── versions/
├── assets/
└── config.json
```

## Features

- **Login screen** — Ely.by authentication (token in memory, never the password)
- **Dashboard** — sidebar instance list, add/rename/delete/launch, open folder
- **Settings** — Java path, max RAM, custom JVM args
- **Mods / Resource Packs** — enable/disable/delete managers
- **Modpack Browser** — search Modrinth API and install modpacks
- **Logs Viewer** — real-time log display
- **Ore UI** — dark/light theme, blocky buttons, Minecraft fonts, animations

## Requirements

- Node.js (for frontend)
- Rust toolchain + MSVC linker (only for local builds — GitHub Actions handles this)
- Java (on your system, for launching Minecraft instances)
