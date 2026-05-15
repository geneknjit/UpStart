import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Avatar, EmptyState } from '../../components/UI';
import { MOCK_CHATS, userById, MOCK_USERS } from '../../data/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Tab = 'all' | 'friends' | 'requests';

export default function MessagesListScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');

  const threads = MOCK_CHATS.filter((c) => {
    if (query) {
      const other = c.participantIds.filter((p) => p !== 'u_self').map(userById);
      const names = (c.isGroup ? c.groupName : '') + ' ' + other.map((u) => u.name + ' ' + u.handle).join(' ');
      if (!names.toLowerCase().includes(query.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <View style={styles.bg}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Messages</Text>
        </View>
        <Pressable style={styles.composeBtn} onPress={() => navigation.navigate('NewChat')}>
          <Text style={{ color: colors.white, fontSize: 22, fontWeight: '700' }}>+</Text>
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.tabs}>
        {(['all', 'friends', 'requests'] as Tab[]).map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'requests' ? 'Requests · 2' : t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      {tab === 'requests' ? (
        <FlatList
          data={MOCK_USERS.slice(3, 5)}
          keyExtractor={(u) => u.id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 90 }}
          renderItem={({ item }) => (
            <View style={styles.requestRow}>
              <Avatar emoji={item.avatarEmoji} size={44} tier={item.tier} verified={item.verified} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.threadName}>{item.name}</Text>
                <Text style={styles.threadPreview} numberOfLines={2}>"Hey — saw your investment in NeuralFlow. Quick question..."</Text>
              </View>
              <View style={{ gap: 6 }}>
                <Pressable style={styles.accept}><Text style={{ color: colors.white, fontSize: 12, fontWeight: '700' }}>Accept</Text></Pressable>
                <Pressable style={styles.decline}><Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '700' }}>Decline</Text></Pressable>
              </View>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 90 }}
          ListEmptyComponent={<EmptyState emoji="💬" title={`No ${tab === 'friends' ? 'friend' : ''} conversations`} subtitle="Tap + to start a chat." />}
          renderItem={({ item: c }) => {
            const others = c.participantIds.filter((p) => p !== 'u_self').map(userById);
            const lead = others[0];
            return (
              <Pressable style={styles.threadRow} onPress={() => navigation.navigate('Chat', { id: c.id })}>
                <Avatar emoji={c.isGroup ? '👥' : lead.avatarEmoji} size={52} tier={lead.tier} verified={lead.verified} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.threadHead}>
                    <Text style={styles.threadName}>{c.isGroup ? c.groupName : lead.name}</Text>
                    <Text style={styles.threadTs}>{c.lastTs}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.threadPreview, { flex: 1 }]} numberOfLines={1}>{c.lastMessage}</Text>
                    {c.unread > 0 && (
                      <View style={styles.unread}><Text style={styles.unreadText}>{c.unread}</Text></View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 4 },
  title: { ...typography.h1 },
  composeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgElevated, marginHorizontal: spacing.lg, marginTop: 8, borderRadius: radii.md, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, color: colors.text, paddingVertical: 12, fontSize: 14 },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginTop: 12, marginBottom: 4, gap: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: colors.white },
  threadRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  threadHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  threadName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  threadTs: { color: colors.textFaint, fontSize: 11 },
  threadPreview: { color: colors.textMuted, fontSize: 13 },
  unread: { backgroundColor: colors.primary, paddingHorizontal: 6, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
  unreadText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  requestRow: { flexDirection: 'row', padding: 12, marginBottom: 10, backgroundColor: colors.bgElevated, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  accept: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.sm },
  decline: { backgroundColor: colors.bgInput, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.sm },
});
