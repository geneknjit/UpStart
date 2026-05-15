import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { colors, radii, spacing, typography } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Row, Toggle } from '../../components/UI';
import { logOut } from '../../services/back4app';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const app = useApp();
  const { sessionToken, clearSession, email } = useAuth();

  const handleLogout = () =>
    Alert.alert('Sign out', 'You can always come back.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          if (sessionToken) await logOut(sessionToken).catch(() => {});
          await clearSession();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);

  const Section = ({ title, children }: any) => (
    <>
      <Text style={styles.section}>{title.toUpperCase()}</Text>
      <Card style={{ paddingVertical: 0 }}>{children}</Card>
    </>
  );

  return (
    <View style={styles.bg}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary }}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
        <Section title="Account">
          <Row label="Email" value={email || 'Not set'} onPress={() => navigation.navigate('AccountSettings')} />
          <Row label="Name & username" onPress={() => navigation.navigate('AccountSettings')} />
          <Row label="Reset password" onPress={() => navigation.navigate('ResetPassword')} />
          <Row label="Account recovery" onPress={() => navigation.navigate('AccountRecovery')} />
          <Row label="Linked accounts" value="3 connected" onPress={() => Alert.alert('Linked accounts', 'Google, GitHub, Apple connected.')} />
        </Section>

        <Section title="Privacy & Security">
          <Row label="Privacy" value={app.privacy === 'public' ? 'Public' : app.privacy === 'followers' ? 'Followers' : 'Private'} onPress={() => navigation.navigate('Privacy')} />
          <Row label="Two-factor authentication" right={<Toggle value={app.twoFactorEnabled} onChange={(v) => v ? Alert.alert('Set up 2FA', 'Setup flow would start. (UI only)', [{ text: 'Cancel' }, { text: 'Enable', onPress: () => app.setTwoFactor(true) }]) : Alert.alert('Disable 2FA?', 'Making your account less secure. Sure?', [{ text: 'Cancel' }, { text: 'Disable', style: 'destructive', onPress: () => app.setTwoFactor(false) }])} />} />
          <Row label="Biometric (Face ID)" right={<Toggle value={app.biometricEnabled} onChange={app.setBiometric} />} />
          <Row label="Blocked users" value={`${app.blocked.length}`} onPress={() => navigation.navigate('BlockedUsers')} />
          <Row label="CAPTCHA" value="Auto" onPress={() => Alert.alert('CAPTCHA', 'CAPTCHA appears during signup and suspicious activity.')} />
        </Section>

        <Section title="Notifications">
          <Row label="Notification preferences" onPress={() => navigation.navigate('Notifications')} />
          <Row label="Message openness" value={app.msgOpenness === 'everyone' ? 'Everyone' : app.msgOpenness === 'follows' ? 'People I follow' : 'Nobody'} onPress={() => navigation.navigate('MessageOpenness')} />
        </Section>

        <Section title="Content">
          <Row label="Default post visibility" value={app.postVisibility === 'public' ? 'Public' : app.postVisibility === 'followers' ? 'Followers' : app.postVisibility === 'close' ? 'Close Friends' : 'Only me'} onPress={() => navigation.navigate('PostVisibility')} />
          <Row label="Old posts / archive" onPress={() => navigation.navigate('History')} />
          <Row label="Likes" onPress={() => navigation.navigate('Likes')} />
          <Row label="Comments" onPress={() => navigation.navigate('Comments')} />
          <Row label="Shares" onPress={() => navigation.navigate('Shares')} />
        </Section>

        <Section title="Activity & Wallet">
          <Row label="Recent activity" onPress={() => navigation.navigate('Activity')} />
          <Row label="Payment methods" onPress={() => navigation.navigate('PaymentMethods')} />
          <Row label="Wallet & coins" onPress={() => navigation.navigate('Wallet')} />
        </Section>

        <Section title="Personalization">
          <Row label="Theme" value={app.themeMode.charAt(0).toUpperCase() + app.themeMode.slice(1)} onPress={() => navigation.navigate('ThemeSettings')} />
          <Row label="Profile background" onPress={() => navigation.navigate('BackgroundCustomization')} />
          <Row label="Personalizations" onPress={() => navigation.navigate('Personalizations')} />
        </Section>

        <Section title="About">
          <Row label="Help & support" onPress={() => Alert.alert('Help center would open.')} />
          <Row label="Terms of Service" onPress={() => Alert.alert('Terms would open.')} />
          <Row label="Privacy Policy" onPress={() => Alert.alert('Privacy policy would open.')} />
          <Row label="Version" value="1.0.0" />
        </Section>

        <Pressable style={styles.signoutBtn} onPress={handleLogout}>
          <Text style={styles.signoutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: 14 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  section: { color: colors.textFaint, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 18, marginBottom: 8 },
  signoutBtn: { marginTop: 24, padding: 14, borderRadius: radii.md, borderWidth: 1, borderColor: colors.danger, alignItems: 'center' },
  signoutText: { color: colors.danger, fontWeight: '700' },
});
