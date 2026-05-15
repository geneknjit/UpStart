import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, typography } from '../../theme/colors';
import { PrimaryButton } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'TwoFactor'>;

export default function TwoFactorScreen({ navigation }: Props) {
  const [code, setCode] = useState('');
  const [useBackup, setUseBackup] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => (s <= 1 ? 30 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const verify = () => {
    const expected = useBackup ? 10 : 6;
    if (code.length !== expected) {
      Alert.alert('Invalid code', `Please enter your ${expected}-digit code.`);
      return;
    }
    // UI demo — any code accepted
    navigation.replace('Main');
  };

  return (
    <View style={styles.bg}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={{ color: colors.primary }}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.iconWrap}>
        <Text style={styles.iconText}>🔐</Text>
      </View>
      <Text style={styles.title}>Two-factor verification</Text>
      <Text style={styles.subtitle}>
        {useBackup
          ? 'Enter one of your 10 backup codes.'
          : `Enter the 6-digit code from your authenticator app. ${secondsLeft}s remaining.`}
      </Text>
      <Text style={styles.label}>{useBackup ? 'BACKUP CODE' : 'CODE'}</Text>
      <TextInput
        value={code}
        onChangeText={(v) => setCode(v.replace(/[^A-Za-z0-9]/g, '').slice(0, useBackup ? 10 : 6))}
        style={[styles.input, styles.codeInput, { letterSpacing: useBackup ? 4 : 10 }]}
        autoCapitalize="characters"
        placeholder={useBackup ? 'XXXX-XXXXXX' : '• • • • • •'}
        placeholderTextColor={colors.textFaint}
      />
      <PrimaryButton title="Verify" onPress={verify} style={{ marginTop: 24 }} />
      <TouchableOpacity style={{ alignItems: 'center', marginTop: 16 }} onPress={() => { setCode(''); setUseBackup((v) => !v); }}>
        <Text style={{ color: colors.primary, fontSize: 14 }}>
          {useBackup ? 'Use authenticator code instead' : 'Use a backup code'}
        </Text>
      </TouchableOpacity>
      {!useBackup && (
        <TouchableOpacity style={{ alignItems: 'center', marginTop: 10 }} onPress={() => Alert.alert('Code resent', 'New code sent via SMS.')}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Resend code via SMS</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg, padding: 28, paddingTop: 60 },
  back: { marginBottom: 18 },
  iconWrap: { alignSelf: 'center', width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  iconText: { fontSize: 32 },
  title: { ...typography.h1, textAlign: 'center', marginBottom: 4 },
  subtitle: { ...typography.bodyMuted, textAlign: 'center', marginBottom: 28 },
  label: { ...typography.tiny, marginBottom: 6 },
  input: { backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 14, color: colors.text, borderWidth: 1, borderColor: colors.border, fontSize: 15 },
  codeInput: { textAlign: 'center', fontSize: 22, fontWeight: '700' },
});
