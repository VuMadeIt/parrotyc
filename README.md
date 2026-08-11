# Parrot (parrotyc)

Expo (SDK 54) onboarding app for **Parrot** — phone number entry + OTP verification against **parrot-backend** (Linq iMessage delivery). After verify, users chat with **Polly** by texting the Linq number in Messages.

- App repo: https://github.com/VuMadeIt/parrotyc  
- Backend repo: https://github.com/samzeh/parrot-backend  

## iPhone only

This UI is **not** optimized for laptop, browser, Android, or tablet.

- Test only on an **iPhone** with **[Expo Go](https://apps.apple.com/app/expo-go/id982107779)**
- Do **not** open the web preview / `npm run web` / browser tab — the app shows an “iPhone only” screen there on purpose
- `npm start` launches the Expo tunnel for scanning from iPhone

## What you need

| Tool | Why |
|------|-----|
| Node.js 20+ | Install / run Expo |
| **iPhone** with **Expo Go** | Only supported client ([App Store](https://apps.apple.com/app/expo-go/id982107779)) |
| Cloned **parrot-backend** | Verification + Polly APIs |
| Linq + Gemini keys | In **backend** `.env` only (never commit) |
| Two tunnels on flaky Wi‑Fi | Expo tunnel (Metro) + API tunnel (port 8000) |

## 1. Clone and install the app

```bash
git clone https://github.com/VuMadeIt/parrotyc.git
cd parrotyc
npm install
```

`@expo/ngrok` is already a devDependency (needed for `expo start --tunnel`).

## 2. Start the backend

Follow [parrot-backend README](https://github.com/samzeh/parrot-backend#readme):

```bash
cd ../parrot-backend
python -m venv venv
.\venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env           # fill LINQ_* and GEMINI_API_KEY
.\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Confirm:

```bash
curl http://127.0.0.1:8000/verification/status
# → "can_send": true
```

## 3. Tunnel the API (phone cannot use localhost)

**Required.** Without this, the app shows:
“No connection to the verification server. Check that parrot-backend is running and tunneled…”

In a **second** terminal (keep it open — if this process dies, verification breaks):

```bash
npx --yes localtunnel --port 8000
# → https://something.loca.lt
```

Create `parrotyc/.env` (no trailing slash):

```
EXPO_PUBLIC_API_URL=https://something.loca.lt
```

**Verify the phone can reach the API through the tunnel** (do this every time before Expo):

```bash
# Windows
curl -H "Bypass-Tunnel-Reminder: true" https://something.loca.lt/verification/status

# macOS/Linux
curl -H "Bypass-Tunnel-Reminder: true" https://something.loca.lt/verification/status
```

You must see JSON with `"can_send": true`. If the curl fails or returns 503, restart localtunnel, update `.env`, and curl again.

Restart Expo with `--clear` whenever you change `EXPO_PUBLIC_API_URL`:

```bash
npx expo start --tunnel --clear --port 8081
```

## 4. Start Expo and get a QR code (iPhone)

```bash
cd parrotyc
npm start
# same as: npx expo start --tunnel --port 8081
# If you just changed EXPO_PUBLIC_API_URL, use --clear (command above) instead of npm start
```

### Warm the iOS bundle **before** scanning (required for first try)

The first iOS bundle can take 1–2 minutes. If you scan Expo Go too early, you’ll get
**“Could not connect to development server”** even though the tunnel is fine.

After the terminal says **Tunnel ready**, run this and wait until it finishes (HTTP 200):

```bash
# Windows
curl "http://127.0.0.1:8081/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app&transform.reactCompiler=true&unstable_transformProfile=hermes-stable" -o NUL

# macOS/Linux
curl -o /dev/null "http://127.0.0.1:8081/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app&transform.reactCompiler=true&unstable_transformProfile=hermes-stable"
```

Only after that curl completes, get the Expo URL / QR.

### QR / URL — scan in Expo Go on iPhone only

1. Read the public host from ngrok:

```bash
curl http://127.0.0.1:4040/api/tunnels
# look for https://….exp.direct
```

2. On your **iPhone**, open Expo Go and enter / scan:

```text
exp://YOUR-SUBDOMAIN.exp.direct:80
```

Use **port 80** in the `exp://` URL (not 8081). Use **tunnel mode only** — don’t rely on same Wi‑Fi / LAN.

Optional: write a PNG QR:

```bash
npx --yes qrcode "exp://YOUR-SUBDOMAIN.exp.direct:80" -o expo-qr.png
```

Scan that image with Expo Go on iPhone. **Do not** use the laptop browser, web preview, or Cloudflare `trycloudflare.com` URLs as the Expo entry point.

If Expo Go still can’t connect: force-quit Expo Go, re-run the warm-up curl, then scan again.

## 5. Test phone verification

1. On the phone, **iMessage `+` your Linq from-number first** (Linq sandbox requires inbound before outbound OTP).
2. In the app: enter your number → wait for the 6-digit code over iMessage → verify.

If you see “Sandbox requires you to iMessage … first”, send that first text and retry.

## 6. Test Polly chatbot

Chat is **not** an in-app thread. After verify (or anytime):

1. Text the same Linq number in **Messages**.
2. Backend must have a Linq webhook for `message.received` pointing at a **public** backend URL (see backend README). Cloudflare quick tunnel is recommended for webhooks.
3. `GEMINI_API_KEY` must be set or replies will say the key is missing.

## Useful scripts / checks

```bash
# Backend Linq token + lines
cd parrot-backend
.\venv\Scripts\python.exe scripts\check_linq.py

# Local Polly without iMessage
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"test\",\"message\":\"hola\"}"

# Swagger
open http://127.0.0.1:8000/docs
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Opens on laptop / browser | Expected — iPhone-only gate. Use Expo Go on iPhone |
| “No connection to the verification server” | API tunnel dead or wrong `EXPO_PUBLIC_API_URL`. Restart localtunnel, curl `/verification/status` with `Bypass-Tunnel-Reminder: true`, update `.env`, restart Expo with `--clear` |
| “Could not connect to development server” on first scan | Warm the iOS bundle with the curl in §4 before scanning; force-quit Expo Go and retry |
| Verification “No connection” / **503** | Same as above — localtunnel expired; get a new URL and `--clear` Expo |
| “Couldn’t deliver code over iMessage” | Text Linq number first (sandbox); confirm `can_send: true` |
| OTP works, no Polly reply | Missing webhook and/or `GEMINI_API_KEY`; confirm webhook tunnel is up |
| Ngrok `Cannot read properties of undefined (reading 'body')` | Ensure `@expo/ngrok` is installed locally; retry `expo start --tunnel` |

## Repo notes

- Secrets live only in **parrot-backend** `.env` and local `parrotyc/.env` (`EXPO_PUBLIC_API_URL`).  
- Do not commit API keys or tunnel URLs.  
- More Expo-network notes: see `AGENTS.md` in this repo.
