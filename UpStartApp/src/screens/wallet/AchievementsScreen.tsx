import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { MOCK_ACHIEVEMENTS, Achievement } from '../../data/mockData';
import { Card } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'Achievements'>;

const RARITY_COLORS: Record<string, string> = {
  Common: colors.textMuted,
  Rare: colors.primary,
  Epic: '#C77DFF',
  Legendary: colors.tierGold,
};

export default function AchievementsScreen({ navigation }: Props) {
  const { badges, tier } = useApp();
  const [tab, setTab] = useState<'all' | 'earned' | 'locked'>('all');

  const earned = MOCK_ACHIEVEMENTS.filter((a) => a.earnedAt || badges.includes(a.id));
  const locked = MOCK_ACHIEVEMENTS.filter((a) => !a.earnedAt && !badges.includes(a.id));
  const list = tab === 'earned' ? earned : tab === 'locked' ? locked : MOCK_ACHIEVEMENTS;

  const tierLabels = ['Bronze Backer', 'Silver Investor', 'Gold Patron', 'Platinum Visionary'];
  const tierIdx = tier === 'platinum' ? 4 : tier === 'gold' ? 3 : tier === 'silver' ? 2 : tier === 'bronze' ? 1 : 0;

  const detail = (a: Achievement) => {
    const isEarned = !!a.earnedAt || badges.includes(a.id);
    Alert.alert(
      `${a.emoji}  ${a.name}`,
      `${a.description}\n\n${isEarned ? `Earned ${a.earnedAt ?? 'recently'}` : `Progress: ${a.progress?.current ?? 0}/${a.progress?.target ?? '?'}`}\n\nRarity: ${a.rarity}`,
      isEarned ? [
        { text: 'Share', onPress: () => Alert.alert('Share', 'Post composer with badge would open.') },
        { text: 'Close' },
      ] : [{ text: 'Close' }]
    );
  };

  return (
    <View style={styles.bg}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, fontSize: 14 }}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tier ladder */}
      <Card style={{ margin: spacing.lg }}>
        <Text style={styles.tierTitle}>Investor Tier</Text>
        <View style={styles.ladder}>
          {['none', 'bronze', 'silver', 'gold', 'platinum'].map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 && <View style={[styles.ladderLine, i <= tierIdx && { backgroundColor: colors.accent }]} />}
              <View style={[
                styles.ladderDot,
                i <= tierIdx && {
                  backgroundColor: t === 'bronze' ? colors.tierBronze : t === 'silver' ? colors.tierSilver : t === 'gold' ? colors.tierGold : t === 'platinum' ? colors.tierPlatinum : colors.bgInput,
                  borderColor: t === 'bronze' ? colors.tierBronze : t === 'silver' ? colors.tierSilver : t === 'gold' ? colors.tierGold : t === 'platinum' ? colors.tierPlatinum : colors.border,
                },
              ]}>
                {i <= tierIdx && i > 0 && <Text style={{ fontSize: 14 }}>✓</Text>}
              </View>
            </React.Fragment>
          ))}
        </View>
        <Text style={styles.tierLabel}>{tierIdx === 0 ? 'Make your first investment to earn Bronze' : `${tierLabels[tierIdx - 1]} unlocked`}</Text>
      </Card>

      <View style={styles.tabs}>
        {(['all', 'earned', 'locked'] as const).map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'earned' ? `Earned · ${earned.length}` : t === 'locked' ? `Locked · ${locked.length}` : 'All'}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 90 }}>
        <View style={styles.grid}>
          {list.map((a) => {
            const isEarned = !!a.earnedAt || badges.includes(a.id);
            return (
              <Pressable key={a.id} style={[styles.tile, !isEarned && { opacity: 0.55 }]} onPress={() => detail(a)}>
                <Text style={{ fontSize: 38, marginBottom: 6 }}>{isEarned ? a.emoji : '🔒'}</Text>
                <Text style={styles.tileName} numberOfLines={1}>{a.name}</Text>
                <Text style={[styles.tileRarity, { color: RARITY_COLORS[a.rarity] }]}>{a.rarity}</Text>
                {!isEarned && a.progress && (
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(a.progress.current / a.progress.target) * 100}%` }]} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  tierTitle: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 12 },
  ladder: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ladderDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  ladderLine: { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: 4 },
  tierLabel: { color: colors.text, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: 12, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radii.pill, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: colors.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  tile: { width: '31%', backgroundColor: colors.bgElevated, padding: 12, borderRadius: radii.md, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  tileName: { color: colors.text, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  tileRarity: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginTop: 4 },
  progressBar: { width: '100%', height: 3, backgroundColor: colors.bgInput, borderRadius: 2, marginTop: 8 },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
});
