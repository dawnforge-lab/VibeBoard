import { Tabs } from 'expo-router';
import { Platform, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? '#000' : '#111',
          borderTopColor: '#333',
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 34 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => <TabIcon>✨</TabIcon>,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: () => <TabIcon>❤️</TabIcon>,
        }}
      />
      <Tabs.Screen
        name="packs"
        options={{
          title: 'Packs',
          tabBarIcon: () => <TabIcon>📦</TabIcon>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => <TabIcon>⚙️</TabIcon>,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ children }: { children: React.ReactNode }) {
  return <Text className="text-2xl">{children}</Text>;
}
