import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Avatar, PrimaryButton } from '../../components/UI';
import { MOCK_USERS } from '../../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'NewChat'>;

export default function NewChatScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');

  const users = useMemo(() => MOCK_USERS.filter((u) => u.id !== 'u_self').filter((u) =>
    !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.handle.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  const toggle = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const startChat = () => {
    if (selected.length === 0) return Alert.alert('Pick at least one person');
    if (selected.length > 1 && !groupName.trim()) return Alert.alert('Group name required');
    Alert.alert('Chat created', selected.length > 1 ? `Group "${groupName}" created with ${selected.length} members.` : 'Conversation started.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.bg}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, fontSize: 14 }}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>New chat</Text>
        <Pressable onPress={startChat}>
          <Text style={{ color: selected.length > 0 ? colors.primary : colors.textFaint, fontWeight: '700' }}>Start</Text>
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          value={query}
          onChangeText={setQuery}
          placeholder="Search users..."
          placeholderTextColor={colors.textFaint}
        />
      </View>

      {selected.length > 1 && (
        <TextInput
          style={[styles.search, { margin: spacing.lg, marginTop: 0 }]}
          value={groupName}
          onChangeText={setGroupName}
          placeholder="Group name (required)"
          placeholderTextColor={colors.textFaint}
        />
      )}

      {selected.length > 0 && (
        <View style={styles.selectedRow}>
          {selected.map((id) => {
            const u = MOCK_USERS.find((x) => x.id === id)!;
            return (
              <Pressable key={id} onPress={() => toggle(id)} style={styles.selectedChip}>
                <Text style={{ fontSize: 16, marginRight: 6 }}>{u.avatarEmoji}</Text>
                <Text style={{ color: colors.white, fontWeight: '600', fontSize: 13 }}>{u.name}</Text>
                <Text style={{ color: colors.white, marginLeft: 6, fontWeight: '800' }}>×</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }}
        renderItem={({ item }) => (
          <Pressable style={styles.userRow} onPress={() => toggle(item.id)}>
            <Avatar emoji={item.avatarEmoji} size={44} tier={item.tier} verified={item.verified} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userHandle}>@{item.handle} · {item.followers.toLocaleString()} followers</Text>
            </View>
            <View style={[styles.check, selected.includes(item.id) && styles.checkOn]}>
              {selected.includes(item.id) && <Text style={{ color: colors.white, fontWeight: '800' }}>✓</Text>}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  title: { ...typography.h3 },
  searchWrap: { paddingHorizontal: spacing.lg, marginBottom: 10 },
  search: { backgroundColor: colors.bgElevated, color: colors.text, borderRadius: radii.md, padding: 12, borderWidth: 1, borderColor: colors.border, fontSize: 14 },
  selectedRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: 6, marginBottom: 8 },
  selectedChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radii.pill },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  userName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  userHandle: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  check: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
});
