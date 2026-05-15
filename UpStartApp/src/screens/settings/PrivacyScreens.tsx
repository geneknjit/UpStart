// Shared module: privacy, message openness, post visibility, and account screens.
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { useApp, PrivacyLevel, MessageOpenness, PostVisibility, ThemeMode } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Row, PrimaryButton } from '../../components/UI';

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={s.header}>
      <Pressable onPress={onBack}><Text style={{ color: colors.primary }}>← Back</Text></Pressable>
      <Text style={s.headerTitle}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

function OptionRow({ label, sub, selected, onPress }: any) {
  return (
    <Pressable style={s.optRow} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={s.optLabel}>{label}</Text>
        {sub && <Text style={s.optSub}>{sub}</Text>}
      </View>
      <View style={[s.radio, selected && s.radioOn]}>
        {selected && <View style={s.radioDot} />}
      </View>
    </Pressable>
  );
}

// ── Privacy ────────────────────────────────────────────────────────────────
export function PrivacyScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Privacy'>) {
  const { privacy, setPrivacy } = useApp();
  const options: { value: PrivacyLevel; label: string; sub: string }[] = [
    { value: 'public', label: 'Public', sub: 'Anyone on UpStart can find and follow you.' },
    { value: 'followers', label: 'Followers only', sub: 'Only people you allow can see your posts.' },
    { value: 'private', label: 'Private', sub: 'New follows require approval.' },
  ];
  return (
    <View style={s.bg}>
      <ScreenHeader title="Privacy" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Card style={{ paddingVertical: 0 }}>
          {options.map((o) => (
            <OptionRow key={o.value} label={o.label} sub={o.sub} selected={privacy === o.value} onPress={() => setPrivacy(o.value)} />
          ))}
        </Card>
        <Text style={s.sectionLabel}>OTHER</Text>
        <Card style={{ paddingVertical: 0 }}>
          <Row label="Allow follow requests" />
          <Row label="Allow tagging" />
          <Row label="Hide profile from search" />
        </Card>
      </ScrollView>
    </View>
  );
}

