import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { MOCK_LIVE_SHOWS, startupById, userById } from '../../data/mockData';
import { Badge, Card, PrimaryButton, Avatar } from '../../components/UI';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LiveListScreen() {
  const navigation = useNavigation<Nav>();
  const [reminders, setReminders] = useState<Set<string>>(new Set());
  const liveNow = MOCK_LIVE_SHOWS.filter((s) => s.isLive);
  const upcoming = MOCK_LIVE_SHOWS.filter((s) => !s.isLive);

  const toggleRemind = (id: string) => {
    setReminders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        Alert.alert('Reminder removed');
      } else {
        next.add(id);
        Alert.alert('Reminder set', "We'll notify you 10 min before the show starts.");
      }
      return next;
    });
  };

  return (
    <View style={styles.bg}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Live</Text>
          <Text style={styles.headerSub}>Product demos and AMAs in real time</Text>
        </View>
        <PrimaryButton title="Go live" variant="accent" onPress={() => navigation.navigate('CreateLiveShow')} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 90 }}>
        {liveNow.length > 0 && (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.section}>NOW LIVE</Text>
              <View style={styles.livePulse} />
            </View>
            {liveNow.map((s) => {
              const startup = startupById(s.startupId);
              const host = userById(s.hostId);
              return (
                <Pressable key={s.id} onPress={() => navigation.navigate('LiveShow', { id: s.id })} style={[styles.liveCard, { borderColor: colors.live + '88' }]}>
                  <View style={[styles.liveBackdrop, { backgroundColor: (startup?.bgColor ?? colors.primary) + '33' }]}>
                    <Text style={{ fontSize: 64 }}>{startup?.logoEmoji ?? '🎙️'}</Text>
                    <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>● LIVE</Text></View>
                    <View style={styles.viewerBadge}><Text style={styles.viewerText}>👁 {s.viewerCount}</Text></View>
                  </View>
                  <View style={{ padding: spacing.lg }}>
                    <Text style={styles.liveTitle}>{s.title}</Text>
                    <Text style={styles.liveDesc}>{s.description}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                      <Avatar emoji={host.avatarEmoji} size={28} verified={host.verified} tier={host.tier} />
                      <Text style={styles.hostName}>{host.name}</Text>
                      {startup && (
                        <View style={styles.startupChip}>
                          <Text style={styles.startupChipText}>{startup.name}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}

        <Text style={[styles.section, { marginTop: 8 }]}>UPCOMING</Text>
        {upcoming.map((s) => {
          const startup = startupById(s.startupId);
          const host = userById(s.hostId);
          const reminded = reminders.has(s.id);
          return (
            <Card key={s.id} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={[styles.upcomingThumb, { backgroundColor: (startup?.bgColor ?? colors.primary) + '22' }]}>
                  <Text style={{ fontSize: 28 }}>{startup?.logoEmoji ?? '🎙️'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.upcomingTitle}>{s.title}</Text>
                  <Text style={styles.upcomingMeta}>{new Date(s.startsAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Avatar emoji={host.avatarEmoji} size={20} tier={host.tier} />
                    <Text style={{ color: colors.textMuted, fontSize: 12, marginLeft: 6, marginRight: 8 }}>{host.name}</Text>
                    <Badge color={s.visibility === 'public' ? colors.accent : s.visibility === 'followers' ? colors.warning : colors.danger}>
                      {s.visibility.toUpperCase()}
                    </Badge>
                  </View>
                </View>
              </View>
              <PrimaryButton
                title={reminded ? '✓ Reminder set' : '🔔 Remind me'}
                variant={reminded ? 'accent' : 'ghost'}
                onPress={() => toggleRemind(s.id)}
                style={{ marginTop: 14 }}
              />
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  headerTitle: { ...typography.h1 },
  headerSub: { ...typography.bodyMuted, marginTop: 2 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  section: { color: colors.textFaint, fontSize: 11, letterSpacing: 1.2, fontWeight: '800', marginBottom: 10 },
  livePulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.live, marginLeft: 8, marginBottom: 8 },
  liveCard: { backgroundColor: colors.bgElevated, borderRadius: radii.lg, overflow: 'hidden', borderWidth: 1, marginBottom: 14 },
  liveBackdrop: { height: 160, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  liveBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: colors.live, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  liveBadgeText: { color: colors.white, fontWeight: '800', fontSize: 11, letterSpacing: 1 },
  viewerBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  viewerText: { color: colors.white, fontWeight: '700', fontSize: 11 },
  liveTitle: { ...typography.h3 },
  liveDesc: { ...typography.bodyMuted, marginTop: 4 },
  hostName: { color: colors.text, fontWeight: '600', fontSize: 13, marginLeft: 8 },
  startupChip: { marginLeft: 'auto' as any, backgroundColor: colors.primarySoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  startupChipText: { color: colors.primary, fontWeight: '700', fontSize: 11 },
  upcomingThumb: { width: 60, height: 60, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  upcomingTitle: { color: colors.text, fontWeight: '700', fontSize: 14 },
  upcomingMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});
