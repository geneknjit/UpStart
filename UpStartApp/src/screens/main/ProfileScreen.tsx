import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Stat, Badge, Avatar, PrimaryButton } from '../../components/UI';
import { MOCK_ACHIEVEMENTS, MOCK_POSTS, userById } from '../../data/mockData';
import { logOut } from '../../services/back4app';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { coins, totalInvested, tier, badges, profileBg, pinnedEmoji } = useApp();
  const { displayName, email, sessionToken, clearSession } = useAuth();

  const earnedBadges = MOCK_ACHIEVEMENTS.filter((a) => badges.includes(a.id) || a.earnedAt);
  const myPosts = MOCK_POSTS.slice(0, 2);

  const tierLabel = tier === 'none' ? 'Backer' : tier.charAt(0).toUpperCase() + tier.slice(1);
  const tierColors: Record<string, string> = {
    bronze: colors.tierBronze, silver: colors.tierSilver, gold: colors.tierGold, platinum: colors.tierPlatinum, none: colors.textFaint,
  };

  const handleLogout = () => {
    Alert.alert('Sign out?', 'You can come back any time.', [
      { text: 'Stay', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          if (sessionToken) await logOut(sessionToken).catch(() => {});
          await clearSession();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Hero w/ custom bg */}
        <View style={[styles.hero, { backgroundColor: profileBg }]}>
          <View style={styles.heroActions}>
            <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('Settings')}>
              <Text style={{ color: colors.white, fontSize: 18 }}>⚙</Text>
            </Pressable>
          </View>
          <View style={styles.avatarWrap}>
            <Avatar emoji="🚀" size={88} tier={tier === 'none' ? undefined : tier} verified />
            <Text style={styles.pinnedEmoji}>{pinnedEmoji}</Text>
          </View>
          <Text style={styles.name}>{displayName || 'You'}</Text>
          <Text style={styles.handle}>@{(displayName || 'you').toLowerCase().replace(/\s+/g, '')}</Text>
          {tier !== 'none' && (
            <View style={[styles.tierBadge, { borderColor: tierColors[tier], backgroundColor: tierColors[tier] + '22' }]}>
              <Text style={[styles.tierText, { color: tierColors[tier] }]}>{tierLabel.toUpperCase()} TIER</Text>
            </View>
          )}
        </View>

        <View style={{ padding: spacing.lg }}>
          <Card>
            <View style={styles.statRow}>
              <Stat value={String(badges.length)} label="Badges" />
              <Stat value="42" label="Followers" />
              <Stat value="3" label="Following" />
              <Stat value="2" label="Investments" />
            </View>
          </Card>

          <View style={styles.shortcutRow}>
            <ShortcutTile emoji="🪙" value={`${coins.toLocaleString()}`} label="Coins" onPress={() => navigation.navigate('Wallet')} color={colors.warning} />
            <ShortcutTile emoji="🏆" value={String(earnedBadges.length)} label="Achievements" onPress={() => navigation.navigate('Achievements')} color={colors.accent} />
            <ShortcutTile emoji="📈" value={`${totalInvested}`} label="Invested" onPress={() => navigation.navigate('Activity')} color={colors.primary} />
          </View>

          <PrimaryButton
            title="Customize profile"
            variant="ghost"
            onPress={() => navigation.navigate('Personalizations')}
            style={{ marginTop: 14 }}
          />

          <Text style={styles.sectionTitle}>EARNED BADGES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -spacing.lg }} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
            {earnedBadges.map((b) => (
              <Pressable key={b.id} style={styles.badgeTile} onPress={() => navigation.navigate('Achievements')}>
                <Text style={{ fontSize: 32 }}>{b.emoji}</Text>
                <Text style={styles.badgeTileName} numberOfLines={1}>{b.name}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>RECENT POSTS</Text>
          {myPosts.map((p) => (
            <Card key={p.id} style={{ marginBottom: 10 }}>
              <Text style={{ color: colors.text, fontSize: 15, lineHeight: 21 }}>{p.text}</Text>
              <View style={styles.postFoot}>
                <Text style={styles.postFootText}>❤️ {p.likes}</Text>
                <Text style={styles.postFootText}>💬 {p.comments}</Text>
                <Text style={styles.postFootText}>↗ {p.shares}</Text>
                <Text style={[styles.postFootText, { marginLeft: 'auto' as any }]}>{p.createdAt}</Text>
              </View>
            </Card>
          ))}

          <PrimaryButton title="Sign out" variant="ghost" onPress={handleLogout} style={{ marginTop: 16 }} />
          {email && <Text style={{ color: colors.textFaint, fontSize: 12, textAlign: 'center', marginTop: 8 }}>{email}</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

function ShortcutTile({ emoji, value, label, onPress, color }: any) {
  return (
    <Pressable style={[styles.shortcut, { borderColor: color + '44' }]} onPress={onPress}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={[styles.shortcutValue, { color }]}>{value}</Text>
      <Text style={styles.shortcutLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  hero: { paddingTop: 60, paddingBottom: 26, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  heroActions: { position: 'absolute', top: 50, right: 16, flexDirection: 'row', gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { position: 'relative' },
  pinnedEmoji: { position: 'absolute', right: -6, bottom: -2, fontSize: 28 },
  name: { color: colors.white, fontSize: 22, fontWeight: '800', marginTop: 12 },
  handle: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  tierBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1.5, marginTop: 10 },
  tierText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  statRow: { flexDirection: 'row' },
  shortcutRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  shortcut: { flex: 1, backgroundColor: colors.bgElevated, padding: 14, borderRadius: radii.md, alignItems: 'center', borderWidth: 1 },
  shortcutValue: { fontSize: 18, fontWeight: '800', marginTop: 6 },
  shortcutLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  sectionTitle: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 22, marginBottom: 10 },
  badgeTile: { width: 90, alignItems: 'center', backgroundColor: colors.bgElevated, padding: 12, borderRadius: radii.md, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  badgeTileName: { color: colors.text, fontSize: 11, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  postFoot: { flexDirection: 'row', marginTop: 12, gap: 16 },
  postFootText: { color: colors.textMuted, fontSize: 12 },
});
