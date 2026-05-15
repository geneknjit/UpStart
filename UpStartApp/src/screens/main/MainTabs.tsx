import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../theme/colors';
import DiscoveryScreen from './DiscoveryScreen';
import LiveListScreen from './LiveListScreen';
import CreateScreen from './CreateScreen';
import MessagesListScreen from './MessagesListScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

type IconProps = { focused: boolean; emoji: string; activeEmoji?: string };
function TabIcon({ focused, emoji, activeEmoji }: IconProps) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.55 }}>
      {focused ? (activeEmoji ?? emoji) : emoji}
    </Text>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          height: 70,
          paddingBottom: 14,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: -2 },
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoveryScreen}
        options={{ tabBarIcon: (p) => <TabIcon {...p} emoji="🧭" /> }}
      />
      <Tab.Screen
        name="LiveTab"
        component={LiveListScreen}
        options={{ tabBarLabel: 'Live', tabBarIcon: (p) => <TabIcon {...p} emoji="🎙" /> }}
      />
      <Tab.Screen
        name="CreateTab"
        component={CreateScreen}
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: ({ focused }) => (
            <View style={{
              width: 40, height: 40, borderRadius: 12,
              backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
              marginTop: -4,
              opacity: focused ? 1 : 0.9,
            }}>
              <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', lineHeight: 26 }}>+</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesListScreen}
        options={{ tabBarLabel: 'Messages', tabBarIcon: (p) => <TabIcon {...p} emoji="💬" /> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: (p) => <TabIcon {...p} emoji="👤" /> }}
      />
    </Tab.Navigator>
  );
}
