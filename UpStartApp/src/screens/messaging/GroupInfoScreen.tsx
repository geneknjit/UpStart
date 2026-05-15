import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Avatar, Card, PrimaryButton, Row, Toggle } from '../../components/UI';
import { MOCK_CHATS, userById } from '../../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupInfo'>;

export default function GroupInfoScreen({ route, navigation }: Props) {
  const chat = MOCK_CHATS.find((c) => c.id === route.params.id);
  const [muted, setMuted] = useState(false);
  const [members, setMembers] = useState(chat?.participantIds ?? []);

  if (!chat || !chat.isGroup) return null;

  const onMember = (id: string) => {
    Alert.alert(userById(id).name, undefined, [
      { text: 'Remove from group', style: 'destructive', onPress: () => setMembers((m) => m.filter((x) => x !== id)) },
      { text: 'Make admin', onPress: () => Alert.alert('Now an admin') },
      { text: 'View profile', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const leave = () =>
    Alert.alert(`Leave ${chat.groupName}?`, "You won't see new messages.", [
      { text: 'Stay', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: () => navigation.popToTop() },
    ]);

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start' }}>
            <Text style={{ color: colors.primary }}>← Back</Text>
          </Pressable>
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <View style={styles.groupIcon}>
              <Text style={{ fontSize: 44 }}>👥</Text>
            </View>
            <Text style={styles.groupName}>{chat.groupName}</Text>
            <Text style={styles.groupSub}>{members.length} members</Text>
          </View>
        </View>

        <View style={{ padding: spacing.lg }}>
          <Card>
            <Row label="Mute notifications" right={<Toggle value={muted} onChange={setMuted} />} />
            <Row label="Media, links, files" value="24 items" onPress={() => Alert.alert('Gallery would open')} />
            <Row label="Group settings" onPress={() => Alert.alert('Admin settings: who can add members, message, etc.')} />
          </Card>

          <Text style={styles.sectionTitle}>MEMBERS</Text>
          <Card>
            {members.map((id, i) => {
              const u = userById(id);
              const isAdmin = i === 1;
              return (
                <Pressable key={id} onPress={() => onMember(id)} style={[styles.memberRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.borderLight }]}>
                  <Avatar emoji={u.avatarEmoji} size={40} tier={u.tier} verified={u.verified} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.memberName}>{u.name}</Text>
                    <Text style={styles.memberSub}>@{u.handle}</Text>
                  </View>
                  {isAdmin && <View style={styles.adminBadge}><Text style={styles.adminText}>ADMIN</Text></View>}
                </Pressable>
              );
            })}
          </Card>
          <PrimaryButton title="Add member" variant="ghost" onPress={() => Alert.alert('Add member', 'Search modal would open here.')} style={{ marginTop: 12 }} />
          <PrimaryButton title="Leave group" variant="danger" onPress={leave} style={{ marginTop: 12 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  groupIcon: { width: 96, height: 96, borderRadius: 24, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  groupName: { ...typography.h2 },
  groupSub: { color: colors.textMuted, marginTop: 4 },
  sectionTitle: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 16, marginBottom: 8 },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  memberName: { color: colors.text, fontWeight: '600' },
  memberSub: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  adminBadge: { backgroundColor: colors.primarySoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  adminText: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
});
