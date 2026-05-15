import React, { ReactNode } from 'react';
import {
  View, Text, Pressable, StyleSheet, ActivityIndicator,
  ViewStyle, TextStyle, StyleProp,
} from 'react-native';
import { colors, radii, spacing, typography } from '../theme/colors';

// ── PrimaryButton ──────────────────────────────────────────────────────────
export function PrimaryButton({
  title, onPress, loading, disabled, style, variant = 'primary', icon,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'accent' | 'ghost' | 'danger';
  icon?: ReactNode;
}) {
  const map = {
    primary: { bg: colors.primary, fg: colors.white },
    accent:  { bg: colors.accent, fg: colors.textInverse },
    ghost:   { bg: 'transparent', fg: colors.text, border: colors.border },
    danger:  { bg: colors.danger, fg: colors.white },
  } as const;
  const s = map[variant];
  return (
    <Pressable
      style={[
        styles.btn,
        { backgroundColor: s.bg, borderColor: (s as any).border ?? 'transparent', borderWidth: variant === 'ghost' ? 1 : 0 },
        (disabled || loading) && { opacity: 0.55 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={s.fg} />
      ) : (
        <View style={styles.btnRow}>
          {icon}
          <Text style={[styles.btnText, { color: s.fg, marginLeft: icon ? 8 : 0 }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ── Section header ─────────────────────────────────────────────────────────
export function SectionLabel({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.sectionLabel, style]}>{children}</Text>;
}

// ── Chip ───────────────────────────────────────────────────────────────────
export function Chip({
  label, active, onPress, onClose, style,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active && { backgroundColor: colors.primary, borderColor: colors.primary },
        style,
      ]}
    >
      <Text style={[styles.chipText, active && { color: colors.white }]}>{label}</Text>
      {onClose && (
        <Pressable onPress={onClose} hitSlop={8} style={{ marginLeft: 6 }}>
          <Text style={[styles.chipText, { fontSize: 14, fontWeight: '700' }]}>×</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

// ── Avatar (emoji-based) ───────────────────────────────────────────────────
export function Avatar({
  emoji, size = 44, tier, verified, ring,
}: {
  emoji: string;
  size?: number;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'none';
  verified?: boolean;
  ring?: boolean;
}) {
  const tierColor = {
    bronze: colors.tierBronze,
    silver: colors.tierSilver,
    gold: colors.tierGold,
    platinum: colors.tierPlatinum,
    none: 'transparent',
  };
  const borderColor = tier && tier !== 'none' ? tierColor[tier] : (ring ? colors.primary : 'transparent');
  return (
    <View style={{ width: size + 6, height: size + 6, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size, height: size, borderRadius: size / 2,
          backgroundColor: colors.bgInput, alignItems: 'center', justifyContent: 'center',
          borderWidth: 2, borderColor,
        }}
      >
        <Text style={{ fontSize: size * 0.55 }}>{emoji}</Text>
      </View>
      {verified && (
        <View style={{
          position: 'absolute', right: 0, bottom: 0,
          width: 16, height: 16, borderRadius: 8, backgroundColor: colors.verified,
          alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bg,
        }}>
          <Text style={{ color: colors.white, fontSize: 9, fontWeight: '800' }}>✓</Text>
        </View>
      )}
    </View>
  );
}

// ── Field row (settings list item) ─────────────────────────────────────────
export function Row({
  label, value, onPress, right, danger,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  right?: ReactNode;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
      <View style={styles.rowRight}>
        {value !== undefined && <Text style={styles.rowValue}>{value}</Text>}
        {right}
        {onPress && <Text style={styles.rowChev}>›</Text>}
      </View>
    </Pressable>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────
export function Badge({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <View style={[styles.badge, color ? { backgroundColor: color + '22', borderColor: color + '55' } : null]}>
      <Text style={[styles.badgeText, color ? { color } : null]}>{children}</Text>
    </View>
  );
}

// ── ScreenContainer ────────────────────────────────────────────────────────
export function ScreenContainer({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

// ── Divider ────────────────────────────────────────────────────────────────
export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.md }, style]} />;
}

// ── EmptyState ─────────────────────────────────────────────────────────────
export function EmptyState({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.empty}>
      <Text style={{ fontSize: 56, marginBottom: 12 }}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
    </View>
  );
}

// ── Stat block ─────────────────────────────────────────────────────────────
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ ...typography.h2, color: colors.text }}>{value}</Text>
      <Text style={{ ...typography.tiny, marginTop: 2 }}>{label.toUpperCase()}</Text>
    </View>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────
export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable onPress={() => onChange(!value)} style={[
      styles.toggle, { backgroundColor: value ? colors.primary : colors.bgInput },
    ]}>
      <View style={[styles.toggleKnob, { transform: [{ translateX: value ? 18 : 0 }] }]} />
    </Pressable>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  btn: {
    paddingVertical: 14, paddingHorizontal: 18,
    borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center',
  },
  btnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  card: {
    backgroundColor: colors.bgElevated, borderRadius: radii.lg,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight,
  },
  sectionLabel: {
    color: colors.textFaint, fontSize: 11, letterSpacing: 1.2,
    fontWeight: '700', textTransform: 'uppercase', marginBottom: 8, marginTop: 14,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 7, paddingHorizontal: 14,
    backgroundColor: colors.bgInput, borderRadius: radii.pill,
    borderWidth: 1, borderColor: colors.border, marginRight: 8,
  },
  chipText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 0,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  rowLabel: { color: colors.text, fontSize: 15, fontWeight: '500' },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValue: { color: colors.textMuted, fontSize: 14, marginRight: 8 },
  rowChev: { color: colors.textFaint, fontSize: 22, fontWeight: '300', marginLeft: 4 },
  badge: {
    paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: colors.bgInput, borderRadius: radii.sm,
    borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.3 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { ...typography.h3, textAlign: 'center', marginBottom: 6 },
  emptySub: { ...typography.bodyMuted, textAlign: 'center' },
  toggle: {
    width: 42, height: 24, borderRadius: 12, padding: 3,
  },
  toggleKnob: {
    width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF',
  },
});
