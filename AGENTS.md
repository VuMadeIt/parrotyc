# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Expo Go won't connect

LAN mode (`--lan`) usually fails on this network — the phone can't reach the PC, and
Expo Go reports a misleading "check your internet connection" error. Use a tunnel:

```sh
npm install --save-dev @expo/ngrok@^4.1.0
npx expo start --tunnel --clear
```

The bundled tunnel fails with `CommandError: Cannot read properties of undefined (reading 'body')`
unless `@expo/ngrok` is installed **locally** in the project.

Read the public URL from the ngrok agent API and build the QR from it:

```sh
curl http://127.0.0.1:4040/api/tunnels    # -> https://<id>-anonymous-8081.exp.direct
```

Scan `exp://<id>-anonymous-8081.exp.direct:80` (port 80, not 8081). Generate the QR image
rather than asking the user to type the URL.

## Phone verification / parrot-backend also needs a tunnel

The Expo tunnel only forwards Metro (JS bundle). API calls go to `EXPO_PUBLIC_API_URL`.
On this network the phone cannot reach the PC's LAN IP, so a LAN URL like
`http://10.x.x.x:8000` produces "No connection" on the verify screen — including when
tapping "Didn't receive a code?".

1. Start the backend (from `parrot-backend`):

```sh
.\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000
```

2. Tunnel port 8000 (separate from Expo). Prefer localtunnel — Cloudflare quick tunnels
   have been flaky on this machine:

```sh
npx --yes localtunnel --port 8000
# -> https://….loca.lt
```

3. Put that URL into `parrotyc/.env` (no trailing slash):

```
EXPO_PUBLIC_API_URL=https://….loca.lt
```

`utils/api.ts` already sends `Bypass-Tunnel-Reminder: true` so loca.lt's interstitial
does not block the phone.

4. Restart Expo with `--clear` so the new env is baked into the bundle, then reload Expo Go.

Confirm the backend is healthy before blaming the app:

```sh
curl http://127.0.0.1:8000/verification/status
# -> {"can_send":true,...}
```

Linq delivery is already wired in `parrot-backend` (`/verification/send|resend|verify`).
If status returns `can_send: true` and a local POST delivers, the backend does not need
code changes — only reachability from the phone.
