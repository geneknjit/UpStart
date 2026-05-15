import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Badge, Avatar, PrimaryButton } from '../../components/UI';
import { MOCK_LIVE_SHOWS, startupById, userById } from '../../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'LiveShow'>;

interface ChatMsg { id: string; user: string; emoji: string; text: string; isYou?: boolean }

export default function LiveShowScreen({ route, navigation }: Props) {
  const show = MOCK_LIVE_SHOWS.find((s) => s.id === route.params.id);
  const startup = show ? startupById(show.startupId) : undefined;
  const host = show ? userById(show.hostId) : undefined;
  const [viewers, setViewers] = useState(show?.viewerCount ?? 0);
  const [raised, setRaised] = useState(show?.raised ?? 0);
  const [reactions, setReactions] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chats, setChats] = useState<ChatMsg[]>([
    { id: '1', user: 'Jordan Rivers', emoji: '🧑‍🚀', text: "Strong vision. Loving the runtime demo." },
    { id: '2', user: 'Sam Okafor', emoji: '👨‍🔬', text: "Question: how do you handle schema drift in real workloads?" },
    { id: '3', user: 'Priya Iyer', emoji: '👩‍🎨', text: "🔥🔥" },
  ]);

  // Simulate live activity
  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 3));
      if (Math.random() > 0.6) setReactions((r) => r + 1);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  if (!show || !startup || !host) {
    return <View style={styles.bg}><Text style={{ color: colors.text, padding: 40 }}>Show not found.</Text></View>;
  }

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChats((c) => [...c, { id: `me${Date.now()}`, user: 'You', emoji: '🚀', text: chatInput.trim(), isYou: true }]);
    setChatInput('');
  };

  const pct = Math.min(100, Math.round((raised / show.raiseTarget) * 100));

  return (
    <View style={styles.bg}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Video pane */}
        <View style={[styles.videoPane, { backgroundColor: startup.bgColor + '33' }]}>
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.white, fontSize: 22 }}>✕</Text>
          </Pressable>
          <Text style={{ fontSize: 84 }}>{startup.logoEmoji}</Text>
          <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>● LIVE</Text></View>
          <View style={styles.viewerBadge}><Text style={styles.viewerText}>👁 {viewers}</Text></View>
          <View style={styles.hostOverlay}>
            <Avatar emoji={host.avatarEmoji} size={28} verified={host.verified} tier={host.tier} />
            <Text style={{ color: colors.white, fontWeight: '700', marginLeft: 8 }}>{host.name}</Text>
          </View>
          <View style={styles.titleOverlay}>
            <Text style={styles.videoTitle} numberOfLines={2}>{show.title}</Text>
          </View>
        </View>

        {/* Funding ribbon */}
        <View style={styles.fundingBar}>
          <Text style={styles.fundingLabel}>Round target ${(show.raiseTarget / 1000).toFixed(0)}K</Text>
          <View style={styles.fundingProgressOuter}>
            <View style={[styles.fundingProgressInner, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.fundingRaised}>${(raised / 1000).toFixed(1)}K raised · {pct}%</Text>
        </View>

        {/* Chat */}
        <ScrollView style={styles.chatPane} contentContainerStyle={{ padding: spacing.lg }} showsVerticalScrollIndicator={false}>
          {chats.map((c) => (
            <View key={c.id} style={styles.chatRow}>
              <Text style={{ fontSize: 18, marginRight: 8 }}>{c.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.chatUser, c.isYou && { color: colors.accent }]}>{c.user}</Text>
                <Text style={styles.chatText}>{c.text}</Text>
              </View>
            </View>
          ))}
          <Text style={styles.reactionPing}>{reactions > 0 ? `❤️ +${reactions} reactions` : ''}</Text>
        </ScrollView>

        {/* Action bar */}
        <View style={styles.actionBar}>
          <Pressable style={styles.reactBtn} onPress={() => setReactions((r) => r + 1)}>
            <Text style={{ fontSize: 20 }}>❤️</Text>
          </Pressable>
          <View style={styles.chatInputWrap}>
            <TextInput
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={sendChat}
              placeholder="Send a message"
              placeholderTextColor={colors.textFaint}
              style={styles.chatInput}
            />
          </View>
          <Pressable
            style={styles.investBtn}
            onPress={() => navigation.navigate('Invest', { startupId: startup.id, liveId: show.id })}
          >
            <Text style={styles.investText}>💸 Invest</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  videoPane: { height: 280, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  back: { position: 'absolute', top: 50, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  liveBadge: { position: 'absolute', top: 50, left: 16, backgroundColor: colors.live, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  liveBadgeText: { color: colors.white, fontWeight: '800', fontSize: 11, letterSpacing: 1 },
  viewerBadge: { position: 'absolute', top: 50, left: 80, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  viewerText: { color: colors.white, fontWeight: '700', fontSize: 11 },
  hostOverlay: { position: 'absolute', bottom: 50, left: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.pill },
  titleOverlay: { position: 'absolute', bottom: 14, left: 16, right: 16 },
  videoTitle: { color: colors.white, fontWeight: '700', fontSize: 15 },
  fundingBar: { backgroundColor: colors.bgElevated, paddingHorizontal: spacing.lg, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  fundingLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  fundingProgressOuter: { height: 6, backgroundColor: colors.bgInput, borderRadius: 3, overflow: 'hidden', marginVertical: 6 },
  fundingProgressInner: { height: '100%', backgroundColor: colors.accent },
  fundingRaised: { color: colors.accent, fontWeight: '700', fontSize: 12 },
  chatPane: { flex: 1 },
  chatRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  chatUser: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 2 },
  chatText: { color: colors.text, fontSize: 14, lineHeight: 18 },
  reactionPing: { color: colors.live, textAlign: 'center', fontSize: 12, fontWeight: '700', marginTop: 6 },
  actionBar: { flexDirection: 'row', padding: 10, gap: 8, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg, alignItems: 'center' },
  reactBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  chatInputWrap: { flex: 1, backgroundColor: colors.bgElevated, borderRadius: radii.pill, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border },
  chatInput: { color: colors.text, paddingVertical: 10, fontSize: 14 },
  investBtn: { backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 12, borderRadius: radii.pill },
  investText: { color: colors.textInverse, fontWeight: '800', fontSize: 14 },
});
