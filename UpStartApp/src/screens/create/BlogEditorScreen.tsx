import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Card, PrimaryButton, Toggle } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogEditor'>;

export default function BlogEditorScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState(true);
  const [summary, setSummary] = useState('');
  const [generating, setGenerating] = useState(false);

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));
  const longEnough = wordCount >= 50;

  const generateSummary = () => {
    if (!body.trim()) {
      Alert.alert('Write something first.');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setSummary(
        'AI-generated: ' + body.trim().slice(0, 180).replace(/\s+\S*$/, '') + '...'
      );
      setGenerating(false);
    }, 900);
  };

  const publish = () => {
    if (!title.trim()) return Alert.alert('Title required');
    if (wordCount < 20) return Alert.alert('Too short', 'Blog posts must be at least 20 words.');
    Alert.alert('Published', 'Your blog post is live.', [
      { text: 'Done', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.bg}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>New blog post</Text>
        <Pressable onPress={publish}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Publish</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
        <TextInput
          value={title}
          onChangeText={(v) => setTitle(v.slice(0, 100))}
          placeholder="Your title"
          placeholderTextColor={colors.textFaint}
          style={styles.titleInput}
          multiline
        />
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{wordCount} words · ~{readTime} min read</Text>
          {longEnough && <Text style={[styles.metaText, { color: colors.accent }]}>✓ Long enough for AI summary</Text>}
        </View>

        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Start writing..."
          placeholderTextColor={colors.textFaint}
          multiline
          style={styles.bodyInput}
          textAlignVertical="top"
        />

        <Card style={{ marginTop: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🤖</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>AI Summary</Text>
              <Text style={styles.aiSub}>2-4 sentence summary at the top of your post.</Text>
            </View>
            <Toggle value={aiSummaryEnabled} onChange={setAiSummaryEnabled} />
          </View>
          {aiSummaryEnabled && (
            <>
              {summary ? (
                <View style={styles.summaryBlock}>
                  <Text style={styles.summaryLabel}>PREVIEW</Text>
                  <Text style={styles.summaryText}>{summary}</Text>
                </View>
              ) : (
                <View style={[styles.summaryBlock, { alignItems: 'center' }]}>
                  <Text style={styles.summaryEmpty}>Generate a summary after writing your post.</Text>
                </View>
              )}
              <PrimaryButton
                title={summary ? 'Regenerate' : 'Generate summary'}
                variant="ghost"
                onPress={generateSummary}
                loading={generating}
                disabled={!longEnough}
                style={{ marginTop: 12 }}
              />
              {summary && (
                <PrimaryButton
                  title="Edit summary manually"
                  variant="ghost"
                  onPress={() => Alert.alert('Edit summary', 'Editing UI would open here.')}
                  style={{ marginTop: 8 }}
                />
              )}
            </>
          )}
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={styles.aiTitle}>Cover image</Text>
          <Text style={styles.aiSub}>Optional. Recommended 16:9.</Text>
          <Pressable
            style={styles.coverBtn}
            onPress={() => Alert.alert('Image upload', 'File picker would open. (UI only)')}
          >
            <Text style={{ fontSize: 30 }}>🖼️</Text>
            <Text style={styles.coverText}>Add cover image</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { color: colors.text, fontWeight: '700', fontSize: 15 },
  titleInput: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  metaText: { color: colors.textMuted, fontSize: 12 },
  bodyInput: { color: colors.text, fontSize: 16, lineHeight: 24, minHeight: 200 },
  aiTitle: { color: colors.text, fontWeight: '700', fontSize: 15 },
  aiSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  summaryBlock: { marginTop: 12, padding: 14, backgroundColor: colors.primarySoft, borderRadius: radii.md, borderLeftWidth: 3, borderLeftColor: colors.primary },
  summaryLabel: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginBottom: 6 },
  summaryText: { color: colors.text, fontSize: 13, lineHeight: 19 },
  summaryEmpty: { color: colors.textMuted, fontSize: 13, padding: 14 },
  coverBtn: { marginTop: 10, alignItems: 'center', padding: 24, backgroundColor: colors.bgInput, borderRadius: radii.md, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  coverText: { color: colors.text, fontWeight: '600', marginTop: 8 },
});
