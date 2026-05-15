import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { useAuth } from '../../context/AuthContext';
import { colors, typography } from '../../theme/colors';
import { PrimaryButton } from '../../components/UI';

type Props = NativeStackScreenProps<RootStackParamList, 'Biometric'>;

export default function BiometricScreen({ navigation }: Props) {
  const { setSession } = useAuth();
  const [tries, setTries] = useState(0);

  const attempt = async (success: boolean) => {
    if (success) {
      await setSession('demo-bio-token', 'demo-bio-id', 'You', '');
      navigation.replace('Main');
    } else {
      const t = tries + 1;
      setTries(t);
      if (t >= 3) {
        Alert.alert('Biometric disabled', 'Too many failed attempts. Please sign in with your password.');
        navigation.replace('Login');
      } else {
        Alert.alert('Face not recognized', `Try again. ${3 - t} attempts remaining.`);
      }
    }
  };

  return (
    <View style={styles.bg}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={{ color: colors.primary }}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Text style={{ fontSize: 80 }}>👤</Text>
        </View>
        <Text style={styles.title}>Face ID</Text>
        <Text style={styles.subtitle}>Look at the camera to unlock UpStart.</Text>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
          <PrimaryButton title="Simulate success" onPress={() => attempt(true)} variant="accent" style={{ flex: 1 }} />
          <PrimaryButton title="Simulate fail" onPress={() => attempt(false)} variant="ghost" style={{ flex: 1 }} />
        </View>

        <TouchableOpacity style={{ marginTop: 26 }} onPress={() => navigation.replace('Login')}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Use password instead</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg, padding: 28, paddingTop: 60 },
  back: { marginBottom: 18 },
  center: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  iconWrap: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: colors.bgElevated, borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodyMuted, textAlign: 'center', marginTop: 6 },
});
