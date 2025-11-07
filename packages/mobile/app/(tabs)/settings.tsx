import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-3xl font-bold text-white mb-2">Settings</Text>
          <Text className="text-gray-400 mb-6">Customize your experience</Text>

          {/* Theme Section */}
          <View className="mb-6">
            <Text className="text-white font-semibold mb-3">Appearance</Text>
            <View className="bg-gray-900 rounded-lg p-4">
              <Text className="text-gray-400 text-sm">
                Theme settings coming soon
              </Text>
            </View>
          </View>

          {/* About Section */}
          <View className="mb-6">
            <Text className="text-white font-semibold mb-3">About</Text>
            <View className="bg-gray-900 rounded-lg p-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-400">Version</Text>
                <Text className="text-white">1.0.0</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-400">Build</Text>
                <Text className="text-white">MVP</Text>
              </View>
            </View>
          </View>

          {/* Links Section */}
          <View className="mb-6">
            <Text className="text-white font-semibold mb-3">Support</Text>
            <TouchableOpacity className="bg-gray-900 rounded-lg p-4 mb-2">
              <Text className="text-blue-400">Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-900 rounded-lg p-4 mb-2">
              <Text className="text-blue-400">Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-900 rounded-lg p-4">
              <Text className="text-blue-400">Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
