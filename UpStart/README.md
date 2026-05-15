# PocketPotter — with Back4App Auth

## Setup & Run

```bash
cd MyExpoApp
npm install
npx expo start
```

Then scan the QR code with the **Expo Go** app on your phone, or press `i` for iOS simulator / `a` for Android emulator.

## What's new

- **Sign In** — logs in via Back4App using email + password
- **Sign Up** — creates a new account (username, email, 6+ char password)
- **Forgot Password** — sends a password reset email via Back4App
- **Session** — uses Back4App session tokens

## Back4App Config

App ID and JS Key are in `src/services/back4app.ts`.  
To enable password reset emails, configure your email adapter in:  
Back4App Dashboard → App Settings → Email
