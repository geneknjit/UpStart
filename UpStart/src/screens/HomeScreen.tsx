import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { logOut } from '../services/back4app';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { sessionToken, clearSession } = useAuth();
  const [loggingOut, setLoggingOut]    = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Leave the Wizarding World?',
      'Are you sure you want to sign out?',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              if (sessionToken) await logOut(sessionToken).catch(() => {});
            } finally {
              await clearSession();
              setLoggingOut(false);
              navigation.replace('Login');
            }
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1520975916090-3105956dac38' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to the Wizarding World! 🧙‍♂️</Text>
        <Text style={styles.subtitle}>Choose your magical journey</Text>

        <Pressable
          style={[styles.button, styles.charactersButton]}
          onPress={() => navigation.navigate('Characters')}
        >
          <Text style={styles.buttonText}>✨ Characters</Text>
          <Text style={styles.buttonSubtext}>Meet the wizarding folk</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.spellsButton]}
          onPress={() => navigation.navigate('Spells')}
        >
          <Text style={styles.buttonText}>🪄 Spells</Text>
          <Text style={styles.buttonSubtext}>Discover magical incantations</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.logoutButton, loggingOut && styles.buttonDisabled]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>🚪 Sign Out</Text>
              <Text style={styles.buttonSubtext}>Leave the wizarding world</Text>
            </>
          )}
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  overlay: {
    flex: 1, backgroundColor: 'rgba(20,20,40,0.85)',
    padding: 24, justifyContent: 'center',
  },
  title: {
    fontSize: 28, fontWeight: 'bold', color: '#f5d742',
    textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    color: '#fff', textAlign: 'center', marginBottom: 48, fontSize: 16,
  },
  button: {
    padding: 24, borderRadius: 16, alignItems: 'center', marginBottom: 20,
    elevation: 5, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  charactersButton: { backgroundColor: '#740001' },
  spellsButton:     { backgroundColor: '#1A472A' },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(245,215,66,0.4)',
    marginBottom: 0,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText:    { color: '#fff', fontWeight: '700', fontSize: 24, marginBottom: 4 },
  buttonSubtext: { color: '#fff', fontSize: 14, opacity: 0.8 },
});
