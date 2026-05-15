import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Avatar } from '../../components/UI';
import { MOCK_BLOGS, userById } from '../../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogPost'>;

export default function BlogPostScreen({ route, navigation }: Props) {
  const blog = MOCK_BLOGS.find((b) => b.id === route.params.id);
  const [liked, setLiked] = useState(false);

  if (!blog) return null;
  const author = userById(blog.authorId);

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.primary, fontSize: 14 }}>← Back</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          <Text style={styles.title}>{blog.title}</Text>
          <View style={styles.byline}>
            <Avatar emoji={author.avatarEmoji} size={36} verified={author.verified} tier={author.tier} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.authorName}>{author.name}</Text>
              <Text style={styles.meta}>{blog.createdAt} · {blog.readTime} min read</Text>
            </View>
          </View>

          {/* AI Summary block */}
          <View style={styles.summary}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>🤖 AI SUMMARY</Text>
              <Pressable onPress={() => Alert.alert('Outdated?', 'The post was updated. Regenerate summary?', [
                { text: 'Cancel' },
                { text: 'Regenerate', onPress: () => Alert.alert('Regenerated') },
              ])}>
                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700' }}>EDIT</Text>
              </Pressable>
            </View>
            <Text style={styles.summaryText}>{blog.summary}</Text>
            <Pressable onPress={() => {}}>
              <Text style={styles.readFull}>Read full post ↓</Text>
            </Pressable>
          </View>

          <Text style={styles.body}>{blog.body}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.footerBtn} onPress={() => setLiked((v) => !v)}>
          <Text style={{ fontSize: 18 }}>{liked ? '❤️' : '🤍'}</Text>
          <Text style={styles.footerText}>{blog.likes + (liked ? 1 : 0)}</Text>
        </Pressable>
        <Pressable style={styles.footerBtn} onPress={() => Alert.alert('Comments would open')}>
          <Text style={{ fontSize: 18 }}>💬</Text>
          <Text style={styles.footerText}>Comment</Text>
        </Pressable>
        <Pressable style={styles.footerBtn} onPress={() => Alert.alert('Share', 'Repost, DM, copy link.')}>
          <Text style={{ fontSize: 18 }}>↗</Text>
          <Text style={styles.footerText}>Share</Text>
        </Pressable>
        <Pressable style={[styles.footerBtn, { backgroundColor: colors.primary, borderRadius: radii.pill, paddingHorizontal: 14 }]} onPress={() => Alert.alert('Following', 'Now following ' + author.name)}>
          <Text style={{ color: colors.white, fontWeight: '800' }}>+ Follow</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  title: { ...typography.h1, fontSize: 30, lineHeight: 36, marginBottom: 16 },
  byline: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  authorName: { color: colors.text, fontWeight: '700', fontSize: 14 },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  summary: { backgroundColor: colors.primarySoft, padding: 16, borderRadius: radii.md, borderLeftWidth: 4, borderLeftColor: colors.primary, marginBottom: 24 },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
  summaryText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  readFull: { color: colors.primary, fontSize: 12, fontWeight: '700', marginTop: 10 },
  body: { color: colors.text, fontSize: 16, lineHeight: 26 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 12, gap: 16, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' },
  footerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  footerText: { color: colors.text, fontSize: 13, fontWeight: '600' },
});
