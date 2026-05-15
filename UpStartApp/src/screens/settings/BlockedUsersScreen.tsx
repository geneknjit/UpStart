import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput, FlatList } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing } from '../../theme/colors';
import { Avatar, EmptyState } from '../../components/UI';
import { MOCK_USERS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'BlockedUsers'>;

export default function BlockedUsersScreen({ navigation }: Props) {
  const { blocked, block, unblock } = useApp();
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState('');

  const searchResults = q.length >= 2 ? MOCK_USERS.filter((u) => u.id !== 'u_self' && (u.name.toLowerCase().includes(q.toLowerCase()) || u.handle.includes(q.toLowerCase()))) : [];

  const confirmBlock = (u: any) => Alert.alert(`Block ${u.name}?`, `They won't be able to see your profile or contact you.`, [
    { text: 'Cancel' },
    { text: 'Block', style: 'destructive', onPress: () => {
      block({ id: u.id, name: u.name, handle: u.handle });
      setSearching(false); setQ('');
    } },
  ]);

  const confirmUnblock = (u: any) => Alert.alert(`Unblock ${u.name}?`, undefined, [
    { text: 'Cancel' },
    { text: 'Unblock', onPress: () => unblock(u.id) },
  ]);

  return (
    <View style={s.bg}>
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={{ color: colors.primary }}>← Back</Text></Pressable>
        <Text style={s.title}>Blocked users</Text>
        <Pressable onPress={() => setSearching((v) => !v)}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>{searching ? 'Done' : '+ Block'}</Text>
        </Pressable>
      </View>

      {searching ? (
        <>
          <View style={s.searchWrap}>
            <TextInput value={q} onChangeText={setQ} placeholder="Search users..." placeholderTextColor={colors.textFaint} style={s.search} autoFocus />
          </View>
          <FlatList
            data={searchResults}
            keyExtractor={(u) => u.id}
            contentContainerStyle={{ padding: spacing.lg }}
            renderItem={({ item }) => {
              const already = blocked.find((b) => b.id === item.id);
              return (
                <Pressable style={s.row} onPress={() => already ? confirmUnblock(item) : confirmBlock(item)}>
                  <Avatar emoji={item.avatarEmoji} size={40} tier={item.tier} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={s.name}>{item.name}</Text>
                    <Text style={s.handle}>@{item.handle}</Text>
                  </View>
                  <Text style={{ color: already ? colors.accent : colors.danger, fontWeight: '700', fontSize: 13 }}>{already ? 'UNBLOCK' : 'BLOCK'}</Text>
                </Pressable>
              );
            }}
          />
        </>
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          {blocked.length === 0 ? (
            <EmptyState emoji="🚫" title="No blocked users" subtitle="Tap + Block to add one." />
          ) : (
            blocked.map((u) => (
              <View key={u.id} style={s.row}>
                <Avatar emoji="🙅" size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.name}>{u.name}</Text>
                  <Text style={s.handle}>@{u.handle}</Text>
                </View>
                <Pressable onPress={() => confirmUnblock(u)} style={s.unblockBtn}>
                  <Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>Unblock</Text>
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  searchWrap: { paddingHorizontal: spacing.lg, marginTop: 8 },
  search: { backgroundColor: colors.bgElevated, color: colors.text, borderRadius: radii.md, padding: 12, borderWidth: 1, borderColor: colors.border, fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  name: { color: colors.text, fontWeight: '600' },
  handle: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  unblockBtn: { backgroundColor: colors.bgInput, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border },
});
