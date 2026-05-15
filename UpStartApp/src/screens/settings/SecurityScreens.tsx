// Reset password, account recovery, payment methods.
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing } from '../../theme/colors';
import { Card, PrimaryButton, Row, Toggle } from '../../components/UI';

function Header({ title, onBack }: any) {
  return (
    <View style={s.header}>
      <Pressable onPress={onBack}><Text style={{ color: colors.primary }}>← Back</Text></Pressable>
      <Text style={s.title}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

// ── Reset Password ────────────────────────────────────────────────────────
export function ResetPasswordScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'ResetPassword'>) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = () => {
    if (!current) return Alert.alert('Enter current password.');
    if (next.length < 8) return Alert.alert('New password too short', 'Use at least 8 characters.');
    if (next === current) return Alert.alert('New password must differ', 'Choose a different password.');
    if (next !== confirm) return Alert.alert('Passwords do not match');
    Alert.alert('Password updated', 'Sign out of all other devices?', [
      { text: 'Keep other sessions' },
      { text: 'Sign out others', style: 'destructive', onPress: () => Alert.alert('Other sessions ended.') },
    ]);
    setCurrent(''); setNext(''); setConfirm('');
  };

  return (
    <View style={s.bg}>
      <Header title="Reset password" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Card>
          <Text style={s.label}>CURRENT PASSWORD</Text>
          <TextInput secureTextEntry value={current} onChangeText={setCurrent} style={s.input} placeholder="Enter current" placeholderTextColor={colors.textFaint} />
          <Text style={[s.label, { marginTop: 14 }]}>NEW PASSWORD</Text>
          <TextInput secureTextEntry value={next} onChangeText={setNext} style={s.input} placeholder="At least 8 characters" placeholderTextColor={colors.textFaint} />
          <Text style={[s.label, { marginTop: 14 }]}>CONFIRM NEW PASSWORD</Text>
          <TextInput secureTextEntry value={confirm} onChangeText={setConfirm} style={s.input} placeholder="Re-enter new password" placeholderTextColor={colors.textFaint} />
          <PrimaryButton title="Update password" onPress={submit} style={{ marginTop: 20 }} />
        </Card>
      </ScrollView>
    </View>
  );
}

// ── Account Recovery ──────────────────────────────────────────────────────
export function AccountRecoveryScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'AccountRecovery'>) {
  const [codesRemaining, setCodesRemaining] = useState(10);

  const generate = () =>
    Alert.alert('Generate new backup codes?', 'This will invalidate any previous codes.', [
      { text: 'Cancel' },
      {
        text: 'Generate',
        onPress: () => {
          setCodesRemaining(10);
          Alert.alert('10 codes generated', 'Each can be used once. Download or copy them somewhere safe.\n\nUI-only — no actual codes shown.');
        },
      },
    ]);

  return (
    <View style={s.bg}>
      <Header title="Account recovery" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={s.sectionLabel}>BACKUP CODES</Text>
        <Card>
          <Text style={{ color: colors.text, fontSize: 15, marginBottom: 6 }}>{codesRemaining} of 10 codes remaining</Text>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>One-time codes for emergency access if you lose 2FA.</Text>
          <PrimaryButton title="Generate new codes" variant="ghost" onPress={generate} style={{ marginTop: 12 }} />
        </Card>
        <Text style={s.sectionLabel}>BACKUP METHODS</Text>
        <Card style={{ paddingVertical: 0 }}>
          <Row label="Recovery email" value="Pending verification" onPress={() => Alert.alert('Add backup email')} />
          <Row label="Recovery phone" value="+1 ••• ••• 4242" onPress={() => Alert.alert('Update phone')} />
          <Row label="Trusted contacts" value="0 added" onPress={() => Alert.alert('Add a trusted contact')} />
        </Card>
        <Text style={s.sectionLabel}>SECURITY QUESTIONS</Text>
        <Card style={{ paddingVertical: 0 }}>
          <Row label="3 questions set" onPress={() => navigation.navigate('SecurityQuestions')} />
        </Card>
      </ScrollView>
    </View>
  );
}

