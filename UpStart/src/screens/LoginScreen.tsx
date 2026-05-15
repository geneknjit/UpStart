import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ImageBackground,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { logIn, signUp, requestPasswordReset } from '../services/back4app';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
type Mode = 'login' | 'signup' | 'forgot';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginScreen({ navigation }: Props) {
  const { setSession } = useAuth();

  const [mode, setMode]         = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const clearForm = () => {
    setUsername(''); setEmail(''); setPassword('');
    setErrors({});
  };

  const switchMode = (m: Mode) => { clearForm(); setMode(m); };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (mode === 'signup' && !username.trim()) e.username = 'Username is required.';
    if (!isValidEmail(email.trim())) e.email = 'Enter a valid email address.';
    if (mode !== 'forgot' && password.length < 6)
      e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await logIn(email.trim(), password);
        await setSession(user.sessionToken, user.objectId);
        navigation.replace('Home');
      } else if (mode === 'signup') {
        const user = await signUp(username.trim(), email.trim(), password);
        await setSession(user.sessionToken, user.objectId);
        navigation.replace('Home');
      } else {
        await requestPasswordReset(email.trim());
        Alert.alert(
          'Owl Dispatched! ✉️',
          `A password reset has been sent to ${email.trim()}. Check your inbox.`,
          [{ text: 'Back to Login', onPress: () => switchMode('login') }]
        );
      }
    } catch (err: any) {
      Alert.alert('Spell Failed ✨', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const config = {
    login:  { title: 'PocketPotter 🧙‍♂️', subtitle: 'Your Magical Companion',      btn: 'Enter the Wizarding World' },
    signup: { title: 'Join the Order 🪄',  subtitle: 'Create your wizard account', btn: 'Begin Your Journey' },
    forgot: { title: 'Accio Password 🔮',  subtitle: "We'll owl you a reset link", btn: 'Send Owl' },
  };
  const { title, subtitle, btn } = config[mode];

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1520975916090-3105956dac38' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kav}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            {mode !== 'forgot' && (
              <View style={styles.tabRow}>
                <Pressable
                  style={[styles.tab, mode === 'login' && styles.tabActive]}
                  onPress={() => switchMode('login')}
                >
                  <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                    Sign In
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.tab, mode === 'signup' && styles.tabActive]}
                  onPress={() => switchMode('signup')}
                >
                  <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                    Sign Up
                  </Text>
                </Pressable>
              </View>
            )}

            {mode === 'forgot' && (
              <TouchableOpacity onPress={() => switchMode('login')} style={styles.backLink}>
                <Text style={styles.backLinkText}>← Back to Sign In</Text>
              </TouchableOpacity>
            )}

            {mode === 'signup' && (
              <View style={styles.fieldWrap}>
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#999"
                  style={[styles.input, errors.username ? styles.inputError : null]}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {!!errors.username && <Text style={styles.fieldError}>{errors.username}</Text>}
              </View>
            )}

            <View style={styles.fieldWrap}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                style={[styles.input, errors.email ? styles.inputError : null]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
              {!!errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
            </View>

            {mode !== 'forgot' && (
              <View style={styles.fieldWrap}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  style={[styles.input, errors.password ? styles.inputError : null]}
                  value={password}
                  onChangeText={setPassword}
                />
                {!!errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
              </View>
            )}

            {mode === 'login' && (
              <TouchableOpacity onPress={() => switchMode('forgot')} style={styles.forgotWrap}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>{btn}</Text>
              }
            </Pressable>

            {mode === 'login' && (
              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => switchMode('signup')}>
                  <Text style={styles.switchLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
            {mode === 'signup' && (
              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => switchMode('login')}>
                  <Text style={styles.switchLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(14,14,26,0.88)' },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1, justifyContent: 'center',
    padding: 28, paddingTop: 60, paddingBottom: 40,
  },
  title: {
    fontSize: 34, fontWeight: 'bold', color: '#f5d742',
    textAlign: 'center', marginBottom: 6, letterSpacing: 0.5,
  },
  subtitle: { color: '#ccc', textAlign: 'center', marginBottom: 32, fontSize: 15 },
  tabRow: {
    flexDirection: 'row', borderRadius: 12, borderWidth: 1,
    borderColor: '#333', overflow: 'hidden', marginBottom: 28,
  },
  tab: {
    flex: 1, paddingVertical: 11, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tabActive: { backgroundColor: '#740001' },
  tabText: { color: '#aaa', fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
  tabTextActive: { color: '#fff' },
  backLink: { marginBottom: 24 },
  backLinkText: { color: '#f5d742', fontSize: 14 },
  fieldWrap: { marginBottom: 14 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12,
    padding: 14, color: '#fff', borderWidth: 1, borderColor: '#444', fontSize: 15,
  },
  inputError: { borderColor: '#e05252' },
  fieldError: { color: '#e05252', fontSize: 12, marginTop: 5, marginLeft: 4 },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 4, marginTop: -4 },
  forgotText: { color: '#f5d742', fontSize: 13 },
  button: {
    backgroundColor: '#740001', padding: 16, borderRadius: 14,
    alignItems: 'center', marginTop: 20,
    shadowColor: '#740001', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 8, elevation: 6,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  switchText: { color: '#aaa', fontSize: 14 },
  switchLink: { color: '#f5d742', fontSize: 14, fontWeight: '600' },
});
