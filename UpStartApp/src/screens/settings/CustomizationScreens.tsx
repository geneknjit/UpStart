// Profile background + Personalizations (emojis, fonts, patterns).
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Card, PrimaryButton, Avatar } from '../../components/UI';
import { useApp } from '../../context/AppContext';

function Header({ title, onBack }: any) {
  return (
    <View style={s.header}>
      <Pressable onPress={onBack}><Text style={{ color: colors.primary }}>← Back</Text></Pressable>
      <Text style={s.title}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const SWATCHES = ['#0A4A3D', '#7FD1AE', '#D4A55B', '#5FC59A', '#04342C', '#1A6E5B', '#A8E6D4', '#0E5E4D', '#9CC8B8', '#3FAA7C'];

// ── Background Customization ──────────────────────────────────────────────
export function BackgroundCustomizationScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'BackgroundCustomization'>) {
  const { profileBg, setProfileBg, coins, pinnedEmoji } = useApp();
  const [hex, setHex] = useState(profileBg);
  const [showCustom, setShowCustom] = useState(false);

  const apply = () => {
    if (showCustom) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return Alert.alert('Invalid hex', 'Use format like #FF5733.');
      setProfileBg(hex);
    }
    Alert.alert('Saved', 'Background applied to your profile.');
  };

  return (
    <View style={s.bg}>
      <Header title="Profile background" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
        {/* Preview */}
        <View style={[s.preview, { backgroundColor: showCustom ? hex : profileBg }]}>
          <Avatar emoji="🚀" size={70} />
          <Text style={{ color: colors.white, fontSize: 28, marginTop: 4 }}>{pinnedEmoji}</Text>
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: 18, marginTop: 10 }}>You</Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>@you</Text>
        </View>

        <Text style={s.sectionLabel}>SOLID COLORS</Text>
        <View style={s.swatches}>
          {SWATCHES.map((c) => (
            <Pressable
              key={c}
              style={[s.swatch, { backgroundColor: c }, profileBg === c && !showCustom && { borderColor: colors.text, borderWidth: 3 }]}
              onPress={() => { setProfileBg(c); setShowCustom(false); }}
            />
          ))}
        </View>

        <Text style={s.sectionLabel}>CUSTOM</Text>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={() => setShowCustom((v) => !v)} style={[s.checkbox, showCustom && s.checkboxOn]}>
              {showCustom && <Text style={{ color: colors.white, fontWeight: '800' }}>✓</Text>}
            </Pressable>
            <Text style={{ color: colors.text, marginLeft: 10 }}>Use custom hex color</Text>
          </View>
          {showCustom && (
            <TextInput
              value={hex}
              onChangeText={setHex}
              style={[s.input, { marginTop: 12 }]}
              placeholder="#FF5733"
              placeholderTextColor={colors.textFaint}
              autoCapitalize="characters"
            />
          )}
        </Card>

        <Text style={s.sectionLabel}>SEASONAL THEMES</Text>
        <Card style={{ paddingVertical: 0 }}>
          {[
            { name: 'Forest Founder', new: true, gradient: '#04342C → #7FD1AE' },
            { name: 'Mint Mover', new: false, gradient: '#A8E6D4 → #3FAA7C' },
            { name: 'Gold Patron', new: true, gradient: '#D4A55B → #04342C' },
          ].map((t) => (
            <View key={t.name} style={s.themeRow}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: colors.text, fontWeight: '600' }}>{t.name}</Text>
                  {t.new && <View style={s.newBadge}><Text style={s.newBadgeText}>NEW</Text></View>}
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{t.gradient}</Text>
              </View>
              <Pressable onPress={() => Alert.alert('Seasonal themes are premium. Unlock for 200 coins?', undefined, [
                { text: 'Cancel' },
                { text: `Unlock (${coins} 🪙 available)`, onPress: () => Alert.alert('Unlocked') },
              ])}>
                <Text style={{ color: colors.primary, fontWeight: '700' }}>200 🪙</Text>
              </Pressable>
            </View>
          ))}
        </Card>

        <PrimaryButton title="Save changes" onPress={apply} style={{ marginTop: 18 }} />
        <PrimaryButton title="Reset to default" variant="ghost" onPress={() => {
          Alert.alert('Reset background?', undefined, [
            { text: 'Cancel' },
            { text: 'Reset', style: 'destructive', onPress: () => { setProfileBg('#0A4A3D'); setShowCustom(false); } },
          ]);
        }} style={{ marginTop: 10 }} />
      </ScrollView>
    </View>
  );
}

// ── Personalizations ──────────────────────────────────────────────────────
const EMOJIS = ['🚀', '⚡', '🔥', '💎', '🦄', '🧠', '🪙', '📈', '🎯', '✨', '💡', '🛠️', '🌱', '🎨', '🧬', '⚛️'];
const FONTS = ['System', 'Display Bold', 'Serif', 'Mono'];
const PATTERNS = ['None', 'Dots', 'Grid', 'Waves', 'Stars'];

