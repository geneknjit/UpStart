import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Card, Chip, Badge, EmptyState } from '../../components/UI';
import {
  MOCK_STARTUPS, INDUSTRIES, REGIONS, STAGES,
  Industry, Region, Stage, Startup,
} from '../../data/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DiscoveryScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [openDropdown, setOpenDropdown] = useState<'industry' | 'region' | 'stage' | null>(null);

  const toggle = <T,>(arr: T[], v: T, setter: (a: T[]) => void) =>
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const results = useMemo(() => {
    return MOCK_STARTUPS.filter((s) => {
      if (industries.length && !s.industry.some((i) => industries.includes(i))) return false;
      if (regions.length && !regions.includes(s.region)) return false;
      if (stages.length && !stages.includes(s.stage)) return false;
      if (query && !(s.name.toLowerCase().includes(query.toLowerCase()) || s.tagline.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    });
  }, [industries, regions, stages, query]);

  const activeChips = [
    ...industries.map((i) => ({ key: `i:${i}`, label: i, remove: () => toggle(industries, i, setIndustries) })),
    ...regions.map((r) => ({ key: `r:${r}`, label: r, remove: () => toggle(regions, r, setRegions) })),
    ...stages.map((st) => ({ key: `s:${st}`, label: st, remove: () => toggle(stages, st, setStages) })),
  ];

  const clearAll = () => { setIndustries([]); setRegions([]); setStages([]); };

  return (
    <View style={styles.bg}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Image source={require('../../../assets/logo-mark.png')} style={styles.headerLogo} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Discover</Text>
            <Text style={styles.headerSub}>{results.length} startups matching</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search startups, founders, ideas"
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolbar} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
        <FilterButton label="Industry" count={industries.length} onPress={() => setOpenDropdown(openDropdown === 'industry' ? null : 'industry')} active={industries.length > 0} />
        <FilterButton label="Region" count={regions.length} onPress={() => setOpenDropdown(openDropdown === 'region' ? null : 'region')} active={regions.length > 0} />
        <FilterButton label="Stage" count={stages.length} onPress={() => setOpenDropdown(openDropdown === 'stage' ? null : 'stage')} active={stages.length > 0} />
        {activeChips.length > 0 && (
          <Pressable onPress={clearAll} style={[styles.filterBtn, { borderColor: colors.danger }]}>
            <Text style={{ color: colors.danger, fontWeight: '600', fontSize: 13 }}>Clear all</Text>
          </Pressable>
        )}
      </ScrollView>

      {openDropdown && (
        <View style={styles.dropdown}>
          {openDropdown === 'industry' && (
            <View style={styles.dropdownRow}>
              {INDUSTRIES.map((i) => (
                <Chip key={i} label={i} active={industries.includes(i)} onPress={() => toggle(industries, i, setIndustries)} style={{ marginBottom: 8 }} />
              ))}
            </View>
          )}
          {openDropdown === 'region' && (
            <View style={styles.dropdownRow}>
              {REGIONS.map((r) => (
                <Chip key={r} label={r} active={regions.includes(r)} onPress={() => toggle(regions, r, setRegions)} style={{ marginBottom: 8 }} />
              ))}
            </View>
          )}
          {openDropdown === 'stage' && (
            <View style={styles.dropdownRow}>
              {STAGES.map((st) => (
                <Chip key={st} label={st} active={stages.includes(st)} onPress={() => toggle(stages, st, setStages)} style={{ marginBottom: 8 }} />
              ))}
            </View>
          )}
        </View>
      )}

      {activeChips.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeRow} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
          {activeChips.map((c) => (
            <Chip key={c.key} label={c.label} onClose={c.remove} active />
          ))}
        </ScrollView>
      )}

      <FlatList
        data={results}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 90 }}
        renderItem={({ item }) => (
          <StartupCard startup={item} onPress={() => navigation.navigate('StartupProfile', { id: item.id })} />
        )}
        ListEmptyComponent={
          <EmptyState emoji="🔍" title="No startups match your filters" subtitle="Try adjusting your selection." />
        }
      />
    </View>
  );
}

function FilterButton({ label, count, active, onPress }: { label: string; count: number; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.filterBtn, active && { borderColor: colors.primary, backgroundColor: colors.primarySoft }]} onPress={onPress}>
      <Text style={[styles.filterBtnText, active && { color: colors.primary }]}>{label}{count ? ` · ${count}` : ''}</Text>
      <Text style={{ color: active ? colors.primary : colors.textFaint, marginLeft: 4 }}>▾</Text>
    </Pressable>
  );
}

function StartupCard({ startup, onPress }: { startup: Startup; onPress: () => void }) {
  const pct = Math.min(100, Math.round((startup.raised / startup.raiseTarget) * 100));
  const statusColor = startup.dealStatus === 'Open' ? colors.accent : startup.dealStatus === 'Filling' ? colors.warning : colors.textFaint;
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.logo, { backgroundColor: startup.bgColor + '22', borderColor: startup.bgColor + '55' }]}>
          <Text style={{ fontSize: 28 }}>{startup.logoEmoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.cardName}>{startup.name}</Text>
            <Badge color={statusColor}>{startup.dealStatus.toUpperCase()}</Badge>
          </View>
          <Text style={styles.cardTagline} numberOfLines={2}>{startup.tagline}</Text>
        </View>
      </View>
      <View style={styles.tagRow}>
        {startup.industry.slice(0, 2).map((i) => (
          <View key={i} style={styles.tag}><Text style={styles.tagText}>{i}</Text></View>
        ))}
        <View style={styles.tag}><Text style={styles.tagText}>{startup.stage}</Text></View>
        <View style={styles.tag}><Text style={styles.tagText}>{startup.region}</Text></View>
      </View>
      <View style={styles.progressWrap}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: startup.bgColor }]} />
      </View>
      <View style={styles.progressMeta}>
        <Text style={styles.progressText}>${(startup.raised / 1000).toFixed(0)}K raised</Text>
        <Text style={styles.progressText}>{pct}% of ${(startup.raiseTarget / 1000).toFixed(0)}K</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerLogo: { width: 40, height: 40 },
  headerTitle: { ...typography.h1 },
  headerSub: { ...typography.bodyMuted, marginTop: 2 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgElevated, marginHorizontal: spacing.lg, marginTop: 12, marginBottom: 10,
    borderRadius: radii.md, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, color: colors.text, paddingVertical: 12, fontSize: 14 },
  toolbar: { maxHeight: 50 },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.bgElevated, marginRight: 8,
  },
  filterBtnText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  dropdown: {
    marginHorizontal: spacing.lg, padding: 12,
    backgroundColor: colors.bgElevated, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.border, marginTop: 4,
  },
  dropdownRow: { flexDirection: 'row', flexWrap: 'wrap' },
  activeRow: { maxHeight: 44, marginTop: 8 },
  card: {
    backgroundColor: colors.bgElevated, borderRadius: radii.lg, padding: spacing.lg,
    marginBottom: 12, borderWidth: 1, borderColor: colors.borderLight,
  },
  cardHeader: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  logo: {
    width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    marginRight: 14, borderWidth: 1,
  },
  cardName: { ...typography.h3, marginRight: 8 },
  cardTagline: { ...typography.bodyMuted, marginTop: 2 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  tag: { backgroundColor: colors.bgInput, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.sm, marginRight: 6, marginBottom: 4 },
  tagText: { color: colors.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
  progressWrap: { height: 6, backgroundColor: colors.bgInput, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%' },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
});
