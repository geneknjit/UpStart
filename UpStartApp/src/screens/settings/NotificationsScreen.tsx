import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { Card, Row, Toggle } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const LABELS: Record<string, string> = {
  followers: 'New followers',
  likes: 'Likes on your posts',
  comments: 'Comments & replies',
  messages: 'Direct messages',
  mentions: 'Mentions & tags',
  liveShows: 'Live shows',
  investments: 'Investment activity',
  systemAlerts: 'System & security',
};

export default function NotificationsScreen({ navigation }: Props) {
  const { notifPrefs, setNotif } = useApp();
  const allOff = Object.values(notifPrefs).every((v) => !v);

  const toggle = (key: keyof typeof notifPrefs, val: boolean) => {
    if (!val && Object.values(notifPrefs).filter(Boolean).length === 1) {
      Alert.alert("You'll miss important updates", 'All notifications are off. Sure?', [
        { text: 'Cancel' },
        { text: 'Turn off all', style: 'destructive', onPress: () => setNotif(key, val) },
      ]);
      return;
    }
    setNotif(key, val);
  };

  return (
    <View style={styles.bg}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary }}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {allOff && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>⚠️ All notifications are off — you may miss important activity.</Text>
          </View>
        )}
        <Text style={styles.sectionLabel}>NOTIFICATION TYPES</Text>
        <Card style={{ paddingVertical: 0 }}>
          {(Object.keys(LABELS) as Array<keyof typeof notifPrefs>).map((k) => (
            <Row key={k} label={LABELS[k]} right={<Toggle value={notifPrefs[k]} onChange={(v) => toggle(k, v)} />} />
          ))}
        </Card>

        <Text style={styles.sectionLabel}>DELIVERY CHANNELS</Text>
        <Card style={{ paddingVertical: 0 }}>
          <Row label="Push notifications" right={<Toggle value={true} onChange={() => Alert.alert('Open device settings to change push permissions.')} />} />
          <Row label="Email" right={<Toggle value={true} onChange={() => {}} />} />
          <Row label="In-app" right={<Toggle value={true} onChange={() => {}} />} />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  banner: { backgroundColor: colors.warning + '22', borderColor: colors.warning, borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  bannerText: { color: colors.warning, fontSize: 13, fontWeight: '600' },
  sectionLabel: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 14, marginBottom: 8 },
});
