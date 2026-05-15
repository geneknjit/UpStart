import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, typography } from '../../theme/colors';
import { PrimaryButton } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingPersonal'>;

const QUESTIONS = [
  ['Q1', 'What was the name of your first pet?'],
  ['Q2', 'What city were you born in?'],
  ['Q3', 'What was the name of your elementary school?'],
];

export default function PersonalQuestionsScreen({ navigation }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const setAnswer = (k: string, v: string) => setAnswers((a) => ({ ...a, [k]: v }));

  const submit = () => {
    for (const [k] of QUESTIONS) {
      if ((answers[k] || '').trim().length < 3) {
        Alert.alert('Answer too short', 'Each answer must be at least 3 characters.');
        return;
      }
    }
    const values = Object.values(answers).map((a) => a.toLowerCase().trim());
    if (new Set(values).size < values.length) {
      Alert.alert('Use distinct answers', 'Please use a different answer for each question.');
      return;
    }
    navigation.replace('OnboardingID');
  };

  const skip = () => {
    Alert.alert(
      'Skip security questions?',
      'These questions help you recover your account. We strongly recommend completing this step.',
      [
        { text: 'Go back', style: 'cancel' },
        { text: 'Skip anyway', style: 'destructive', onPress: () => navigation.replace('OnboardingID') },
      ]
    );
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ padding: 28, paddingTop: 60, paddingBottom: 40 }}>
        <View style={styles.progressRow}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressLine} />
          <View style={styles.progressDot} />
          <View style={styles.progressLine} />
          <View style={styles.progressDot} />
        </View>
        <Text style={styles.step}>STEP 1 OF 3</Text>
        <Text style={styles.title}>Security questions</Text>
        <Text style={styles.subtitle}>
          Help us recover your account if you ever get locked out. Answers are securely hashed.
        </Text>

        {QUESTIONS.map(([k, q]) => (
          <View key={k} style={styles.qWrap}>
            <Text style={styles.qLabel}>{q}</Text>
            <TextInput
              style={styles.input}
              value={answers[k] || ''}
              onChangeText={(v) => setAnswer(k, v)}
              placeholder="Your answer"
              placeholderTextColor={colors.textFaint}
            />
          </View>
        ))}

        <PrimaryButton title="Continue" onPress={submit} style={{ marginTop: 24 }} />
        <Pressable style={{ alignItems: 'center', marginTop: 14 }} onPress={skip}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>Skip for now</Text>
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
  qWrap: { marginBottom: 16 },
  qLabel: { color: colors.text, fontSize: 14, marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 14,
    color: colors.text, borderWidth: 1, borderColor: colors.border, fontSize: 15,
  },
});
