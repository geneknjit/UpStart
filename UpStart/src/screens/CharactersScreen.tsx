import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
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

type Character = {
  fullName: string;
  nickname: string;
  hogwartsHouse: string;
  image: string;
  birthdate: string;
  children: string[];
};

const houseColors: Record<string, string> = {
  Gryffindor: '#740001',
  Slytherin:  '#1A472A',
  Ravenclaw:  '#0E1A40',
  Hufflepuff: '#FFDB00',
};

const FAVORITE_COLOR = '#7B3F00'; // warm amber-brown for favorited card

export default function CharactersScreen() {
  const { sessionToken, objectId } = useAuth();

  const [characters, setCharacters]           = useState<Character[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [expanded, setExpanded]               = useState<string | null>(null);
  const [favoriteCharacter, setFavoriteChar]  = useState<string | null>(null);
  const [savingFav, setSavingFav]             = useState(false);

  // Load characters and current favorite in parallel
  useEffect(() => {
    const fetchAll = async () => {
      const [charsRes] = await Promise.all([
        fetch('https://potterapi-fedeperin.vercel.app/en/characters'),
      ]);
      const chars = await charsRes.json();
      setCharacters(chars);

      if (sessionToken) {
        const favs = await getFavorites(sessionToken);
        setFavoriteChar(favs.favoriteCharacter);
      }
      setLoading(false);
    };
    fetchAll().catch(() => setLoading(false));
  }, [sessionToken]);

  const toggleFavorite = useCallback(async (nickname: string) => {
    if (!sessionToken || !objectId) {
      Alert.alert('Not logged in', 'Please log in to save favorites.');
      return;
    }
    setSavingFav(true);
    try {
      // Toggle: if already favorited, un-favorite it
      const newValue = favoriteCharacter === nickname ? null : nickname;
      await saveFavorite(objectId, sessionToken, 'favoriteCharacter', newValue);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setFavoriteChar(newValue);
    } catch (err: any) {
      Alert.alert('Could not save', err.message);
    } finally {
      setSavingFav(false);
    }
  }, [sessionToken, objectId, favoriteCharacter]);

  const toggleExpand = (nickname: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === nickname ? null : nickname);
  };

  const renderItem = ({ item }: { item: Character }) => {
    const isExpanded  = expanded === item.nickname;
    const isFavorite  = favoriteCharacter === item.nickname;
    const houseColor  = houseColors[item.hogwartsHouse] || '#444';
    const borderColor = isFavorite ? '#f5d742' : houseColor;
    const cardBg      = isFavorite ? FAVORITE_COLOR : '#1c1c2b';

    return (
      <Pressable
        style={[styles.card, { borderLeftColor: borderColor, backgroundColor: cardBg }]}
        onPress={() => toggleExpand(item.nickname)}
      >
        {/* Header row */}
        <View style={styles.cardHeader}>
          <Text style={[styles.nickname, isFavorite && styles.nicknameFav]}>
            {item.nickname}
          </Text>
          {isFavorite && <Text style={styles.favBadge}>⭐ Favourite</Text>}
        </View>

        {isExpanded && (
          <View style={styles.details}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : null}

            <Text style={styles.fullName}>{item.fullName}</Text>
            <Text style={[styles.house, { color: houseColor }]}>
              {item.hogwartsHouse}
            </Text>
            <Text style={styles.info}>Born: {item.birthdate}</Text>
            <Text style={styles.info}>
              Children: {item.children?.length ? item.children.join(', ') : 'None'}
            </Text>

            {/* Favorite button */}
            <TouchableOpacity
              style={[styles.favBtn, isFavorite && styles.favBtnActive]}
              onPress={() => toggleFavorite(item.nickname)}
              disabled={savingFav}
            >
              {savingFav && favoriteCharacter === item.nickname ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.favBtnText}>
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
        <Text style={styles.loadingText}>Summoning characters...</Text>
      </View>
    );
  }

  return (
    <>
      {favoriteCharacter && (
        <View style={styles.currentFavBanner}>
          <Text style={styles.currentFavText}>⭐ Your favourite: {favoriteCharacter}</Text>
        </View>
      )}
      <FlatList
        data={characters}
        keyExtractor={(item) => item.nickname}
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
  nickname: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  nicknameFav: {
    color: '#f5d742',
  },
  favBadge: {
    fontSize: 12,
    color: '#f5d742',
    fontWeight: '600',
    marginLeft: 8,
  },
  details: { marginTop: 12 },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 12,
  },
  fullName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5d742',
    marginBottom: 4,
  },
  house: { fontSize: 16, marginBottom: 6 },
  info: { color: '#ccc', marginBottom: 4 },

  // Favourite button
  favBtn: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#f5d742',
    alignItems: 'center',
  },
  favBtnActive: {
    backgroundColor: '#f5d742',
  },
  favBtnText: {
    color: '#f5d742',
    fontWeight: '700',
    fontSize: 14,
  },

  // Banner
  currentFavBanner: {
    backgroundColor: '#3a2800',
    borderBottomWidth: 1,
    borderBottomColor: '#f5d742',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  currentFavText: {
    color: '#f5d742',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0E0E1A',
  },
  loadingText: { marginTop: 10, color: '#fff' },
});
