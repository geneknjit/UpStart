import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getFavorites, saveFavorite } from '../services/back4app';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Spell = {
  spell: string;
  use: string;
};

const FAVORITE_BG    = '#0E2A1A'; // deep green tint for favorited spell
const FAVORITE_BORDER = '#2ECC71';

export default function SpellsScreen() {
  const { sessionToken, objectId } = useAuth();

  const [spells, setSpells]               = useState<Spell[]>([]);
  const [loading, setLoading]             = useState(true);
  const [expanded, setExpanded]           = useState<string | null>(null);
  const [favoriteSpell, setFavoriteSpell] = useState<string | null>(null);
  const [savingFav, setSavingFav]         = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const res   = await fetch('https://potterapi-fedeperin.vercel.app/en/spells');
      const data  = await res.json();
      setSpells(data);

      if (sessionToken) {
        const favs = await getFavorites(sessionToken);
        setFavoriteSpell(favs.favoriteSpell);
      }
      setLoading(false);
    };
    fetchAll().catch(() => setLoading(false));
  }, [sessionToken]);

  const toggleFavorite = useCallback(async (spellName: string) => {
    if (!sessionToken || !objectId) {
      Alert.alert('Not logged in', 'Please log in to save favorites.');
      return;
    }
    setSavingFav(true);
    try {
      const newValue = favoriteSpell === spellName ? null : spellName;
      await saveFavorite(objectId, sessionToken, 'favoriteSpell', newValue);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setFavoriteSpell(newValue);
    } catch (err: any) {
      Alert.alert('Could not save', err.message);
    } finally {
      setSavingFav(false);
    }
  }, [sessionToken, objectId, favoriteSpell]);

  const toggleExpand = (spellName: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === spellName ? null : spellName);
  };

  const renderItem = ({ item }: { item: Spell }) => {
    const isExpanded = expanded === item.spell;
    const isFavorite = favoriteSpell === item.spell;
    const cardBg     = isFavorite ? FAVORITE_BG : '#1c1c2b';
    const borderCol  = isFavorite ? FAVORITE_BORDER : '#1A472A';

    return (
      <Pressable
        style={[styles.card, { backgroundColor: cardBg, borderLeftColor: borderCol }]}
        onPress={() => toggleExpand(item.spell)}
      >
        {/* Header row */}
        <View style={styles.cardHeader}>
          <Text style={[styles.spellName, isFavorite && styles.spellNameFav]}>
            {item.spell}
          </Text>
          {isFavorite && <Text style={styles.favBadge}>⭐ Favourite</Text>}
        </View>

        {isExpanded && (
          <View style={styles.details}>
            <Text style={styles.useLabel}>Use:</Text>
            <Text style={styles.useText}>{item.use}</Text>

            {/* Favorite button */}
            <TouchableOpacity
              style={[styles.favBtn, isFavorite && styles.favBtnActive]}
              onPress={() => toggleFavorite(item.spell)}
              disabled={savingFav}
            >
              {savingFav && favoriteSpell === item.spell ? (
                <ActivityIndicator size="small" color="#2ECC71" />
              ) : (
                <Text style={[styles.favBtnText, isFavorite && styles.favBtnTextActive]}>
                  {isFavorite ? '★ Remove Favourite' : '☆ Set as Favourite'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f5d742" />
        <Text style={styles.loadingText}>Conjuring spells...</Text>
      </View>
    );
  }

  return (
    <>
      {favoriteSpell && (
        <View style={styles.currentFavBanner}>
          <Text style={styles.currentFavText}>⭐ Your favourite spell: {favoriteSpell}</Text>
        </View>
      )}
      <FlatList
        data={spells}
        keyExtractor={(item) => item.spell}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, backgroundColor: '#0E0E1A' },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spellName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f5d742',
    flex: 1,
  },
  spellNameFav: {
    color: '#2ECC71',
  },
  favBadge: {
    fontSize: 12,
    color: '#2ECC71',
    fontWeight: '600',
    marginLeft: 8,
  },
  details: { marginTop: 12 },
  useLabel: {
    fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 6,
  },
  useText: {
    color: '#ccc', fontSize: 15, lineHeight: 22, marginBottom: 4,
  },

  // Favourite button
  favBtn: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2ECC71',
    alignItems: 'center',
  },
  favBtnActive: {
    backgroundColor: '#2ECC71',
  },
  favBtnText: {
    color: '#2ECC71',
    fontWeight: '700',
    fontSize: 14,
  },
  favBtnTextActive: {
    color: '#0E0E1A',
  },

  // Banner
  currentFavBanner: {
    backgroundColor: '#071a10',
    borderBottomWidth: 1,
    borderBottomColor: '#2ECC71',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  currentFavText: {
    color: '#2ECC71',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0E0E1A',
  },
  loadingText: { marginTop: 10, color: '#fff' },
});
