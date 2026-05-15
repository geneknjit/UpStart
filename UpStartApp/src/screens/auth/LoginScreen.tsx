import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
  Image,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { logIn } from '../../services/back4app';
import { useAuth } from '../../context/AuthContext';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { PrimaryButton } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginScreen({ navigation }: Props) {
  const { setSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!isValidEmail(email.trim())) e.email = 'Please enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await logIn(email.trim(), password);
      await setSession(user.sessionToken, user.objectId, user.displayName || email.trim(), email.trim());
      navigation.replace('Main');
    } catch (err: any) {
      Alert.alert('Sign in failed', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const stub = (provider: string) =>
    Alert.alert(`${provider} sign-in`, `${provider} OAuth would open here. (UI only in this build.)`);

  return (
    <View style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.logoWrap}>
            <Image
              source={require('../../../assets/logo-mark.png')}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>UpStart</Text>
          <Text style={styles.subtitle}>For founders & investors.</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              placeholder="you@startup.co"
              placeholderTextColor={colors.textFaint}
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
            {!!errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={[styles.input, errors.password ? styles.inputError : null, styles.inputRow]}>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={colors.textFaint}
                secureTextEntry={!showPw}
                style={{ flex: 1, color: colors.text, fontSize: 15 }}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPw((v) => !v)} hitSlop={8}>
                <Text style={{ color: colors.primary, fontWeight: '600' }}>{showPw ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            {!!errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
          </View>

          <View style={styles.optionsRow}>
            <Pressable onPress={() => setRemember((v) => !v)} style={styles.rememberRow}>
              <View style={[styles.checkbox, remember && styles.checkboxOn]}>
                {remember && <Text style={{ color: colors.white, fontSize: 12, fontWeight: '800' }}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <PrimaryButton title="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: 12 }} />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.providerRow}>
            <Pressable style={styles.providerBtn} onPress={() => stub('Google')}>
              <Text style={styles.providerEmoji}>🔵</Text>
              <Text style={styles.providerText}>Google</Text>
            </Pressable>
            <Pressable style={styles.providerBtn} onPress={() => stub('Facebook')}>
              <Text style={styles.providerEmoji}>📘</Text>
              <Text style={styles.providerText}>Facebook</Text>
            </Pressable>
            <Pressable style={styles.providerBtn} onPress={() => stub('GitHub')}>
              <Text style={styles.providerEmoji}>🐙</Text>
              <Text style={styles.providerText}>GitHub</Text>
            </Pressable>
          </View>

          <Pressable style={styles.altRow} onPress={() => navigation.navigate('PhoneLogin')}>
            <Text style={styles.altEmoji}>📱</Text>
            <Text style={styles.altText}>Continue with phone number</Text>
          </Pressable>
          <Pressable style={styles.altRow} onPress={() => navigation.navigate('Biometric')}>
            <Text style={styles.altEmoji}>👤</Text>
            <Text style={styles.altText}>Use Face ID</Text>
          </Pressable>

          <View style={styles.signupRow}>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>New to UpStart? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.linkText, { fontWeight: '700' }]}>Create account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: 28, paddingTop: 80, paddingBottom: 40 },
  logoWrap: {
    width: 96, height: 96, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  logoImg: { width: 96, height: 96 },
  title: { ...typography.h1, textAlign: 'center', fontSize: 32 },
  subtitle: { ...typography.bodyMuted, textAlign: 'center', marginBottom: 36, marginTop: 4 },
  label: { ...typography.tiny, marginBottom: 6, color: colors.textFaint },
  fieldWrap: { marginBottom: 14 },
  input: {
    backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 14,
    color: colors.text, borderWidth: 1, borderColor: colors.border, fontSize: 15,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputError: { borderColor: colors.danger },
  fieldError: { color: colors.danger, fontSize: 12, marginTop: 5 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: colors.border, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  rememberText: { color: colors.textMuted, fontSize: 13 },
  linkText: { color: colors.primary, fontSize: 13 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textFaint, fontSize: 12, marginHorizontal: 10, letterSpacing: 0.5 },
  providerRow: { flexDirection: 'row', gap: 10 },
  providerBtn: {
    flex: 1, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.md, padding: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
  },
  providerEmoji: { fontSize: 16, marginRight: 6 },
  providerText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  altRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, marginTop: 12, borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgElevated,
  },
  altEmoji: { fontSize: 16, marginRight: 10 },
  altText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
});
