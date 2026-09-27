# HDFC Life Advisor (Expo React Native)

A small advisor-facing app: policy list/detail, a claim form with a hospital
bill photo, a branch map, local storage, a local notification, and a deep
link into a policy.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) or press `a` / `i` for an
emulator/simulator.

## Tab map

| Tab | Screens (stack) | What it does |
|---|---|---|
| **Policies** | `PoliciesList` → `PolicyDetail` | Lists the six seed policies; tap a row to see full detail. |
| **Claim** | `ClaimForm` → `HospitalBill` | File a claim (policy no, amount, urgency, hospital) and optionally attach a hospital bill photo. |
| **Map** | `BranchMap` | Shows the Mumbai branch on a map and, on request, your device location. |
| **Settings** | `Settings` | Advisor name (AsyncStorage), secure token (SecureStore), network loading/error demo, deep link reference. |

## Deep link

- **Scheme:** `hdfclife`
- **Example URL:** `hdfclife://policy/HDFC-LIFE-1004`

Opening that URL takes you straight to the Policy Detail screen for
`HDFC-LIFE-1004`, the same screen and text you'd see by tapping that row in
the Policies list. To test it with the app running in Expo Go / a simulator:

```bash
npx uri-scheme open hdfclife://policy/HDFC-LIFE-1004 --ios
# or --android
```

## AsyncStorage vs SecureStore — what belongs in each

For an advisor app, **AsyncStorage** is the right place for data that's
useful to persist but not sensitive if it leaked from the device's
sandboxed storage — things like the advisor's display name, draft claims,
or UI preferences. It's plain, unencrypted key-value storage, fast, and
fine for anything a screenshot or a support ticket could safely reveal.
**SecureStore**, backed by the OS keychain/keystore, is for anything that
would be a real problem if exposed: auth tokens, session credentials, or
API keys the app uses to authenticate the advisor to backend systems. In
this app that split is deliberate — the advisor token lives only in
SecureStore and is never written into the `hdfc.claims` or advisor-name
AsyncStorage entries.

## Local vs push notifications

Local notifications (used here after a claim submits) are scheduled
entirely on-device by the app itself — no server, no network call, and no
notification arrives if the app was never opened on that device. Push
notifications are sent from a backend server through Apple's (APNs) or
Google's (FCM) push services to a device token the app registered in
advance, so they can reach a user even if the app hasn't been opened
recently or is fully closed. Push requires a server-side integration,
device token management, and platform credentials that local notifications
don't need at all.

## When would you reach for a native module?

You'd write (or install) a native module when a feature isn't exposed by
Expo's managed SDK at all — for example, deep OS-level integrations like
custom Bluetooth/BLE device pairing, background audio processing with
custom DSP, biometric-backed hardware security modules beyond what
`expo-local-authentication` covers, or wrapping a proprietary native SDK
(e.g. a bank's own fraud-detection or card-reader SDK) that only ships iOS
`.framework` / Android `.aar` binaries. If the requirement can be met with
an Expo config plugin or an existing Expo package, that's almost always
simpler than hand-rolling native code.

## Notes

- Seed data lives in `data/policies.json` and is the source of truth for
  policy info — no live HDFC API is called.
- The only live network call is the `jsonplaceholder.typicode.com` demo
  in Settings, used purely to demonstrate loading/error states.
- `react-native-maps` requires a native build (dev client or EAS build) on
  some setups; it also works directly in Expo Go for basic map + marker
  usage as used here.
