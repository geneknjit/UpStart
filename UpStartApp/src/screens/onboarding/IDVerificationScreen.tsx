import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, typography } from '../../theme/colors';
import { PrimaryButton, Card } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingID'>;

export default function IDVerificationScreen({ navigation }: Props) {
  const [idType, setIdType] = useState<'passport' | 'license' | 'national' | null>(null);
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieTaken, setSelfieTaken] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    if (!idType || !idUploaded || !selfieTaken) {
      Alert.alert('Incomplete', 'Please select an ID type, upload it, and complete the selfie liveness check.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Verification submitted',
        'Most users are verified within a few minutes. We\'ll notify you when it\'s done.',
        [{ text: 'Continue', onPress: () => navigation.replace('Main') }]
      );
    }, 1200);
  };

  const skip = () => {
    Alert.alert(
      'Skip ID verification?',
      'Unverified accounts can still browse and post, but cannot invest above $100 per round.',
      [
        { text: 'Go back', style: 'cancel' },
        { text: 'Skip', style: 'destructive', onPress: () => navigation.replace('Main') },
      ]
    );
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ padding: 28, paddingTop: 60, paddingBottom: 60 }}>
        <View style={styles.progressRow}>
          <View style={[styles.progressDot, { backgroundColor: colors.primary, borderColor: colors.primary }]} />
          <View style={styles.progressLine} />
          <View style={[styles.progressDot, { backgroundColor: colors.primary, borderColor: colors.primary }]} />
          <View style={styles.progressLine} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
        </View>
        <Text style={styles.step}>STEP 2 OF 3 — VERIFY YOUR IDENTITY</Text>
        <Text style={styles.title}>Verify identity</Text>
        <Text style={styles.subtitle}>
          To invest or be paid, we need to confirm you're you. Takes about 2 minutes.
        </Text>

        <Card style={{ marginBottom: 18 }}>
          <Text style={styles.sectionTitle}>1. Choose ID type</Text>
          <View style={styles.idGrid}>
            {[
              { k: 'passport', label: 'Passport', emoji: '🛂' },
              { k: 'license', label: "Driver's license", emoji: '🪪' },
              { k: 'national', label: 'National ID', emoji: '🆔' },
            ].map((opt) => (
              <Pressable
                key={opt.k}
                style={[styles.idCard, idType === opt.k && styles.idCardActive]}
                onPress={() => setIdType(opt.k as any)}
              >
                <Text style={{ fontSize: 28 }}>{opt.emoji}</Text>
                <Text style={[styles.idLabel, idType === opt.k && { color: colors.primary }]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card style={{ marginBottom: 18 }}>
          <Text style={styles.sectionTitle}>2. Upload ID image</Text>
          <Pressable
            style={[styles.uploadBox, idUploaded && styles.uploadBoxDone]}
            onPress={() => setIdUploaded((v) => !v)}
          >
            <Text style={{ fontSize: 32 }}>{idUploaded ? '✅' : '📷'}</Text>
            <Text style={[styles.uploadText, idUploaded && { color: colors.accent }]}>
              {idUploaded ? 'ID image uploaded' : 'Tap to upload'}
            </Text>
            <Text style={styles.uploadHint}>Make sure all four corners are visible.</Text>
          </Pressable>
        </Card>

        <Card style={{ marginBottom: 18 }}>
          <Text style={styles.sectionTitle}>3. Selfie liveness check</Text>
          <Pressable
            style={[styles.uploadBox, selfieTaken && styles.uploadBoxDone]}
            onPress={() => setSelfieTaken((v) => !v)}
          >
            <Text style={{ fontSize: 32 }}>{selfieTaken ? '✅' : '🤳'}</Text>
            <Text style={[styles.uploadText, selfieTaken && { color: colors.accent }]}>
              {selfieTaken ? 'Liveness check complete' : 'Tap to start'}
            </Text>
            <Text style={styles.uploadHint}>You'll be asked to blink or turn your head.</Text>
          </Pressable>
        </Card>

        <PrimaryButton title="Submit for verification" onPress={submit} loading={submitting} style={{ marginTop: 8 }} />
        <Pressable style={{ alignItems: 'center', marginTop: 14 }} onPress={skip}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>Skip — I'll verify later</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border },
  progressDotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  progressLine: { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: 6 },
  step: { ...typography.tiny, marginBottom: 6, color: colors.primary, fontWeight: '700' },
  title: { ...typography.h1, marginBottom: 6 },
  subtitle: { ...typography.bodyMuted, marginBottom: 24 },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  idGrid: { flexDirection: 'row', gap: 10 },
  idCard: {
    flex: 1, alignItems: 'center', padding: 14,
    backgroundColor: colors.bgInput, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.border,
  },
  idCardActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  idLabel: { color: colors.text, fontSize: 12, marginTop: 6, textAlign: 'center', fontWeight: '600' },
  uploadBox: {
    alignItems: 'center', padding: 24, borderRadius: radii.md,
    borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed',
    backgroundColor: colors.bgInput,
  },
  uploadBoxDone: { borderColor: colors.accent, backgroundColor: colors.accentSoft, borderStyle: 'solid' },
  uploadText: { color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 8 },
  uploadHint: { color: colors.textFaint, fontSize: 12, marginTop: 4, textAlign: 'center' },
});
