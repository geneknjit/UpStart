import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { PrimaryButton, Card, Badge } from '../../components/UI';
import { startupById } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Invest'>;

export default function InvestScreen({ route, navigation }: Props) {
  const { startupId } = route.params;
  const startup = startupById(startupId);
  const { coins, spendCoins, conversionRate, unlockBadge } = useApp();
  const [amount, setAmount] = useState('100');

  const parsed = parseInt(amount.replace(/\D/g, ''), 10) || 0;
  const usd = (parsed / conversionRate).toFixed(2);
  const enough = coins >= parsed && parsed >= (startup?.minInvestment ?? 0);

  if (!startup) return null;

  const confirm = () => {
    if (!enough) {
      Alert.alert(coins < parsed ? 'Insufficient funds' : 'Below minimum', coins < parsed ? 'Not enough coins. Add more to your wallet.' : `Minimum investment is ${startup.minInvestment} coins.`);
      return;
    }
    Alert.alert(
      'Confirm investment',
      `Invest ${parsed} coins ($${usd}) in ${startup.name}? Funds will be held in escrow until the round closes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Invest',
          onPress: () => {
            if (spendCoins(parsed)) {
              unlockBadge('first-invest');
              if (route.params.liveId) unlockBadge('live-investor');
              Alert.alert(
                '🚀 Invested!',
                `${parsed} coins held in escrow. You'll see this in Activity and Achievements.`,
                [{ text: 'Done', onPress: () => navigation.goBack() }]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 50, paddingBottom: 60 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
          <Text style={{ color: colors.primary }}>← Cancel</Text>
        </Pressable>

        <Text style={styles.title}>Invest in {startup.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Badge color={colors.accent}>{startup.dealType}</Badge>
          <Text style={styles.metaText}>  Min ${startup.minInvestment} · Valuation ${(startup.valuation / 1000000).toFixed(1)}M</Text>
        </View>

        <Card style={{ marginTop: 22 }}>
          <Text style={styles.cardTitle}>Amount</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountSymbol}>🪙</Text>
            <TextInput
              value={amount}
              onChangeText={(v) => setAmount(v.replace(/\D/g, ''))}
              keyboardType="numeric"
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={colors.textFaint}
            />
            <Text style={styles.amountLabel}>coins</Text>
          </View>
          <Text style={styles.usdEquivalent}>≈ ${usd} USD</Text>
          <View style={styles.quickRow}>
            {[100, 500, 1000, 2500].map((n) => (
              <Pressable key={n} style={styles.quickBtn} onPress={() => setAmount(String(n))}>
                <Text style={styles.quickText}>{n}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Your wallet</Text>
            <Text style={styles.balanceValue}>🪙 {coins.toLocaleString()}</Text>
          </View>
        </Card>

        <Card style={{ marginTop: 14, backgroundColor: colors.bgInput }}>
          <Text style={styles.escrowTitle}>🛡️ Held in escrow</Text>
          <Text style={styles.escrowBody}>
            Your funds remain in escrow until the round closes. If the minimum isn't reached, every coin returns to your wallet automatically.
          </Text>
        </Card>

        <PrimaryButton
          title={enough ? `Invest ${parsed} coins` : (coins < parsed ? 'Not enough coins' : `Min ${startup.minInvestment} coins`)}
          variant="accent"
          onPress={confirm}
          disabled={!enough}
          style={{ marginTop: 22 }}
        />
        <Pressable
          style={{ alignItems: 'center', marginTop: 14 }}
          onPress={() => navigation.navigate('Wallet')}
        >
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Buy more coins</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h2 },
  metaText: { color: colors.textMuted, fontSize: 13 },
  cardTitle: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 12 },
  amountRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12 },
  amountSymbol: { fontSize: 28, marginRight: 10 },
  amountInput: { flex: 1, color: colors.text, fontSize: 36, fontWeight: '800' },
  amountLabel: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  usdEquivalent: { color: colors.accent, fontSize: 13, fontWeight: '700', marginTop: 8 },
  quickRow: { flexDirection: 'row', marginTop: 14, gap: 8 },
  quickBtn: { flex: 1, backgroundColor: colors.bgInput, padding: 10, borderRadius: radii.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  quickText: { color: colors.text, fontWeight: '700' },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  balanceLabel: { color: colors.textMuted, fontSize: 13 },
  balanceValue: { color: colors.text, fontSize: 13, fontWeight: '700' },
  escrowTitle: { color: colors.text, fontWeight: '700', marginBottom: 6 },
  escrowBody: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
});
