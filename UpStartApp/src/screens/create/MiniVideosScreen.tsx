import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Alert, FlatList } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing } from '../../theme/colors';
import { MOCK_VIDEOS, userById } from '../../data/mockData';
import { Avatar } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'MiniVideos'>;
const { height: H } = Dimensions.get('window');
const VIDEO_H = H - 80; // leave room for tab bar

export default function MiniVideosScreen({ navigation }: Props) {
  const [paused, setPaused] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [following, setFollowing] = useState<Record<string, boolean>>({});

  return (
    <View style={styles.bg}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.topBtn}>
          <Text style={{ color: colors.white, fontSize: 20 }}>‹</Text>
        </Pressable>
        <Text style={styles.topTitle}>For You</Text>
        <Pressable onPress={() => Alert.alert('Record', 'Camera would open. (UI only)')} style={styles.topBtn}>
          <Text style={{ color: colors.white, fontSize: 20, fontWeight: '800' }}>+</Text>
        </Pressable>
      </View>
      <FlatList
        data={MOCK_VIDEOS}
        keyExtractor={(v) => v.id}
        snapToInterval={VIDEO_H}
        snapToAlignment="start"
        decelerationRate="fast"
        pagingEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const author = userById(item.authorId);
          const isPaused = paused[item.id];
          const isLiked = liked[item.id];
          const isFollowing = following[item.id];
          return (
            <Pressable
              style={[styles.frame, { height: VIDEO_H, backgroundColor: 'rgba(0,0,0,0.85)' }]}
              onPress={() => setPaused((p) => ({ ...p, [item.id]: !p[item.id] }))}
            >
              <Text style={{ fontSize: 180 }}>{item.emoji}</Text>
              {isPaused && (
                <View style={styles.pauseOverlay}>
                  <Text style={{ fontSize: 64, color: colors.white }}>▶</Text>
                </View>
              )}

              {/* Right rail */}
              <View style={styles.rail}>
                <View style={{ alignItems: 'center' }}>
                  <Avatar emoji={author.avatarEmoji} size={48} verified={author.verified} tier={author.tier} />
                  {!isFollowing && (
                    <Pressable onPress={() => setFollowing((f) => ({ ...f, [item.id]: true }))} style={styles.followFab}>
                      <Text style={{ color: colors.white, fontWeight: '800' }}>+</Text>
                    </Pressable>
                  )}
                </View>
                <Pressable style={styles.railBtn} onPress={() => setLiked((l) => ({ ...l, [item.id]: !l[item.id] }))}>
                  <Text style={{ fontSize: 30 }}>{isLiked ? '❤️' : '🤍'}</Text>
                  <Text style={styles.railCount}>{item.likes + (isLiked ? 1 : 0)}</Text>
                </Pressable>
                <Pressable style={styles.railBtn} onPress={() => Alert.alert('Comments', 'Comment sheet would open.')}>
                  <Text style={{ fontSize: 30 }}>💬</Text>
                  <Text style={styles.railCount}>{item.comments}</Text>
                </Pressable>
                <Pressable style={styles.railBtn} onPress={() => Alert.alert('Share', 'Repost, DM, copy link, share externally.')}>
                  <Text style={{ fontSize: 30 }}>↗</Text>
                  <Text style={styles.railCount}>{item.shares}</Text>
                </Pressable>
                <Pressable style={styles.railBtn} onPress={() => Alert.alert('Report', 'Report reasons would appear.')}>
                  <Text style={{ fontSize: 30 }}>⚑</Text>
                </Pressable>
              </View>

              {/* Bottom info */}
              <View style={styles.bottom}>
                <Text style={styles.authorName}>@{author.handle}</Text>
                <Text style={styles.caption}>{item.caption}</Text>
                <View style={styles.musicRow}>
                  <Text style={{ color: colors.white, fontSize: 14 }}>🎵</Text>
                  <Text style={styles.musicText} numberOfLines={1}>{item.music}</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.black },
  topBar: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, zIndex: 10 },
  topBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: colors.white, fontWeight: '800', fontSize: 16 },
  frame: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  pauseOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  rail: { position: 'absolute', right: 12, bottom: 100, alignItems: 'center', gap: 22 },
  followFab: { position: 'absolute', bottom: -8, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.live, alignItems: 'center', justifyContent: 'center' },
  railBtn: { alignItems: 'center' },
  railCount: { color: colors.white, fontSize: 12, fontWeight: '700', marginTop: 2 },
  bottom: { position: 'absolute', left: 16, right: 80, bottom: 30 },
  authorName: { color: colors.white, fontWeight: '800', fontSize: 16, marginBottom: 4 },
  caption: { color: colors.white, fontSize: 14, lineHeight: 19 },
  musicRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 6 },
  musicText: { color: colors.white, fontSize: 12, flex: 1 },
});
