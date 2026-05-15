import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { Card, PrimaryButton, Badge } from '../../components/UI';
import { startupById } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CommissionRequest'>;

const TYPES = ['Product feature', 'Brand design', 'Technical advisory', 'Custom integration', 'Other'];

export default function CommissionRequestScreen({ route, navigation }: Props) {
  const startup = startupById(route.params.startupId);
  const { coins } = useApp();
  const [type, setType] = useState<string | null>(null);
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [details, setDetails] = useState('');
  const [refs, setRefs] = useState<string[]>([]);

  if (!startup) return null;

  const submit = () => {
    if (!type) return Alert.alert('Pick a project type.');
    if (!deadline.trim()) return Alert.alert('Add a deadline.');
    if (!budget || parseInt(budget, 10) < 100) return Alert.alert('Budget must be at least 100 coins.');
    if (details.trim().length < 20) return Alert.alert('Please describe your project (20+ chars).');
    if (parseInt(budget, 10) > coins) return Alert.alert('Not enough coins', 'Add coins to your wallet to fund this commission.');
    Alert.alert(
      'Submit commission request?',
      `${startup.name} will be notified. ${budget} coins will be moved to escrow on acceptance.`,
      [
        { text: 'Cancel' },
        { text: 'Send request', onPress: () => Alert.alert('Request sent', 'You\'ll get a notification when the team responds.', [{ text: 'OK', onPress: () => navigation.goBack() }]) },
      ]
    );
  };

  return (
    <View style={s.bg}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 50, paddingBottom: 60 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 18 }}>
          <Text style={{ color: colors.primary }}>← Back</Text>
        </Pressable>

        <Text style={s.title}>Request commission</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Text style={{ fontSize: 22, marginRight: 8 }}>{startup.logoEmoji}</Text>
          <Text style={{ color: colors.textMuted }}>To <Text style={{ color: colors.text, fontWeight: '700' }}>{startup.name}</Text></Text>
        </View>

        <Card style={{ marginTop: 18 }}>
          <Text style={s.label}>PROJECT TYPE</Text>
          <View style={s.types}>
            {TYPES.map((t) => (
              <Pressable
                key={t}
                style={[s.typeChip, type === t && s.typeChipActive]}
                onPress={() => setType(t)}
              >
                <Text style={[s.typeText, type === t && { color: colors.white }]}>{t}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[s.label, { marginTop: 14 }]}>DESIRED DEADLINE</Text>
          <TextInput value={deadline} onChangeText={setDeadline} placeholder="e.g. 2026-06-30 or 'within 2 weeks'" placeholderTextColor={colors.textFaint} style={s.input} />

          <Text style={[s.label, { marginTop: 14 }]}>BUDGET (COINS)</Text>
          <TextInput value={budget} onChangeText={(v) => setBudget(v.replace(/\D/g, ''))} keyboardType="number-pad" placeholder="500" placeholderTextColor={colors.textFaint} style={s.input} />
          <Text style={s.helper}>Your wallet: 🪙 {coins.toLocaleString()} · Funds held in escrow until delivery accepted.</Text>

          <Text style={[s.label, { marginTop: 14 }]}>PROJECT DETAILS</Text>
          <TextInput
            value={details}
            onChangeText={(v) => setDetails(v.slice(0, 1000))}
            multiline
            numberOfLines={5}
            placeholder="Describe scope, deliverables, success criteria..."
            placeholderTextColor={colors.textFaint}
            style={[s.input, { height: 120, textAlignVertical: 'top' }]}
          />
          <Text style={s.counter}>{details.length}/1000</Text>

          <Text style={[s.label, { marginTop: 14 }]}>REFERENCE FILES (OPTIONAL)</Text>
          <Pressable
            style={s.refBox}
            onPress={() => { setRefs((r) => [...r, `ref_${r.length + 1}.pdf`]); }}
          >
            <Text style={{ fontSize: 28 }}>📎</Text>
            <Text style={s.refText}>{refs.length === 0 ? 'Attach reference files' : `${refs.length} file${refs.length === 1 ? '' : 's'} attached`}</Text>
          </Pressable>
          {refs.length > 0 && (
            <View style={{ marginTop: 10 }}>
              {refs.map((r, i) => (
                <View key={i} style={s.refRow}>
                  <Text style={{ color: colors.text, flex: 1, fontSize: 13 }}>📄 {r}</Text>
                  <Pressable onPress={() => setRefs((rs) => rs.filter((_, idx) => idx !== i))}>
                    <Text style={{ color: colors.danger, fontSize: 18 }}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </Card>

        <Card style={{ marginTop: 14, backgroundColor: colors.bgInput }}>
          <Text style={s.escrowTitle}>🛡️ How escrow works</Text>
          <Text style={s.escrowBody}>
            On acceptance, funds move from your wallet to escrow. They're released once you approve the delivery. Disputes are reviewed by the platform.
          </Text>
        </Card>

        <PrimaryButton title="Submit request" onPress={submit} style={{ marginTop: 22 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h1 },
  label: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 6 },
  helper: { color: colors.textFaint, fontSize: 11, marginTop: 4 },
  counter: { color: colors.textFaint, fontSize: 11, textAlign: 'right', marginTop: 4 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.bgInput, borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  input: { color: colors.text, backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 12, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  refBox: { alignItems: 'center', padding: 18, backgroundColor: colors.bgInput, borderRadius: radii.md, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  refText: { color: colors.text, fontWeight: '600', marginTop: 6, fontSize: 13 },
  refRow: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: colors.bgInput, borderRadius: radii.sm, marginTop: 6 },
  escrowTitle: { color: colors.text, fontWeight: '700', marginBottom: 6 },
  escrowBody: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
});
