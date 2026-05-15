import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { useAuth } from '../../context/AuthContext';
import { colors, radii, typography } from '../../theme/colors';
import { PrimaryButton } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneLogin'>;

const COUNTRIES = [
  { code: '+1', label: 'United States' },
  { code: '+44', label: 'United Kingdom' },
  { code: '+91', label: 'India' },
  { code: '+81', label: 'Japan' },
  { code: '+49', label: 'Germany' },
  { code: '+55', label: 'Brazil' },
];

export default function PhoneLoginScreen({ navigation }: Props) {
  const { setSession } = useAuth();
  const [stage, setStage] = useState<'phone' | 'otp'>('phone');
  const [country, setCountry] = useState('+1');
  const [showCountries, setShowCountries] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (stage !== 'otp') return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [stage]);

  const sendCode = () => {
    if (phone.replace(/\D/g, '').length < 7) {
      Alert.alert('Invalid phone', 'Please enter a valid phone number.');
      return;
    }
    setStage('otp');
    setSecondsLeft(120);
    Alert.alert('Code sent', `A 6-digit verification code was sent to ${country} ${phone}. (UI-only — no SMS actually sent.)`);
  };

  const verifyCode = async () => {
    if (otp.length !== 6) {
      Alert.alert('Enter all 6 digits');
      return;
    }
    // Any 6-digit code accepted in UI demo
    await setSession('demo-phone-token', 'demo-phone-id', `Phone ${phone.slice(-4)}`, '');
    navigation.replace('Main');
  };

  const resend = () => {
    setOtp('');
    setSecondsLeft(120);
    setAttempts(0);
    Alert.alert('New code sent', 'Previous code invalidated.');
  };

  return (
    <View style={styles.bg}>
      <TouchableOpacity onPress={() => stage === 'otp' ? setStage('phone') : navigation.goBack()} style={styles.back}>
        <Text style={{ color: colors.primary, fontSize: 14 }}>← Back</Text>
      </TouchableOpacity>

      {stage === 'phone' ? (
        <>
          <Text style={styles.title}>Sign in with phone</Text>
          <Text style={styles.subtitle}>We'll text you a 6-digit code. No password needed.</Text>
          <Text style={styles.label}>PHONE NUMBER</Text>
          <View style={styles.phoneRow}>
            <Pressable style={styles.countryBtn} onPress={() => setShowCountries((v) => !v)}>
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>{country}</Text>
              <Text style={{ color: colors.textFaint, marginLeft: 4 }}>▾</Text>
            </Pressable>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 000-0000"
              placeholderTextColor={colors.textFaint}
            />
          </View>

          {showCountries && (
            <View style={styles.countryList}>
              {COUNTRIES.map((c) => (
                <Pressable key={c.code} style={styles.countryItem} onPress={() => { setCountry(c.code); setShowCountries(false); }}>
                  <Text style={{ color: colors.text, fontWeight: '600', width: 40 }}>{c.code}</Text>
                  <Text style={{ color: colors.textMuted }}>{c.label}</Text>
                </Pressable>
              ))}
            </View>
          )}

          <PrimaryButton title="Send code" onPress={sendCode} style={{ marginTop: 24 }} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Enter the code</Text>
          <Text style={styles.subtitle}>Sent to {country} {phone}. {secondsLeft > 0 ? `Expires in ${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, '0')}` : 'Code expired.'}</Text>
          <Text style={styles.label}>6-DIGIT CODE</Text>
          <TextInput
            style={[styles.input, styles.otpInput]}
            keyboardType="number-pad"
            value={otp}
            onChangeText={(v) => setOtp(v.replace(/\D/g, '').slice(0, 6))}
            placeholder="• • • • • •"
            placeholderTextColor={colors.textFaint}
            maxLength={6}
          />
          {attempts > 0 && <Text style={styles.attemptsText}>{3 - attempts} attempts remaining</Text>}
          <PrimaryButton title="Verify & sign in" onPress={verifyCode} style={{ marginTop: 24 }} />
          <TouchableOpacity onPress={resend} disabled={secondsLeft > 0 && attempts < 3} style={styles.resendBtn}>
            <Text style={[styles.resendText, secondsLeft > 0 && attempts < 3 && { opacity: 0.4 }]}>
              {secondsLeft > 0 ? `Didn't get it? Resend in ${secondsLeft}s` : 'Resend code'}
            </Text>
          </TouchableOpacity>
        </>
      )}
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
  otpInput: { textAlign: 'center', letterSpacing: 12, fontSize: 22, fontWeight: '700' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  countryBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgInput, borderRadius: radii.md,
    paddingHorizontal: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  countryList: {
    marginTop: 8, backgroundColor: colors.bgElevated, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  countryItem: {
    flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  attemptsText: { color: colors.warning, fontSize: 13, marginTop: 8 },
  resendBtn: { alignItems: 'center', marginTop: 14 },
  resendText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});
