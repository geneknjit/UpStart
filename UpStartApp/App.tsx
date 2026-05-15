import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';

import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import PhoneLoginScreen from './src/screens/auth/PhoneLoginScreen';
import TwoFactorScreen from './src/screens/auth/TwoFactorScreen';
import BiometricScreen from './src/screens/auth/BiometricScreen';
import SecurityQuestionsScreen from './src/screens/auth/SecurityQuestionsScreen';

import PersonalQuestionsScreen from './src/screens/onboarding/PersonalQuestionsScreen';
import IDVerificationScreen from './src/screens/onboarding/IDVerificationScreen';

import MainTabs from './src/screens/main/MainTabs';

import StartupProfileScreen from './src/screens/startup/StartupProfileScreen';
import CommissionRequestScreen from './src/screens/startup/CommissionRequestScreen';

import LiveShowScreen from './src/screens/live/LiveShowScreen';
import CreateLiveShowScreen from './src/screens/live/CreateLiveShowScreen';
import InvestScreen from './src/screens/live/InvestScreen';

import ChatScreen from './src/screens/messaging/ChatScreen';
import NewChatScreen from './src/screens/messaging/NewChatScreen';
import GroupInfoScreen from './src/screens/messaging/GroupInfoScreen';

import MiniVideosScreen from './src/screens/create/MiniVideosScreen';
import BlogEditorScreen from './src/screens/create/BlogEditorScreen';
import BlogPostScreen from './src/screens/create/BlogPostScreen';

import WalletScreen from './src/screens/wallet/WalletScreen';
import AchievementsScreen from './src/screens/wallet/AchievementsScreen';

import SettingsScreen from './src/screens/settings/SettingsScreen';
import NotificationsScreen from './src/screens/settings/NotificationsScreen';
import {
  PrivacyScreen,
  MessageOpennessScreen,
  PostVisibilityScreen,
  ThemeSettingsScreen,
  AccountSettingsScreen,
} from './src/screens/settings/PrivacyScreens';
import {
  HistoryScreen,
  ActivityScreen,
  LikesScreen,
  CommentsScreen,
  SharesScreen,
} from './src/screens/settings/HistoryScreens';
import {
  ResetPasswordScreen,
  AccountRecoveryScreen,
  PaymentMethodsScreen,
} from './src/screens/settings/SecurityScreens';
import {
  BackgroundCustomizationScreen,
  PersonalizationsScreen,
} from './src/screens/settings/CustomizationScreens';
import BlockedUsersScreen from './src/screens/settings/BlockedUsersScreen';

import { colors } from './src/theme/colors';

export type RootStackParamList = {
  // Auth
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  PhoneLogin: undefined;
  TwoFactor: undefined;
  Biometric: undefined;
  SecurityQuestions: undefined;
  // Onboarding
  OnboardingPersonal: undefined;
  OnboardingID: undefined;
  // Main app
  Main: undefined;
  // Startup
  StartupProfile: { id: string };
  CommissionRequest: { startupId: string };
  // Live
  LiveShow: { id: string };
  CreateLiveShow: undefined;
  Invest: { startupId: string; liveId: string | null };
  // Messaging
  Chat: { id: string };
  NewChat: undefined;
  GroupInfo: { id: string };
  // Create
  MiniVideos: undefined;
  BlogEditor: undefined;
  BlogPost: { id: string };
  // Wallet
  Wallet: undefined;
  Achievements: undefined;
  // Settings
  Settings: undefined;
  AccountSettings: undefined;
  Notifications: undefined;
  Privacy: undefined;
  MessageOpenness: undefined;
  PostVisibility: undefined;
  ThemeSettings: undefined;
  History: undefined;
  Activity: undefined;
  Likes: undefined;
  Comments: undefined;
  Shares: undefined;
  ResetPassword: undefined;
  AccountRecovery: undefined;
  PaymentMethods: undefined;
  BackgroundCustomization: undefined;
  Personalizations: undefined;
  BlockedUsers: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    primary: colors.primary,
    border: colors.border,
    notification: colors.live,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppProvider>
            <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
            <NavigationContainer theme={AppTheme}>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
            {/* Auth */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
            <Stack.Screen name="TwoFactor" component={TwoFactorScreen} />
            <Stack.Screen name="Biometric" component={BiometricScreen} />
            <Stack.Screen name="SecurityQuestions" component={SecurityQuestionsScreen} />

            {/* Onboarding */}
            <Stack.Screen name="OnboardingPersonal" component={PersonalQuestionsScreen} />
            <Stack.Screen name="OnboardingID" component={IDVerificationScreen} />

            {/* Main */}
            <Stack.Screen name="Main" component={MainTabs} />

            {/* Startup */}
            <Stack.Screen name="StartupProfile" component={StartupProfileScreen} />
            <Stack.Screen name="CommissionRequest" component={CommissionRequestScreen} />

            {/* Live */}
            <Stack.Screen name="LiveShow" component={LiveShowScreen} />
            <Stack.Screen name="CreateLiveShow" component={CreateLiveShowScreen} />
            <Stack.Screen name="Invest" component={InvestScreen} options={{ presentation: 'modal' }} />

            {/* Messaging */}
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="NewChat" component={NewChatScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />

            {/* Create */}
            <Stack.Screen name="MiniVideos" component={MiniVideosScreen} />
            <Stack.Screen name="BlogEditor" component={BlogEditorScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="BlogPost" component={BlogPostScreen} />

            {/* Wallet */}
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="Achievements" component={AchievementsScreen} />

            {/* Settings */}
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="MessageOpenness" component={MessageOpennessScreen} />
            <Stack.Screen name="PostVisibility" component={PostVisibilityScreen} />
            <Stack.Screen name="ThemeSettings" component={ThemeSettingsScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Activity" component={ActivityScreen} />
            <Stack.Screen name="Likes" component={LikesScreen} />
            <Stack.Screen name="Comments" component={CommentsScreen} />
            <Stack.Screen name="Shares" component={SharesScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="AccountRecovery" component={AccountRecoveryScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="BackgroundCustomization" component={BackgroundCustomizationScreen} />
            <Stack.Screen name="Personalizations" component={PersonalizationsScreen} />
            <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </AppProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
