import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { PrimaryButton, Card } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateLiveShow'>;
type Visibility = 'public' | 'followers' | 'private';
type DealType = 'Equity' | 'SAFE' | 'Convertible';

export default function CreateLiveShowScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [dealType, setDealType] = useState<DealType>('SAFE');
  const [minInvest, setMinInvest] = useState('100');
  const [target, setTarget] = useState('25000');
  const [valuation, setValuation] = useState('10000000');
  const [equityPct, setEquityPct] = useState('5');

  const submit = () => {
    if (!title.trim()) return Alert.alert('Title required');
    if (!description.trim()) return Alert.alert('Description helps viewers decide to join. Add one?', undefined, [
      { text: 'Skip and go', onPress: confirm },
      { text: 'Go back', style: 'cancel' },
    ]);
    confirm();
  };

  const confirm = () => {
    Alert.alert('Show scheduled', 'Your live show is on the discovery feed as Upcoming.', [
      { text: 'Done', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 50, paddingBottom: 60 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
          <Text style={{ color: colors.primary }}>← Cancel</Text>
        </Pressable>
        <Text style={styles.title}>Create live show</Text>
        <Text style={styles.subtitle}>Set up your demo / AMA / pitch.</Text>

        <Card style={{ marginTop: 18 }}>
          <Text style={styles.label}>TITLE</Text>
          <View>
            <TextInput
              value={title}
              onChangeText={(v) => setTitle(v.slice(0, 80))}
              placeholder="e.g. Live demo of our new runtime"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
            />
            <Text style={[styles.counter, title.length === 80 && { color: colors.danger }]}>{title.length}/80</Text>
          </View>
          <Text style={[styles.label, { marginTop: 14 }]}>DESCRIPTION</Text>
          <TextInput
            value={description}
            onChangeText={(v) => setDescription(v.slice(0, 280))}
            multiline
            numberOfLines={3}
            placeholder="What viewers will see. Mention any Q&A or incentives."
            placeholderTextColor={colors.textFaint}
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          />
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={styles.label}>WHEN</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textFaint} style={[styles.input, { flex: 1 }]} />
            <TextInput value={time} onChangeText={setTime} placeholder="HH:MM" placeholderTextColor={colors.textFaint} style={[styles.input, { width: 100 }]} />
          </View>
          <Text style={[styles.helper, { marginTop: 6 }]}>Times are local. Future dates only.</Text>
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={styles.label}>VISIBILITY</Text>
          <View style={styles.segRow}>
            {(['public', 'followers', 'private'] as Visibility[]).map((v) => (
              <Pressable key={v} onPress={() => setVisibility(v)} style={[styles.seg, visibility === v && styles.segActive]}>
                <Text style={[styles.segText, visibility === v && styles.segTextActive]}>{v.charAt(0).toUpperCase() + v.slice(1)}</Text>
              </Pressable>
            ))}
          </View>
          {visibility === 'private' && (
            <Text style={[styles.helper, { marginTop: 8 }]}>You'll receive an invite link to share after creating.</Text>
          )}
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={styles.label}>INVESTMENT TERMS</Text>
          <Text style={styles.helper}>Investors can put money in during the live show. Funds held in escrow.</Text>
          <Text style={[styles.miniLabel, { marginTop: 12 }]}>Deal type</Text>
          <View style={styles.segRow}>
            {(['Equity', 'SAFE', 'Convertible'] as DealType[]).map((v) => (
              <Pressable key={v} onPress={() => setDealType(v)} style={[styles.seg, dealType === v && styles.segActive]}>
                <Text style={[styles.segText, dealType === v && styles.segTextActive]}>{v}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.miniLabel}>Min investment ($)</Text>
              <TextInput value={minInvest} onChangeText={setMinInvest} keyboardType="numeric" style={styles.input} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.miniLabel}>Round target ($)</Text>
              <TextInput value={target} onChangeText={setTarget} keyboardType="numeric" style={styles.input} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.miniLabel}>Valuation ($)</Text>
              <TextInput value={valuation} onChangeText={setValuation} keyboardType="numeric" style={styles.input} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.miniLabel}>% ownership offered</Text>
              <TextInput value={equityPct} onChangeText={setEquityPct} keyboardType="numeric" style={styles.input} />
            </View>
          </View>
          <View style={styles.capTable}>
            <Text style={styles.capTableLabel}>CAP TABLE PREVIEW</Text>
            <View style={styles.capRow}><Text style={styles.capLabel}>Founders</Text><Text style={styles.capValue}>{100 - parseFloat(equityPct || '0')}%</Text></View>
            <View style={styles.capRow}><Text style={styles.capLabel}>This round</Text><Text style={[styles.capValue, { color: colors.accent }]}>{equityPct}%</Text></View>
          </View>
        </Card>

        <PrimaryButton title="Save & schedule" onPress={submit} style={{ marginTop: 22 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodyMuted, marginTop: 4 },
  label: { ...typography.tiny, marginBottom: 6, color: colors.textFaint },
  miniLabel: { ...typography.tiny, marginBottom: 6, color: colors.textFaint, textTransform: 'none' as any, fontSize: 11 },
  helper: { color: colors.textFaint, fontSize: 12, marginTop: 4 },
  input: {
    backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 14,
    color: colors.text, borderWidth: 1, borderColor: colors.border, fontSize: 14,
  },
  counter: { position: 'absolute', right: 10, bottom: 8, color: colors.textFaint, fontSize: 11 },
  segRow: { flexDirection: 'row', backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 3, borderWidth: 1, borderColor: colors.border },
  seg: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radii.sm },
  segActive: { backgroundColor: colors.primary },
  segText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  segTextActive: { color: colors.white },
  capTable: { marginTop: 14, backgroundColor: colors.bgInput, padding: 12, borderRadius: radii.md },
  capTableLabel: { color: colors.textFaint, fontSize: 10, letterSpacing: 0.8, fontWeight: '800', marginBottom: 8 },
  capRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  capLabel: { color: colors.text, fontSize: 13 },
  capValue: { color: colors.text, fontWeight: '700', fontSize: 13 },
});
