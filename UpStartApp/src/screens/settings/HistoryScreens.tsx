// History, Activity, Likes, Comments, Shares — content history screens.
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, FlatList } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing } from '../../theme/colors';
import { Card, EmptyState, Chip } from '../../components/UI';
import { MOCK_POSTS, MOCK_STARTUPS } from '../../data/mockData';

function Header({ title, onBack, action }: any) {
  return (
    <View style={s.header}>
      <Pressable onPress={onBack}><Text style={{ color: colors.primary }}>← Back</Text></Pressable>
      <Text style={s.headerTitle}>{title}</Text>
      {action || <View style={{ width: 40 }} />}
    </View>
  );
}

// ── History (old posts / archive) ─────────────────────────────────────────
export function HistoryScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'History'>) {
  const [tab, setTab] = useState<'all' | 'archived' | 'deleted'>('all');
  const items = MOCK_POSTS;
  return (
    <View style={s.bg}>
      <Header title="History" onBack={() => navigation.goBack()} />
      <View style={s.tabs}>
        {(['all', 'archived', 'deleted'] as const).map((t) => (
          <Pressable key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {items.length === 0 && <EmptyState emoji="🗂" title="No history" subtitle="Your old posts will appear here." />}
        {items.map((p) => (
          <Pressable key={p.id} style={s.postCard} onPress={() => Alert.alert(
            'Post options', undefined, [
              { text: 'Restore', onPress: () => Alert.alert('Restored') },
              { text: 'Re-share', onPress: () => Alert.alert('Re-shared as new post') },
              { text: 'Delete permanently', style: 'destructive', onPress: () => Alert.alert('Deleted') },
              { text: 'Cancel', style: 'cancel' },
            ])}>
            <Text style={s.postText} numberOfLines={2}>{p.text}</Text>
            <View style={s.postMeta}>
              <Text style={s.metaText}>{p.createdAt}</Text>
              <Text style={s.metaText}>❤️ {p.likes}</Text>
              <Text style={s.metaText}>💬 {p.comments}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// ── Activity ──────────────────────────────────────────────────────────────
export function ActivityScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Activity'>) {
  const [filter, setFilter] = useState<'all' | 'investments' | 'social' | 'logins'>('all');
  const activity = [
    { id: 'a1', icon: '💸', kind: 'investments', text: 'Invested 250 coins in NeuralFlow', ts: '2h ago' },
    { id: 'a2', icon: '❤️', kind: 'social', text: 'Liked Jordan Rivers post', ts: '5h ago' },
    { id: 'a3', icon: '💬', kind: 'social', text: 'Commented on "Hot take: most decks..."', ts: '6h ago' },
    { id: 'a4', icon: '👤', kind: 'logins', text: 'Signed in from iPhone — New York', ts: '1d ago' },
    { id: 'a5', icon: '➕', kind: 'social', text: 'Followed Priya Iyer', ts: '2d ago' },
    { id: 'a6', icon: '💸', kind: 'investments', text: 'Invested 500 coins in PayPath', ts: '5d ago' },
    { id: 'a7', icon: '👤', kind: 'logins', text: 'Signed in from MacBook — New York', ts: '1w ago' },
  ];
  const filtered = activity.filter((a) => filter === 'all' || a.kind === filter);
  return (
    <View style={s.bg}>
      <Header title="Recent activity" onBack={() => navigation.goBack()} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 50 }} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
        {(['all', 'investments', 'social', 'logins'] as const).map((f) => (
          <Chip key={f} label={f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} active={filter === f} onPress={() => setFilter(f)} />
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => (
          <View style={s.actRow}>
            <Text style={{ fontSize: 22, marginRight: 12 }}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.actText}>{item.text}</Text>
              <Text style={s.metaText}>{item.ts}</Text>
            </View>
            {item.kind === 'logins' && (
              <Pressable onPress={() => Alert.alert('Reported', 'Account security review triggered. Option to sign out all devices presented.')}>
                <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '700' }}>This wasn't me</Text>
              </Pressable>
            )}
          </View>
        )}
        ListFooterComponent={
          <Pressable onPress={() => Alert.alert('Clear activity history?', 'This will permanently clear your log.', [
            { text: 'Cancel' },
            { text: 'Clear', style: 'destructive', onPress: () => Alert.alert('Cleared') },
          ])} style={{ marginTop: 14, alignItems: 'center' }}>
            <Text style={{ color: colors.danger, fontWeight: '700' }}>Clear activity history</Text>
          </Pressable>
        }
      />
    </View>
  );
}

// ── Likes ─────────────────────────────────────────────────────────────────
export function LikesScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Likes'>) {
  const liked = MOCK_POSTS;
  return (
    <View style={s.bg}>
      <Header title="Likes" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {liked.map((p) => (
          <Pressable key={p.id} style={s.postCard} onLongPress={() => Alert.alert('Unlike post?', undefined, [
            { text: 'Cancel' },
            { text: 'Unlike', style: 'destructive', onPress: () => Alert.alert('Removed from likes') },
          ])}>
            <Text style={s.postText}>{p.text}</Text>
            <View style={s.postMeta}>
              <Text style={s.metaText}>{p.createdAt}</Text>
              <Text style={s.metaText}>❤️ {p.likes}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// ── Comments ──────────────────────────────────────────────────────────────
export function CommentsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Comments'>) {
  const myComments = [
    { id: 'mc1', text: 'Great breakdown. Curious about retention numbers.', on: 'Jordan Rivers post', ts: '4h ago', edited: false },
    { id: 'mc2', text: 'Same here — would love a deeper dive on schema drift.', on: 'NeuralFlow blog', ts: '1d ago', edited: true },
  ];
  return (
    <View style={s.bg}>
      <Header title="Comments" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {myComments.map((c) => (
          <Card key={c.id} style={{ marginBottom: 10 }}>
            <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 6 }}>on {c.on}</Text>
            <Text style={s.postText}>{c.text}{c.edited && <Text style={{ color: colors.textFaint, fontSize: 11 }}> · edited</Text>}</Text>
            <View style={{ flexDirection: 'row', marginTop: 10, gap: 16 }}>
              <Pressable onPress={() => Alert.alert('Edit', 'Edit window: 30 days.')}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>Edit</Text></Pressable>
              <Pressable onPress={() => Alert.alert('Delete?', undefined, [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive' }])}><Text style={{ color: colors.danger, fontSize: 12, fontWeight: '700' }}>Delete</Text></Pressable>
              <Text style={[s.metaText, { marginLeft: 'auto' as any }]}>{c.ts}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

// ── Shares ────────────────────────────────────────────────────────────────
export function SharesScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Shares'>) {
  const shares = [
    { id: 'sh1', text: 'NeuralFlow just crossed 100 customers...', kind: 'Reshared publicly', ts: '2d ago' },
    { id: 'sh2', text: 'Hot take: most pitch decks should be 4 slides.', kind: 'Sent via DM', ts: '4d ago' },
  ];
  return (
    <View style={s.bg}>
      <Header title="Shares" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {shares.map((sh) => (
          <Card key={sh.id} style={{ marginBottom: 10 }}>
            <Text style={s.postText} numberOfLines={2}>{sh.text}</Text>
            <View style={s.postMeta}>
              <Text style={s.metaText}>{sh.kind}</Text>
              <Text style={s.metaText}>{sh.ts}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
              <Pressable onPress={() => Alert.alert('Share again', 'Composer would open.')}><Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>Share again</Text></Pressable>
              <Pressable onPress={() => Alert.alert('Remove reshare?', undefined, [{ text: 'Cancel' }, { text: 'Remove', style: 'destructive' }])}><Text style={{ color: colors.danger, fontWeight: '700', fontSize: 12 }}>Remove</Text></Pressable>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: 8, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: colors.white },
  postCard: { backgroundColor: colors.bgElevated, padding: 14, borderRadius: radii.md, marginBottom: 10, borderWidth: 1, borderColor: colors.borderLight },
  postText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  postMeta: { flexDirection: 'row', gap: 14, marginTop: 8 },
  metaText: { color: colors.textMuted, fontSize: 12 },
  actRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  actText: { color: colors.text, fontSize: 14 },
});