// ── Message openness ──────────────────────────────────────────────────────
export function MessageOpennessScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'MessageOpenness'>) {
  const { msgOpenness, setMsgOpenness } = useApp();
  const options: { value: MessageOpenness; label: string; sub: string }[] = [
    { value: 'everyone', label: 'Everyone', sub: 'Anyone can start a chat with you.' },
    { value: 'follows', label: 'People I follow', sub: 'Strangers will see a "can\'t message" notice.' },
    { value: 'nobody', label: 'Nobody', sub: 'Existing chats remain. No new messages allowed.' },
  ];
  return (
    <View style={s.bg}>
      <ScreenHeader title="Who can message you" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Card style={{ paddingVertical: 0 }}>
          {options.map((o) => (
            <OptionRow key={o.value} label={o.label} sub={o.sub} selected={msgOpenness === o.value} onPress={() => setMsgOpenness(o.value)} />
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

// ── Post visibility ───────────────────────────────────────────────────────
export function PostVisibilityScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'PostVisibility'>) {
  const { postVisibility, setPostVisibility } = useApp();
  const options: { value: PostVisibility; label: string; sub: string; icon: string }[] = [
    { value: 'public', label: 'Public', sub: 'Anyone can see', icon: '🌐' },
    { value: 'followers', label: 'Followers only', sub: 'Only your followers', icon: '👥' },
    { value: 'close', label: 'Close Friends', sub: 'A trusted subset', icon: '⭐' },
    { value: 'only-me', label: 'Only me', sub: 'Hidden from all others', icon: '🔒' },
  ];
  return (
    <View style={s.bg}>
      <ScreenHeader title="Default post visibility" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Card style={{ paddingVertical: 0 }}>
          {options.map((o) => (
            <Pressable key={o.value} style={s.optRow} onPress={() => setPostVisibility(o.value)}>
              <Text style={{ fontSize: 22, marginRight: 12 }}>{o.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.optLabel}>{o.label}</Text>
                <Text style={s.optSub}>{o.sub}</Text>
              </View>
              <View style={[s.radio, postVisibility === o.value && s.radioOn]}>
                {postVisibility === o.value && <View style={s.radioDot} />}
              </View>
            </Pressable>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

// ── Theme ─────────────────────────────────────────────────────────────────
export function ThemeSettingsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'ThemeSettings'>) {
  const { themeMode, setThemeMode } = useApp();
  const options: { value: ThemeMode; label: string; sub: string; icon: string }[] = [
    { value: 'dark', label: 'Dark', sub: 'Easier on the eyes', icon: '🌑' },
    { value: 'light', label: 'Light', sub: 'Classic light theme', icon: '☀️' },
    { value: 'auto', label: 'Auto', sub: 'Follows your device setting', icon: '⚙️' },
  ];
  return (
    <View style={s.bg}>
      <ScreenHeader title="Theme" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Card style={{ paddingVertical: 0 }}>
          {options.map((o) => (
            <Pressable key={o.value} style={s.optRow} onPress={() => {
              setThemeMode(o.value);
              if (o.value !== 'dark') Alert.alert('Coming soon', 'Light/auto themes are previewed but not yet fully wired in this UI build.');
            }}>
              <Text style={{ fontSize: 22, marginRight: 12 }}>{o.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.optLabel}>{o.label}</Text>
                <Text style={s.optSub}>{o.sub}</Text>
              </View>
              <View style={[s.radio, themeMode === o.value && s.radioOn]}>
                {themeMode === o.value && <View style={s.radioDot} />}
              </View>
            </Pressable>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

// ── Account ───────────────────────────────────────────────────────────────
export function AccountSettingsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'AccountSettings'>) {
  const { displayName, email, setProfile } = useAuth();
  const [name, setName] = useState(displayName || '');
  const [username, setUsername] = useState((displayName || '').toLowerCase().replace(/\s+/g, ''));
  return (
    <View style={s.bg}>
      <ScreenHeader title="Account" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={s.sectionLabel}>DISPLAY NAME</Text>
        <Card>
          <TextInput value={name} onChangeText={(v) => setName(v.slice(0, 30))} style={s.input} placeholder="Your name" placeholderTextColor={colors.textFaint} />
          <Text style={{ color: colors.textFaint, fontSize: 11, marginTop: 6 }}>{name.length}/30 — changes limited to once every 30 days.</Text>
        </Card>
        <Text style={s.sectionLabel}>USERNAME</Text>
        <Card>
          <TextInput value={username} onChangeText={(v) => setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ''))} style={s.input} placeholder="@username" placeholderTextColor={colors.textFaint} />
          <Text style={{ color: colors.accent, fontSize: 11, marginTop: 6, fontWeight: '700' }}>✓ available</Text>
        </Card>
        <Text style={s.sectionLabel}>EMAIL</Text>
        <Card>
          <Row label={email || 'Not set'} value="Verified" />
          <Row label="Change email" onPress={() => Alert.alert('Verification required', 'Both old and new emails must confirm. (UI only)')} />
        </Card>
        <Text style={s.sectionLabel}>LINKED ACCOUNTS</Text>
        <Card style={{ paddingVertical: 0 }}>
          <Row label="🔵 Google" value="Connected" onPress={() => Alert.alert('Unlink Google?', 'Confirm unlinking.')} />
          <Row label="🐙 GitHub" value="Connected" onPress={() => {}} />
          <Row label="📘 Facebook" value="Not connected" onPress={() => {}} />
        </Card>
        <PrimaryButton title="Save changes" onPress={() => { setProfile(name); Alert.alert('Profile updated'); }} style={{ marginTop: 16 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  sectionLabel: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 14, marginBottom: 8 },
  optRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  optLabel: { color: colors.text, fontSize: 15, fontWeight: '600' },
  optSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  input: { color: colors.text, backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 12, fontSize: 15, borderWidth: 1, borderColor: colors.border },
});
