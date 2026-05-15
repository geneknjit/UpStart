# UpStart

A React Native (Expo) social-media-meets-investing app for backing the next wave of startups. Built on the PocketPotter Expo + Back4App auth template, but every other feature is reimagined.

## Setup & Run

```bash
cd UpStartApp
npm install
npx expo start
```

Then scan the QR code with the **Expo Go** app on your phone, or press `i` for iOS simulator / `a` for Android emulator.

## What's wired up vs. UI-only

This build prioritizes a complete, navigable UI for every feature in the product doc. Per the build brief, anything that would require external integration is rendered as UI only.

| Wired up (functional) | UI only (mock) |
|---|---|
| Email sign-up / sign-in via **Back4App** | Google / Facebook / GitHub OAuth buttons |
| Forgot-password flow via Back4App | Phone OTP login (any 6-digit code accepted) |
| Session persistence with AsyncStorage | Face ID / biometric (success/fail buttons) |
| Sign out | 2FA setup + verification |
| In-memory wallet / coins / spend / tier | ID verification (mocked liveness + result) |
| Filter + search startup discovery | Real-time messaging (local state only) |
| Tab navigation + 30+ screens | Real payments (cards saved locally) |
| Profile customization (color, emoji) | Real video feed (emoji-based mock frames) |
| Toggle-based settings (notifications, privacy, theme) | Push notification delivery |
| Achievement / tier system | Live show audio/video (animated mock view) |

## Project structure

```
UpStartApp/
├─ App.tsx                          # Stack + route table for every screen
├─ src/
│  ├─ theme/colors.ts               # Centralized dark theme
│  ├─ services/back4app.ts          # Parse-style auth API client
│  ├─ context/
│  │  ├─ AuthContext.tsx            # Session + user
│  │  └─ AppContext.tsx             # Wallet, settings, blocks, personalization
│  ├─ data/mockData.ts              # Startups, users, posts, blogs, live shows, chats
│  ├─ components/UI.tsx             # Buttons, cards, chips, avatars, toggles, badges
│  └─ screens/
│     ├─ auth/                      # Login, SignUp, ForgotPw, PhoneLogin, 2FA, Biometric, SecurityQs
│     ├─ onboarding/                # Personal questions, ID verification
│     ├─ main/                      # Bottom tabs: Discover, Live list, Create, Messages, Profile
│     ├─ startup/                   # StartupProfile (tabbed), CommissionRequest
│     ├─ live/                      # LiveShow, CreateLiveShow, Invest
│     ├─ messaging/                 # Chat, NewChat, GroupInfo
│     ├─ create/                    # MiniVideos (TikTok-style), BlogEditor, BlogPost
│     ├─ wallet/                    # Wallet, Achievements
│     └─ settings/                  # 17 settings sub-screens, grouped into 4 files
└─ package.json                     # Expo 51, React Navigation 6 (native-stack + bottom-tabs)
```

## Feature coverage

Maps to sections in the original product doc:

1. **Login / Authentication** — Email (Back4App), Google/Facebook/GitHub stubs, Phone OTP, Face ID, 2FA, Security Questions, Forgot Password
2. **Dashboard / Profile** — Account, Email, Name/handle, Create Password, CAPTCHA, linked accounts
3. **Settings** — Notifications, Blocking, Privacy, Message openness, Post visibility, Theme, Account Recovery, Reset Password/Email, Disable 2FA, History (archive), Activity, Likes, Comments, Shares, Payment Methods, Background customization, Personalizations
4. **Commission System** — Commission request form with type, deadline, budget, references, escrow explainer
5. **Messaging** — Search users + friends, create 1:1 + group chats, long-press edit/delete, group info + admin controls, add participants, message requests
6. **Live Show** — Discovery list (Now Live + Upcoming with reminders), create show form (title/desc/date/visibility/deal structure with cap-table preview), live show room (chat, reactions, invest button)
7. **Onboarding** — Security questions, ID verification with selfie liveness mock
8. **Blogging** — Blog editor with AI summary generator + toggle, blog post viewer with summary block
9. **Startup Profile** — Tabbed sections: Overview, Problem (with stat highlight), Solution (demo + prototype), Team, Milestone timeline. Funding card with cap-table snapshot and Invest button
10. **Startup Discovery** — Search, Industry/Region/Stage filter chips with active-filter row, results grid

## Wallet, coins, and gamification

- Starts with 1,250 coins (mock balance)
- Spending coins via invest / unlock auto-tracks `totalInvested`
- Tier ladder: **Bronze** (500+) → **Silver** (1000+) → **Gold** (2000+) → **Platinum** (5000+)
- Achievement badges unlock on milestones (first invest, live invest, etc.) and surface on the profile

## Back4App credentials

UpStart now points at its own Back4App project (configured in `src/services/back4app.ts`). The App ID, JavaScript Key, and Client Key in that file are the live credentials for the UpStart backend.

To enable password-reset emails: Back4App dashboard → App Settings → Email → configure your sender.

## License

Internal demo. Not for production use without auditing all integration stubs.