export function PersonalizationsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Personalizations'>) {
  const { pinnedEmoji, setPinnedEmoji, coins, spendCoins, profileBg } = useApp();
  const [tab, setTab] = useState<'emojis' | 'fonts' | 'patterns'>('emojis');
  const [font, setFont] = useState('System');
  const [pattern, setPattern] = useState('None');
  const [opacity, setOpacity] = useState(30);

  const unlock = (cost: number) => {
    if (!spendCoins(cost)) {
      Alert.alert('Not enough coins', 'Visit your wallet to purchase more.');
      return false;
    }
    Alert.alert(`Spend ${cost} coins on this item?`, undefined);
    return true;
  };

  return (
    <View style={s.bg}>
      <Header title="Personalizations" onBack={() => navigation.goBack()} />
      <View style={[s.preview, { backgroundColor: profileBg, marginHorizontal: spacing.lg, marginTop: 14 }]}>
        <Avatar emoji="🚀" size={60} />
        <Text style={{ color: colors.white, fontSize: 24, marginTop: 4 }}>{pinnedEmoji}</Text>
        <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16, marginTop: 8, fontFamily: font === 'Mono' ? undefined : undefined }}>You</Text>
      </View>

      <View style={s.tabs}>
        {(['emojis', 'fonts', 'patterns'] as const).map((t) => (
          <Pressable key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }}>
        {tab === 'emojis' && (
          <View style={s.grid}>
            {EMOJIS.map((e, i) => (
              <Pressable key={e} style={[s.emojiTile, pinnedEmoji === e && { borderColor: colors.primary, backgroundColor: colors.primarySoft }]} onPress={() => setPinnedEmoji(e)}>
                <Text style={{ fontSize: 28 }}>{e}</Text>
                {i >= 12 && <Text style={s.cost}>50 🪙</Text>}
              </Pressable>
            ))}
          </View>
        )}

        {tab === 'fonts' && (
          <Card style={{ paddingVertical: 0 }}>
            {FONTS.map((f, i) => (
              <Pressable key={f} style={s.fontRow} onPress={() => {
                if (i > 0 && !unlock(100)) return;
                setFont(f);
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontSize: 18, fontWeight: i === 1 ? '800' : '500' }}>Sample · You</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{f}{i > 0 ? ' · 100 🪙' : ''}</Text>
                </View>
                {font === f && <Text style={{ color: colors.accent, fontWeight: '800' }}>✓</Text>}
              </Pressable>
            ))}
          </Card>
        )}

        {tab === 'patterns' && (
          <>
            <Card style={{ paddingVertical: 0 }}>
              {PATTERNS.map((p, i) => (
                <Pressable key={p} style={s.fontRow} onPress={() => {
                  if (i > 1 && !unlock(150)) return;
                  setPattern(p);
                }}>
                  <Text style={{ color: colors.text, fontWeight: '600' }}>{p}{i > 1 ? '  ·  150 🪙' : ''}</Text>
                  {pattern === p && <Text style={{ color: colors.accent, fontWeight: '800' }}>✓</Text>}
                </Pressable>
              ))}
            </Card>
            {pattern !== 'None' && (
              <Card style={{ marginTop: 14 }}>
                <Text style={s.sectionLabel}>OVERLAY OPACITY</Text>
                <View style={s.slider}>
                  <View style={[s.sliderFill, { width: `${opacity}%` }]} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  {[0, 25, 50, 75, 100].map((v) => (
                    <Pressable key={v} onPress={() => setOpacity(v)}>
                      <Text style={{ color: opacity === v ? colors.primary : colors.textMuted, fontWeight: opacity === v ? '800' : '600' }}>{v}%</Text>
                    </Pressable>
                  ))}
                </View>
              </Card>
            )}
          </>
        )}

        <PrimaryButton title="Save customizations" onPress={() => Alert.alert('Profile customized!')} style={{ marginTop: 18 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  preview: { alignItems: 'center', padding: 24, borderRadius: radii.lg },
  sectionLabel: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 14, marginBottom: 8 },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: colors.border },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  input: { color: colors.text, backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 12, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  themeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  newBadge: { backgroundColor: colors.accent, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, marginLeft: 8 },
  newBadgeText: { color: colors.textInverse, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginTop: 14, marginBottom: 12, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: colors.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiTile: { width: '22%', aspectRatio: 1, backgroundColor: colors.bgElevated, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, position: 'relative' },
  cost: { position: 'absolute', bottom: 4, fontSize: 9, color: colors.warning, fontWeight: '700' },
  fontRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  slider: { height: 6, backgroundColor: colors.bgInput, borderRadius: 3, overflow: 'hidden' },
  sliderFill: { height: '100%', backgroundColor: colors.primary },
});
