import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { signUp } from '../../services/back4app';
import { useAuth } from '../../context/AuthContext';
import { colors, radii, typography } from '../../theme/colors';
import { PrimaryButton } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function passwordStrength(p: string): { score: number; label: string; color: string } {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (p.length >= 12) s++;
  const map = [
    { label: 'Too weak', color: colors.danger },
    { label: 'Weak', color: colors.danger },
    { label: 'Fair', color: colors.warning },
    { label: 'Strong', color: colors.accent },
    { label: 'Very strong', color: colors.accent },
    { label: 'Very strong', color: colors.accent },
  ];
  return { score: s, ...map[s] };
}

export default function SignUpScreen({ navigation }: Props) {
  const { setSession } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaPassed, setCaptchaPassed] = useState(false);

  const pwInfo = useMemo(() => passwordStrength(password), [password]);
  const userOk = username.length >= 3 && /^[a-z0-9_]+$/.test(username);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Display name is required.';
    if (!userOk) e.username = 'Lowercase letters, numbers, and underscores only.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email.';
    if (pwInfo.score < 3) e.password = 'Choose a stronger password.';
    if (confirm !== password) e.confirm = 'Passwords do not match.';
    if (!agree) e.agree = 'Please accept the terms.';
    if (!captchaPassed) e.captcha = 'Please confirm you are not a robot.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await signUp(name.trim(), email.trim(), password);
      await setSession(user.sessionToken, user.objectId, name.trim(), email.trim());
      navigation.replace('OnboardingPersonal');
    } catch (err: any) {
      Alert.alert('Sign up failed', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={{ color: colors.primary, fontSize: 14 }}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Join investors and founders shaping what comes next.</Text>

          <Field label="DISPLAY NAME" value={name} onChange={setName} placeholder="Jane Doe" err={errors.name} />
          <Field
            label="USERNAME"
            value={username}
            onChange={(v) => setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            placeholder="janedoe"
            err={errors.username}
            right={username.length >= 3 && (userOk ? <Text style={{ color: colors.accent, fontWeight: '700' }}>✓</Text> : <Text style={{ color: colors.danger, fontWeight: '700' }}>×</Text>)}
          />
          <Field label="EMAIL" value={email} onChange={setEmail} placeholder="you@startup.co" err={errors.email} keyboard="email-address" />
          <Field label="PASSWORD" value={password} onChange={setPassword} placeholder="At least 8 chars" err={errors.password} secure />

          {password.length > 0 && (
            <View style={styles.strengthRow}>
              <View style={styles.strengthBar}>
                <View style={[styles.strengthFill, { width: `${Math.min(100, (pwInfo.score / 5) * 100)}%`, backgroundColor: pwInfo.color }]} />
              </View>
              <Text style={[styles.strengthText, { color: pwInfo.color }]}>{pwInfo.label}</Text>
            </View>
          )}

          <Field label="CONFIRM PASSWORD" value={confirm} onChange={setConfirm} placeholder="Re-enter password" err={errors.confirm} secure />

          {/* Mock CAPTCHA */}
          <View style={styles.captcha}>
            <Pressable onPress={() => setCaptchaPassed((v) => !v)} style={[styles.checkbox, captchaPassed && styles.checkboxOn]}>
              {captchaPassed && <Text style={{ color: colors.white, fontWeight: '800' }}>✓</Text>}
            </Pressable>
            <Text style={styles.captchaText}>I'm not a robot</Text>
            <Text style={styles.captchaLogo}>🤖</Text>
          </View>
          {!!errors.captcha && <Text style={styles.fieldError}>{errors.captcha}</Text>}

          <Pressable onPress={() => setAgree((v) => !v)} style={[styles.captcha, { marginTop: 14 }]}>
            <View style={[styles.checkbox, agree && styles.checkboxOn]}>
              {agree && <Text style={{ color: colors.white, fontWeight: '800' }}>✓</Text>}
            </View>
            <Text style={[styles.captchaText, { flex: 1 }]}>
              I agree to the <Text style={{ color: colors.primary }}>Terms of Service</Text> and{' '}
              <Text style={{ color: colors.primary }}>Privacy Policy</Text>.
            </Text>
          </Pressable>
          {!!errors.agree && <Text style={styles.fieldError}>{errors.agree}</Text>}

          <PrimaryButton title="Create account" onPress={submit} loading={loading} style={{ marginTop: 24 }} />

          <View style={styles.signupRow}>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>Already have one? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.linkText, { fontWeight: '700' }]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({
  label, value, onChange, placeholder, err, secure, keyboard, right,
}: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.input, err ? styles.inputError : null, { flexDirection: 'row', alignItems: 'center' }]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaint}
          secureTextEntry={secure}
          keyboardType={keyboard || 'default'}
          autoCapitalize="none"
          autoCorrect={false}
          style={{ flex: 1, color: colors.text, fontSize: 15 }}
        />
        {right}
      </View>
      {!!err && <Text style={styles.fieldError}>{err}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 28, paddingTop: 60, paddingBottom: 60 },
  back: { marginBottom: 18 },
  title: { ...typography.h1, marginBottom: 4 },
  subtitle: { ...typography.bodyMuted, marginBottom: 28 },
  label: { ...typography.tiny, marginBottom: 6 },
  input: {
    backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  inputError: { borderColor: colors.danger },
  fieldError: { color: colors.danger, fontSize: 12, marginTop: 5 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, marginTop: -8 },
  strengthBar: { flex: 1, height: 4, backgroundColor: colors.bgInput, borderRadius: 2, marginRight: 10 },
  strengthFill: { height: 4, borderRadius: 2 },
  strengthText: { fontSize: 12, fontWeight: '700' },
  captcha: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgElevated, padding: 14,
    borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, marginTop: 8,
  },
  captchaText: { color: colors.text, fontSize: 14, marginLeft: 10 },
  captchaLogo: { fontSize: 22, marginLeft: 'auto' as any },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  linkText: { color: colors.primary, fontSize: 14 },
});
