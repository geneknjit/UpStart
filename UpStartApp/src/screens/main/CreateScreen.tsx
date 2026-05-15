import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Card, PrimaryButton, Avatar } from '../../components/UI';
import { useApp } from '../../context/AppContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Audience = 'public' | 'followers' | 'close' | 'only-me';

export default function CreateScreen() {
  const navigation = useNavigation<Nav>();
  const { postVisibility } = useApp();
  const [text, setText] = useState('');
  const [audience, setAudience] = useState<Audience>(postVisibility);
  const [showAud, setShowAud] = useState(false);
  const [posting, setPosting] = useState(false);

  const post = () => {
    if (!text.trim()) return Alert.alert('Empty post', 'Write something first.');
    setPosting(true);
    setTimeout(() => {
      setPosting(false);
      Alert.alert('Posted', `Your post is live (${audienceLabel(audience)}).`);
      setText('');
    }, 600);
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 50, paddingBottom: 120 }}>
        <Text style={styles.title}>Create</Text>

        {/* Quick action grid */}
        <View style={styles.grid}>
          <ActionTile emoji="📝" title="Post" subtitle="Share an update" color={colors.primary} onPress={() => Alert.alert('Use the composer below to post.')} />
          <ActionTile emoji="📰" title="Blog" subtitle="Long-form, AI-summarized" color={colors.accent} onPress={() => navigation.navigate('BlogEditor')} />
          <ActionTile emoji="🎬" title="Mini Video" subtitle="Up to 60s vertical" color={colors.warning} onPress={() => navigation.navigate('MiniVideos')} />
          <ActionTile emoji="🎙️" title="Go Live" subtitle="Demo or AMA" color={colors.live} onPress={() => navigation.navigate('CreateLiveShow')} />
        </View>

        {/* Composer */}
        <Card style={{ marginTop: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Avatar emoji="🚀" size={36} />
            <Pressable onPress={() => setShowAud((v) => !v)} style={styles.audienceChip}>
              <Text style={styles.audienceText}>{audienceIcon(audience)} {audienceLabel(audience)}</Text>
              <Text style={{ color: colors.textFaint, marginLeft: 4 }}>▾</Text>
            </Pressable>
          </View>
          {showAud && (
            <View style={styles.audiencePanel}>
              {(['public', 'followers', 'close', 'only-me'] as Audience[]).map((a) => (
                <Pressable key={a} onPress={() => { setAudience(a); setShowAud(false); }} style={styles.audienceRow}>
                  <Text style={{ fontSize: 16, marginRight: 10 }}>{audienceIcon(a)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.audienceMain}>{audienceLabel(a)}</Text>
                    <Text style={styles.audienceSub}>{audienceDesc(a)}</Text>
                  </View>
                  {audience === a && <Text style={{ color: colors.primary, fontWeight: '800' }}>✓</Text>}
                </Pressable>
              ))}
            </View>
          )}
          <TextInput
            multiline
            value={text}
            onChangeText={(v) => setText(v.slice(0, 500))}
            placeholder="What are you building? What did you learn today?"
            placeholderTextColor={colors.textFaint}
            style={styles.composer}
          />
          <View style={styles.composerFoot}>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <Pressable onPress={() => Alert.alert('Attach photo (UI only)')}><Text style={styles.composerIcon}>📷</Text></Pressable>
              <Pressable onPress={() => Alert.alert('GIF picker (UI only)')}><Text style={styles.composerIcon}>🎞️</Text></Pressable>
              <Pressable onPress={() => Alert.alert('Poll (UI only)')}><Text style={styles.composerIcon}>📊</Text></Pressable>
              <Pressable onPress={() => Alert.alert('Tag startup (UI only)')}><Text style={styles.composerIcon}>🏷️</Text></Pressable>
            </View>
            <Text style={[styles.counter, text.length === 500 && { color: colors.danger }]}>{text.length}/500</Text>
          </View>
          <PrimaryButton title={posting ? 'Posting…' : 'Post'} onPress={post} loading={posting} style={{ marginTop: 14 }} />
        </Card>
      </ScrollView>
    </View>
  );
}

function audienceLabel(a: Audience) {
  return a === 'public' ? 'Public' : a === 'followers' ? 'Followers' : a === 'close' ? 'Close Friends' : 'Only me';
}
function audienceIcon(a: Audience) {
  return a === 'public' ? '🌐' : a === 'followers' ? '👥' : a === 'close' ? '⭐' : '🔒';
}
function audienceDesc(a: Audience) {
  return a === 'public' ? 'Anyone on UpStart can see' : a === 'followers' ? 'Only people who follow you' : a === 'close' ? 'Your Close Friends list' : 'Just you';
}

function ActionTile({ emoji, title, subtitle, color, onPress }: any) {
  return (
    <Pressable style={[styles.tile, { borderColor: color + '44' }]} onPress={onPress}>
      <View style={[styles.tileIcon, { backgroundColor: color + '22' }]}>
        <Text style={{ fontSize: 26 }}>{emoji}</Text>
      </View>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSub}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h1, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  tile: { width: '47%', backgroundColor: colors.bgElevated, padding: 16, borderRadius: radii.lg, borderWidth: 1 },
  tileIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileTitle: { color: colors.text, fontWeight: '700', fontSize: 15 },
  tileSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  audienceChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radii.pill, marginLeft: 12, borderWidth: 1, borderColor: colors.border },
  audienceText: { color: colors.text, fontWeight: '600', fontSize: 12 },
  audiencePanel: { backgroundColor: colors.bgInput, borderRadius: radii.md, marginBottom: 10, padding: 4 },
  audienceRow: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: radii.sm },
  audienceMain: { color: colors.text, fontWeight: '600' },
  audienceSub: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  composer: { color: colors.text, fontSize: 16, minHeight: 100, textAlignVertical: 'top' },
  composerFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.borderLight },
  composerIcon: { fontSize: 18 },
  counter: { color: colors.textFaint, fontSize: 12 },
});
