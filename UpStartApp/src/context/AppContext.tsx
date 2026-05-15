import React, { createContext, useContext, useState, ReactNode } from 'react';

// Settings and in-memory state for UI-only features (wallet, notifications, privacy, etc.)
export type PrivacyLevel = 'public' | 'followers' | 'private';
export type MessageOpenness = 'everyone' | 'follows' | 'nobody';
export type PostVisibility = 'public' | 'followers' | 'close' | 'only-me';
export type ThemeMode = 'dark' | 'light' | 'auto';
export type Tier = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

interface NotifPrefs {
  followers: boolean;
  likes: boolean;
  comments: boolean;
  messages: boolean;
  mentions: boolean;
  liveShows: boolean;
  investments: boolean;
  systemAlerts: boolean;
}

interface AppContextType {
  // Wallet
  coins: number;
  addCoins: (n: number) => void;
  spendCoins: (n: number) => boolean;
  conversionRate: number; // coins per USD

  // Achievements / tier
  totalInvested: number; // in coins
  badges: string[];
  unlockBadge: (id: string) => void;
  tier: Tier;

  // Settings
  notifPrefs: NotifPrefs;
  setNotif: (key: keyof NotifPrefs, val: boolean) => void;
  privacy: PrivacyLevel;
  setPrivacy: (p: PrivacyLevel) => void;
  msgOpenness: MessageOpenness;
  setMsgOpenness: (m: MessageOpenness) => void;
  postVisibility: PostVisibility;
  setPostVisibility: (v: PostVisibility) => void;
  themeMode: ThemeMode;
  setThemeMode: (t: ThemeMode) => void;
  twoFactorEnabled: boolean;
  setTwoFactor: (v: boolean) => void;
  biometricEnabled: boolean;
  setBiometric: (v: boolean) => void;

  // Block list
  blocked: { id: string; name: string; handle: string }[];
  block: (u: { id: string; name: string; handle: string }) => void;
  unblock: (id: string) => void;

  // Profile customization
  profileBg: string;
  setProfileBg: (c: string) => void;
  pinnedEmoji: string;
  setPinnedEmoji: (e: string) => void;
}

const defaultNotifs: NotifPrefs = {
  followers: true, likes: true, comments: true, messages: true,
  mentions: true, liveShows: true, investments: true, systemAlerts: true,
};

function computeTier(invested: number): Tier {
  if (invested >= 5000) return 'platinum';
  if (invested >= 2000) return 'gold';
  if (invested >= 1000) return 'silver';
  if (invested >= 500) return 'bronze';
  return 'none';
}

const AppContext = createContext<AppContextType>(null as any);

export function AppProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState(1250);
  const [totalInvested, setTotalInvested] = useState(750);
  const [badges, setBadges] = useState<string[]>(['first-invest']);
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(defaultNotifs);
  const [privacy, setPrivacy] = useState<PrivacyLevel>('public');
  const [msgOpenness, setMsgOpenness] = useState<MessageOpenness>('everyone');
  const [postVisibility, setPostVisibility] = useState<PostVisibility>('public');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [twoFactorEnabled, setTwoFactor] = useState(false);
  const [biometricEnabled, setBiometric] = useState(false);
  const [blocked, setBlocked] = useState<{ id: string; name: string; handle: string }[]>([]);
  const [profileBg, setProfileBg] = useState('#0A4A3D');
  const [pinnedEmoji, setPinnedEmoji] = useState('🚀');

  const addCoins = (n: number) => setCoins((c) => c + n);
  const spendCoins = (n: number): boolean => {
    if (coins < n) return false;
    setCoins((c) => c - n);
    setTotalInvested((t) => t + n);
    return true;
  };

  const unlockBadge = (id: string) =>
    setBadges((b) => (b.includes(id) ? b : [...b, id]));

  const setNotif = (key: keyof NotifPrefs, val: boolean) =>
    setNotifPrefs((p) => ({ ...p, [key]: val }));

  const block = (u: { id: string; name: string; handle: string }) =>
    setBlocked((b) => (b.find((x) => x.id === u.id) ? b : [...b, u]));
  const unblock = (id: string) => setBlocked((b) => b.filter((x) => x.id !== id));

  return (
    <AppContext.Provider
      value={{
        coins, addCoins, spendCoins, conversionRate: 100,
        totalInvested, badges, unlockBadge, tier: computeTier(totalInvested),
        notifPrefs, setNotif, privacy, setPrivacy, msgOpenness, setMsgOpenness,
        postVisibility, setPostVisibility, themeMode, setThemeMode,
        twoFactorEnabled, setTwoFactor, biometricEnabled, setBiometric,
        blocked, block, unblock, profileBg, setProfileBg, pinnedEmoji, setPinnedEmoji,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
