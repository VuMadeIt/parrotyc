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

Note: `EXPO_PUBLIC_API_URL` in `.env` still points at the LAN IP, so `parrot-backend`
calls need the phone on the same network even when the bundle loads over the tunnel.
