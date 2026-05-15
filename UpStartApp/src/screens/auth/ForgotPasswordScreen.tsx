import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { requestPasswordReset } from '../../services/back4app';
import { colors, radii, typography } from '../../theme/colors';
import { PrimaryButton } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
    } catch {/* swallow for security */}
    setLoading(false);
    // Same message regardless to prevent account enumeration
    Alert.alert(
      'Check your email',
      `If ${email.trim()} is registered, a reset link has been sent. The link expires in 15 minutes.`,
      [{ text: 'Back to sign in', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.bg}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={{ color: colors.primary, fontSize: 14 }}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Reset password</Text>
      <Text style={styles.subtitle}>
        Enter the email tied to your account. We'll send a secure reset link.
      </Text>
      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="you@startup.co"
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <PrimaryButton title="Send reset link" onPress={submit} loading={loading} style={{ marginTop: 24 }} />
      <View style={styles.help}>
        <Text style={styles.helpText}>Trouble? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SecurityQuestions')}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Try security questions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg, padding: 28, paddingTop: 60 },
  back: { marginBottom: 18 },
  title: { ...typography.h1, marginBottom: 4 },
  subtitle: { ...typography.bodyMuted, marginBottom: 28 },
  label: { ...typography.tiny, marginBottom: 6 },
  input: {
    backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 14,
    color: colors.text, borderWidth: 1, borderColor: colors.border, fontSize: 15,
  },
  help: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  helpText: { color: colors.textMuted, fontSize: 14 },
});
