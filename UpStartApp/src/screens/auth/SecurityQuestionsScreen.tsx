import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, typography } from '../../theme/colors';
import { PrimaryButton } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'SecurityQuestions'>;

const QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What was your mother's maiden name?",
  "What was the name of your elementary school?",
  "What was your first car?",
];

export default function SecurityQuestionsScreen({ navigation }: Props) {
  const [q1, setQ1] = useState(QUESTIONS[0]);
  const [a1, setA1] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const submit = () => {
    if (a1.trim().length < 3) {
      Alert.alert('Answer too short', 'Please enter a longer answer.');
      return;
    }
    const n = attempts + 1;
    setAttempts(n);
    if (n >= 3) {
      Alert.alert('Locked', 'Too many incorrect answers. Try again in 1 hour or use email recovery.');
      navigation.goBack();
      return;
    }
    Alert.alert('Verified', 'Identity verified. Proceed to set a new password.', [
      { text: 'OK', onPress: () => navigation.replace('Login') },
    ]);
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ padding: 28, paddingTop: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 18 }}>
          <Text style={{ color: colors.primary }}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Security questions</Text>
        <Text style={styles.subtitle}>Answer to verify your identity. Answers are case-insensitive.</Text>

        <Text style={styles.label}>QUESTION</Text>
        <Pressable style={styles.dropdown} onPress={() => setShowPicker((v) => !v)}>
          <Text style={{ color: colors.text, flex: 1 }}>{q1}</Text>
          <Text style={{ color: colors.textFaint, fontSize: 18 }}>▾</Text>
        </Pressable>
        {showPicker && (
          <View style={styles.picker}>
            {QUESTIONS.map((q) => (
              <Pressable
                key={q}
                style={styles.pickerItem}
                onPress={() => { setQ1(q); setShowPicker(false); }}
              >
                <Text style={{ color: q === q1 ? colors.primary : colors.text }}>{q}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={[styles.label, { marginTop: 16 }]}>YOUR ANSWER</Text>
        <TextInput
          style={styles.input}
          value={a1}
          onChangeText={setA1}
          placeholder="Type your answer"
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
        />

        <PrimaryButton title="Submit" onPress={submit} style={{ marginTop: 24 }} />

        <TouchableOpacity style={{ alignItems: 'center', marginTop: 16 }} onPress={() => navigation.replace('ForgotPassword')}>
          <Text style={{ color: colors.primary, fontSize: 14 }}>Try another recovery method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h1, marginBottom: 4 },
  subtitle: { ...typography.bodyMuted, marginBottom: 24 },
  label: { ...typography.tiny, marginBottom: 6 },
  dropdown: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgInput, borderRadius: radii.md,
    padding: 14, borderWidth: 1, borderColor: colors.border,
  },
  picker: {
    marginTop: 6, backgroundColor: colors.bgElevated, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  pickerItem: {
    padding: 14, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  input: {
    backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 14,
    color: colors.text, borderWidth: 1, borderColor: colors.border, fontSize: 15,
  },
});
