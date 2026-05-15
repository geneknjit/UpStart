import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Avatar } from '../../components/UI';
import { MOCK_CHATS, userById, ChatThread } from '../../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

interface Msg { id: string; senderId: string; text: string; ts: string; edited?: boolean; deleted?: boolean }

export default function ChatScreen({ route, navigation }: Props) {
  const initial = useMemo(() => MOCK_CHATS.find((c) => c.id === route.params.id), [route.params.id]);
  const [messages, setMessages] = useState<Msg[]>(initial?.messages ?? []);
  const [input, setInput] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  if (!initial) return null;

  const others = initial.participantIds.filter((p) => p !== 'u_self').map(userById);
  const lead = others[0];
  const headerTitle = initial.isGroup ? initial.groupName : lead.name;

  const send = () => {
    if (!input.trim()) return;
    if (editing) {
      setMessages((m) => m.map((x) => x.id === editing ? { ...x, text: input.trim(), edited: true } : x));
      setEditing(null);
    } else {
      setMessages((m) => [...m, { id: `me${Date.now()}`, senderId: 'u_self', text: input.trim(), ts: 'now' }]);
    }
    setInput('');
  };

  const longPress = (m: Msg) => {
    if (m.deleted) return;
    if (m.senderId === 'u_self') {
      Alert.alert('Message', undefined, [
        { text: 'Edit', onPress: () => { setEditing(m.id); setInput(m.text); } },
        { text: 'Delete for me', onPress: () => setMessages((ms) => ms.filter((x) => x.id !== m.id)) },
        { text: 'Delete for everyone', style: 'destructive', onPress: () => setMessages((ms) => ms.map((x) => x.id === m.id ? { ...x, deleted: true, text: '' } : x)) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      Alert.alert('Message', undefined, [
        { text: 'Copy', onPress: () => Alert.alert('Copied') },
        { text: 'Report', style: 'destructive', onPress: () => Alert.alert('Reported', 'Thanks — our team will review.') },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  return (
    <View style={styles.bg}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={{ color: colors.primary, fontSize: 16 }}>‹</Text>
        </Pressable>
        <Pressable
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
          onPress={() => initial.isGroup && navigation.navigate('GroupInfo', { id: initial.id })}
        >
          <Avatar emoji={initial.isGroup ? '👥' : lead.avatarEmoji} size={36} tier={lead.tier} verified={lead.verified} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.headerTitle}>{headerTitle}</Text>
            <Text style={styles.headerSub}>
              {initial.isGroup ? `${initial.participantIds.length} members` : (lead.verified ? 'Verified' : '@' + lead.handle)}
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => Alert.alert('More', undefined, [
          { text: 'Mute', onPress: () => Alert.alert('Muted') },
          { text: 'Block', style: 'destructive', onPress: () => Alert.alert('Blocked') },
          { text: 'Cancel', style: 'cancel' },
        ])}>
          <Text style={{ color: colors.textMuted, fontSize: 22, fontWeight: '800' }}>⋯</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 20 }}
          renderItem={({ item }) => {
            const mine = item.senderId === 'u_self';
            const sender = userById(item.senderId);
            return (
              <Pressable onLongPress={() => longPress(item)} style={[styles.msgRow, mine && { justifyContent: 'flex-end' }]}>
                {!mine && <Avatar emoji={sender.avatarEmoji} size={26} tier={sender.tier} />}
                <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther, item.deleted && { backgroundColor: colors.bgInput }]}>
                  {item.deleted ? (
                    <Text style={{ color: colors.textFaint, fontStyle: 'italic', fontSize: 13 }}>This message was deleted</Text>
                  ) : (
                    <>
                      {!mine && initial.isGroup && <Text style={styles.bubbleSender}>{sender.name}</Text>}
                      <Text style={[styles.bubbleText, mine && { color: colors.white }]}>{item.text}</Text>
                      <Text style={[styles.bubbleTs, mine && { color: 'rgba(255,255,255,0.7)' }]}>
                        {item.ts}{item.edited ? ' · edited' : ''}{mine ? ' ✓✓' : ''}
                      </Text>
                    </>
                  )}
                </View>
              </Pressable>
            );
          }}
        />

        {editing && (
          <View style={styles.editingBanner}>
            <Text style={{ color: colors.warning, fontSize: 12, flex: 1 }}>Editing message…</Text>
            <Pressable onPress={() => { setEditing(null); setInput(''); }}>
              <Text style={{ color: colors.warning, fontWeight: '700' }}>Cancel</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.inputBar}>
          <Pressable style={styles.attachBtn} onPress={() => Alert.alert('Attach', 'File picker would open here (UI only).')}>
            <Text style={{ fontSize: 22 }}>📎</Text>
          </Pressable>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message..."
            placeholderTextColor={colors.textFaint}
            multiline
          />
          <Pressable style={styles.sendBtn} onPress={send}>
            <Text style={{ color: colors.white, fontSize: 18, fontWeight: '800' }}>↑</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  headerTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  headerSub: { color: colors.textMuted, fontSize: 12 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8, gap: 6 },
  bubble: { maxWidth: '78%', padding: 10, borderRadius: 14 },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: colors.bgElevated, borderBottomLeftRadius: 4 },
  bubbleSender: { color: colors.primary, fontSize: 11, fontWeight: '700', marginBottom: 2 },
  bubbleText: { color: colors.text, fontSize: 14, lineHeight: 19 },
  bubbleTs: { color: colors.textFaint, fontSize: 10, marginTop: 4 },
  editingBanner: { flexDirection: 'row', padding: 10, backgroundColor: colors.bgElevated, alignItems: 'center', gap: 10, borderTopWidth: 1, borderTopColor: colors.border },
  inputBar: { flexDirection: 'row', padding: 10, gap: 8, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'flex-end' },
  attachBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, color: colors.text, backgroundColor: colors.bgElevated, borderRadius: radii.lg, paddingHorizontal: 14, paddingVertical: 10, maxHeight: 100, borderWidth: 1, borderColor: colors.border },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
