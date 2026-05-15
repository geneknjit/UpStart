import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Card, Badge, PrimaryButton, Stat, Avatar, Divider } from '../../components/UI';
import { startupById } from '../../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'StartupProfile'>;
type Tab = 'overview' | 'problem' | 'solution' | 'team' | 'timeline';

export default function StartupProfileScreen({ route, navigation }: Props) {
  const startup = startupById(route.params.id);
  const [tab, setTab] = useState<Tab>('overview');
  const [following, setFollowing] = useState(false);

  if (!startup) {
    return <View style={styles.bg}><Text style={{ color: colors.text, padding: 40 }}>Startup not found.</Text></View>;
  }

  const pct = Math.min(100, Math.round((startup.raised / startup.raiseTarget) * 100));

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.hero, { backgroundColor: startup.bgColor + '22', borderBottomColor: startup.bgColor + '55' }]}>
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.white, fontSize: 22 }}>‹</Text>
          </Pressable>
          <View style={[styles.heroLogo, { borderColor: startup.bgColor }]}>
            <Text style={{ fontSize: 44 }}>{startup.logoEmoji}</Text>
          </View>
          <Text style={styles.heroName}>{startup.name}</Text>
          <Text style={styles.heroTagline}>{startup.tagline}</Text>
          <View style={styles.heroChips}>
            <View style={styles.heroChip}><Text style={styles.heroChipText}>{startup.industry[0]}</Text></View>
            <View style={styles.heroChip}><Text style={styles.heroChipText}>{startup.stage}</Text></View>
            <View style={styles.heroChip}><Text style={styles.heroChipText}>{startup.region}</Text></View>
          </View>
          <View style={styles.actions}>
            <PrimaryButton
              title={following ? 'Following ✓' : 'Follow'}
              onPress={() => setFollowing((v) => !v)}
              variant={following ? 'ghost' : 'primary'}
              style={{ flex: 1 }}
            />
            <PrimaryButton
              title="Request Commission"
              onPress={() => navigation.navigate('CommissionRequest', { startupId: startup.id })}
              variant="ghost"
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Funding card */}
        <Card style={{ margin: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ ...typography.h3, flex: 1 }}>Current round</Text>
            <Badge color={startup.dealStatus === 'Open' ? colors.accent : startup.dealStatus === 'Filling' ? colors.warning : colors.textFaint}>
              {startup.dealStatus.toUpperCase()}
            </Badge>
          </View>
          <View style={styles.progressWrap}>
            <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: startup.bgColor }]} />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressText}>${(startup.raised / 1000).toFixed(0)}K raised</Text>
            <Text style={styles.progressText}>{pct}%</Text>
            <Text style={styles.progressText}>${(startup.raiseTarget / 1000).toFixed(0)}K target</Text>
          </View>
          <Divider />
          <View style={styles.statRow}>
            <Stat value={`$${(startup.valuation / 1000000).toFixed(1)}M`} label="Valuation" />
            <Stat value={startup.dealType} label="Deal Type" />
            <Stat value={`$${startup.minInvestment}`} label="Min Invest" />
          </View>
          <PrimaryButton
            title="Invest now"
            variant="accent"
            onPress={() => navigation.navigate('Invest', { startupId: startup.id, liveId: null })}
            style={{ marginTop: 14 }}
          />
        </Card>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
          {(['overview', 'problem', 'solution', 'team', 'timeline'] as Tab[]).map((t) => (
            <Pressable key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t[0].toUpperCase() + t.slice(1)}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: spacing.lg }}>
          {tab === 'overview' && (
            <Card>
              <Text style={styles.label}>FOLLOWERS</Text>
              <Text style={[styles.body, { marginBottom: 12 }]}>{startup.followers.toLocaleString()}</Text>
              <Text style={styles.label}>PROBLEM (snapshot)</Text>
              <Text style={[styles.body, { marginBottom: 12 }]}>{startup.problem}</Text>
              <Text style={styles.label}>SOLUTION (snapshot)</Text>
              <Text style={styles.body}>{startup.solution}</Text>
            </Card>
          )}

          {tab === 'problem' && (
            <Card>
              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <Text style={{ fontSize: 28, marginRight: 12 }}>⚠️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardHeader}>The Problem</Text>
                </View>
              </View>
              <Text style={[styles.body, { marginBottom: 14 }]}>{startup.problem}</Text>
              <View style={styles.statHighlight}>
                <Text style={styles.statHighlightLabel}>KEY STAT</Text>
                <Text style={styles.statHighlightText}>{startup.problemStat}</Text>
              </View>
            </Card>
          )}

          {tab === 'solution' && (
            <Card>
              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <Text style={{ fontSize: 28, marginRight: 12 }}>💡</Text>
                <Text style={styles.cardHeader}>The Solution</Text>
              </View>
              <Text style={[styles.body, { marginBottom: 16 }]}>{startup.solution}</Text>
              <Pressable
                style={styles.demoBlock}
                onPress={() => Alert.alert('Demo', 'A video player would open here.')}
              >
                <Text style={{ fontSize: 36 }}>▶️</Text>
                <Text style={{ color: colors.text, marginTop: 8, fontWeight: '600' }}>Watch demo</Text>
                <Text style={{ color: colors.textFaint, fontSize: 12, marginTop: 4 }}>2:14</Text>
              </Pressable>
              <Pressable
                style={[styles.demoBlock, { marginTop: 10 }]}
                onPress={() => Alert.alert('Prototype', 'External link would open in browser.')}
              >
                <Text style={{ color: colors.primary, fontWeight: '700' }}>↗ Visit live prototype</Text>
              </Pressable>
            </Card>
          )}

          {tab === 'team' && (
            <Card>
              <Text style={styles.cardHeader}>Founding Team</Text>
              {startup.team.map((m, i) => (
                <View key={i} style={[styles.memberRow, i === 0 && { marginTop: 14 }]}>
                  <Avatar emoji={m.emoji} size={48} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.memberName}>{m.name}</Text>
                    <Text style={styles.memberRole}>{m.role}</Text>
                    <Text style={styles.memberBio}>{m.bio}</Text>
                  </View>
                  <Pressable onPress={() => Alert.alert('LinkedIn', 'Would open LinkedIn profile.')}>
                    <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>in →</Text>
                  </Pressable>
                </View>
              ))}
            </Card>
          )}

          {tab === 'timeline' && (
            <Card>
              <Text style={styles.cardHeader}>Milestones</Text>
              {startup.milestones.map((m, i) => (
                <View key={i} style={styles.tlRow}>
                  <View style={[styles.tlDot, { backgroundColor: m.complete ? colors.accent : colors.bgInput, borderColor: m.complete ? colors.accent : colors.border }]}>
                    {m.complete && <Text style={{ color: colors.textInverse, fontSize: 11, fontWeight: '800' }}>✓</Text>}
                  </View>
                  <View style={{ flex: 1, paddingLeft: 12, paddingBottom: i === startup.milestones.length - 1 ? 0 : 16 }}>
                    <Text style={styles.tlDate}>{m.date}</Text>
                    <Text style={styles.tlTitle}>{m.title}</Text>
                    <Text style={styles.tlDesc}>{m.description}</Text>
                  </View>
                </View>
              ))}
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  back: { position: 'absolute', top: 56, left: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  hero: { paddingTop: 80, paddingBottom: 24, paddingHorizontal: spacing.lg, alignItems: 'center', borderBottomWidth: 1 },
  heroLogo: { width: 80, height: 80, borderRadius: 22, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  heroName: { ...typography.h1, marginTop: 14 },
  heroTagline: { ...typography.bodyMuted, textAlign: 'center', marginTop: 4 },
  heroChips: { flexDirection: 'row', marginTop: 12 },
  heroChip: { backgroundColor: colors.bgElevated, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.sm, marginHorizontal: 3 },
  heroChipText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18, alignSelf: 'stretch' },
  progressWrap: { height: 10, backgroundColor: colors.bgInput, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%' },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tabs: { maxHeight: 50, marginVertical: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radii.pill, backgroundColor: colors.bgElevated, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: colors.white },
  cardHeader: { ...typography.h3, marginBottom: 4 },
  label: { ...typography.tiny, marginBottom: 4 },
  body: { ...typography.body },
  statHighlight: { backgroundColor: colors.primarySoft, borderRadius: radii.md, padding: 14, borderLeftWidth: 3, borderLeftColor: colors.primary },
  statHighlightLabel: { color: colors.primary, fontWeight: '800', fontSize: 11, letterSpacing: 0.6, marginBottom: 4 },
  statHighlightText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  demoBlock: { alignItems: 'center', padding: 24, backgroundColor: colors.bgInput, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border },
  memberRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.borderLight },
  memberName: { color: colors.text, fontWeight: '700', fontSize: 15 },
  memberRole: { color: colors.primary, fontSize: 13, marginTop: 1, fontWeight: '600' },
  memberBio: { color: colors.textMuted, fontSize: 13, marginTop: 4, lineHeight: 18 },
  tlRow: { flexDirection: 'row', marginTop: 12 },
  tlDot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  tlDate: { ...typography.tiny, color: colors.primary, marginBottom: 2 },
  tlTitle: { color: colors.text, fontWeight: '700', fontSize: 15 },
  tlDesc: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
