import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { Card, PrimaryButton } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const BUNDLES = [
  { coins: 500, usd: 5, bonus: 0, label: 'Starter' },
  { coins: 2000, usd: 18, bonus: 200, label: 'Backer' },
  { coins: 5000, usd: 40, bonus: 1000, label: 'Patron', highlight: true },
  { coins: 12000, usd: 90, bonus: 3000, label: 'Whale' },
];

export default function WalletScreen({ navigation }: Props) {
  const { coins, addCoins, conversionRate, totalInvested } = useApp();

  const buy = (n: number, bonus: number, usd: number) => {
    Alert.alert(
      `Buy ${n.toLocaleString()} + ${bonus} bonus coins`,
      `Total: ${(n + bonus).toLocaleString()} coins for $${usd}.\n\nThis is a UI mock — no real payment will be processed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => {
          addCoins(n + bonus);
          Alert.alert('Coins added', `${(n + bonus).toLocaleString()} coins added to your wallet.`);
        } },
      ]
    );
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.primary, fontSize: 14 }}>← Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Wallet</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>YOUR BALANCE</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceCoin}>🪙</Text>
            <Text style={styles.balanceValue}>{coins.toLocaleString()}</Text>
          </View>
          <Text style={styles.balanceUsd}>≈ ${(coins / conversionRate).toFixed(2)} USD</Text>
          <View style={styles.rateBox}>
            <Text style={styles.rateText}>{conversionRate} coins = $1.00 USD</Text>
          </View>
        </View>

        <View style={{ padding: spacing.lg }}>
          <Text style={styles.sectionTitle}>BUY COINS</Text>
          <View style={styles.bundleGrid}>
            {BUNDLES.map((b) => (
              <Pressable
                key={b.coins}
                style={[styles.bundle, b.highlight && { borderColor: colors.accent, backgroundColor: colors.accentSoft }]}
                onPress={() => buy(b.coins, b.bonus, b.usd)}
              >
                {b.highlight && (
                  <View style={styles.popular}>
                    <Text style={styles.popularText}>POPULAR</Text>
                  </View>
                )}
                <Text style={styles.bundleLabel}>{b.label}</Text>
                <Text style={styles.bundleCoins}>🪙 {b.coins.toLocaleString()}</Text>
                {b.bonus > 0 && <Text style={styles.bundleBonus}>+{b.bonus.toLocaleString()} bonus</Text>}
                <Text style={styles.bundleUsd}>${b.usd}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>PAYMENT METHODS</Text>
          <Card>
            <View style={styles.payRow}>
              <Text style={{ fontSize: 22 }}>💳</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.payTitle}>Visa •••• 4242</Text>
                <Text style={styles.paySub}>Expires 12/27 · Default</Text>
              </View>
              <Text style={styles.defaultBadge}>DEFAULT</Text>
            </View>
            <Pressable style={styles.payRow} onPress={() => Alert.alert('Apple Pay', 'Native payment sheet would open. (UI only)')}>
              <Text style={{ fontSize: 22 }}>🍎</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.payTitle}>Apple Pay</Text>
                <Text style={styles.paySub}>One-tap</Text>
              </View>
              <Text style={{ color: colors.primary }}>›</Text>
            </Pressable>
            <Pressable style={styles.payRow} onPress={() => navigation.navigate('PaymentMethods')}>
              <Text style={{ fontSize: 22 }}>＋</Text>
              <Text style={[styles.payTitle, { marginLeft: 12, color: colors.primary }]}>Add new method</Text>
            </Pressable>
          </Card>

          <Text style={styles.sectionTitle}>LIFETIME</Text>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.lifeLabel}>Coins purchased</Text>
                <Text style={styles.lifeValue}>{(coins + totalInvested + 250).toLocaleString()}</Text>
              </View>
              <View>
                <Text style={styles.lifeLabel}>Total invested</Text>
                <Text style={[styles.lifeValue, { color: colors.accent }]}>{totalInvested.toLocaleString()}</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  balanceCard: { backgroundColor: colors.primary, marginHorizontal: spacing.lg, padding: 22, borderRadius: 20, alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  balanceCoin: { fontSize: 32, marginRight: 8 },
  balanceValue: { color: colors.white, fontSize: 42, fontWeight: '800' },
  balanceUsd: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  rateBox: { marginTop: 14, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  rateText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  sectionTitle: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 22, marginBottom: 10 },
  bundleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bundle: { width: '47%', backgroundColor: colors.bgElevated, padding: 16, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, position: 'relative' },
  popular: { position: 'absolute', top: -8, right: 10, backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  popularText: { color: colors.textInverse, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  bundleLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  bundleCoins: { color: colors.text, fontWeight: '800', fontSize: 18, marginTop: 6 },
  bundleBonus: { color: colors.accent, fontSize: 11, fontWeight: '700', marginTop: 2 },
  bundleUsd: { color: colors.text, fontWeight: '700', marginTop: 8 },
  payRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  payTitle: { color: colors.text, fontWeight: '600' },
  paySub: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  defaultBadge: { color: colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 0.5, backgroundColor: colors.accentSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  lifeLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  lifeValue: { color: colors.text, fontSize: 22, fontWeight: '800', marginTop: 4 },
});
