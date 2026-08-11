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

In a **second** terminal:

```bash
npx --yes localtunnel --port 8000
# → https://something.loca.lt
```

Create `parrotyc/.env` (no trailing slash):

```
EXPO_PUBLIC_API_URL=https://something.loca.lt
```

Restart Expo with `--clear` whenever you change this value.

## 4. Start Expo and get a QR code (iPhone)

```bash
cd parrotyc
npm start
# same as: npx expo start --tunnel --port 8081
```

### QR / URL — scan in Expo Go on iPhone only

1. Wait until the terminal says **Tunnel ready**.
2. Read the public host from ngrok:

```bash
curl http://127.0.0.1:4040/api/tunnels
# look for https://….exp.direct
```

3. On your **iPhone**, open Expo Go and enter / scan:

```text
exp://YOUR-SUBDOMAIN.exp.direct:80
```

Use **port 80** in the `exp://` URL (not 8081).

Optional: write a PNG QR:

```bash
npx --yes qrcode "exp://YOUR-SUBDOMAIN.exp.direct:80" -o expo-qr.png
```

Scan that image with Expo Go on iPhone. **Do not** use the laptop browser, web preview, or Cloudflare `trycloudflare.com` URLs as the Expo entry point.

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
| Expo “check your internet” / won’t load | Use `--tunnel`, not LAN; scan `exp://…exp.direct:80` on iPhone |
| Verification “No connection” / **503** | API tunnel died — restart localtunnel and update `EXPO_PUBLIC_API_URL`, then `expo start --clear` |
| “Couldn’t deliver code over iMessage” | Text Linq number first (sandbox); confirm `can_send: true` |
| OTP works, no Polly reply | Missing webhook and/or `GEMINI_API_KEY`; confirm webhook tunnel is up |
| Ngrok `Cannot read properties of undefined (reading 'body')` | Ensure `@expo/ngrok` is installed locally; retry `expo start --tunnel` |

## Repo notes

- Secrets live only in **parrot-backend** `.env` and local `parrotyc/.env` (`EXPO_PUBLIC_API_URL`).  
- Do not commit API keys or tunnel URLs.  
- More Expo-network notes: see `AGENTS.md` in this repo.