// ── Payment Methods ───────────────────────────────────────────────────────
export function PaymentMethodsScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'PaymentMethods'>) {
  const [cards, setCards] = useState([
    { id: 'c1', brand: '💳', last4: '4242', exp: '12/27', isDefault: true, type: 'Visa' },
  ]);
  const [adding, setAdding] = useState(false);
  const [num, setNum] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');
  const [zip, setZip] = useState('');

  const addCard = () => {
    if (num.replace(/\s/g, '').length < 13) return Alert.alert('Invalid card number');
    if (!/^\d\d\/\d\d$/.test(exp)) return Alert.alert('Invalid expiry', 'Use MM/YY.');
    if (cvc.length < 3) return Alert.alert('Invalid CVC');
    const last4 = num.replace(/\s/g, '').slice(-4);
    setCards((c) => [...c, { id: `c${Date.now()}`, brand: '💳', last4, exp, isDefault: false, type: 'Card' }]);
    setAdding(false);
    setNum(''); setExp(''); setCvc(''); setZip('');
    Alert.alert('Card saved', 'No real card processed — UI demo only.');
  };

  const removeCard = (id: string) => {
    if (cards.length === 1) return Alert.alert('This is your only method', 'Removing it will prevent purchases.');
    Alert.alert('Remove card?', undefined, [{ text: 'Cancel' }, { text: 'Remove', style: 'destructive', onPress: () => setCards((c) => c.filter((x) => x.id !== id)) }]);
  };

  const setDefault = (id: string) => setCards((c) => c.map((x) => ({ ...x, isDefault: x.id === id })));

  return (
    <View style={s.bg}>
      <Header title="Payment methods" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={s.sectionLabel}>CARDS</Text>
        <Card style={{ paddingVertical: 0 }}>
          {cards.map((c) => (
            <View key={c.id} style={s.cardRow}>
              <Text style={{ fontSize: 22 }}>{c.brand}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.cardTitle}>{c.type} •••• {c.last4}</Text>
                <Text style={s.cardSub}>Exp {c.exp}</Text>
              </View>
              {c.isDefault ? (
                <Text style={s.defaultBadge}>DEFAULT</Text>
              ) : (
                <Pressable onPress={() => setDefault(c.id)}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>Set default</Text></Pressable>
              )}
              <Pressable onPress={() => removeCard(c.id)} style={{ marginLeft: 12 }}>
                <Text style={{ color: colors.danger, fontSize: 18 }}>×</Text>
              </Pressable>
            </View>
          ))}
        </Card>

        <Text style={s.sectionLabel}>WALLETS</Text>
        <Card style={{ paddingVertical: 0 }}>
          <Row label="🍎 Apple Pay" value="Available" onPress={() => Alert.alert('Apple Pay would open native sheet')} />
          <Row label="🅖 Google Pay" value="Not set up" onPress={() => Alert.alert('Google Pay setup would start')} />
        </Card>

        {adding ? (
          <Card style={{ marginTop: 16 }}>
            <Text style={s.sectionTitle}>Add new card</Text>
            <Text style={s.label}>CARD NUMBER</Text>
            <TextInput style={s.input} value={num} onChangeText={(v) => setNum(v.replace(/[^\d ]/g, ''))} keyboardType="number-pad" placeholder="4242 4242 4242 4242" placeholderTextColor={colors.textFaint} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>EXPIRY</Text>
                <TextInput style={s.input} value={exp} onChangeText={setExp} placeholder="MM/YY" placeholderTextColor={colors.textFaint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>CVC</Text>
                <TextInput style={s.input} value={cvc} onChangeText={(v) => setCvc(v.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" placeholder="123" placeholderTextColor={colors.textFaint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>ZIP</Text>
                <TextInput style={s.input} value={zip} onChangeText={setZip} placeholder="10001" placeholderTextColor={colors.textFaint} />
              </View>
            </View>
            <PrimaryButton title="Save card" onPress={addCard} style={{ marginTop: 18 }} />
            <PrimaryButton title="Cancel" variant="ghost" onPress={() => setAdding(false)} style={{ marginTop: 8 }} />
          </Card>
        ) : (
          <PrimaryButton title="+ Add payment method" variant="ghost" onPress={() => setAdding(true)} style={{ marginTop: 16 }} />
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  label: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 6 },
  sectionLabel: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 14, marginBottom: 8 },
  sectionTitle: { color: colors.text, fontWeight: '700', fontSize: 15, marginBottom: 12 },
  input: { color: colors.text, backgroundColor: colors.bgInput, borderRadius: radii.md, padding: 12, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  cardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  cardTitle: { color: colors.text, fontWeight: '600' },
  cardSub: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  defaultBadge: { color: colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 0.5, backgroundColor: colors.accentSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
});
