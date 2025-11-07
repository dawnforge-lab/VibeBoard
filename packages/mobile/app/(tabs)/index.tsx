import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-3xl font-bold text-white mb-2">VibeBoard</Text>
          <Text className="text-gray-400 mb-6">
            Transform your text into stylish Unicode fonts
          </Text>

          {/* Text Lab Component will go here */}
          <View className="bg-gray-900 rounded-lg p-4 mb-6">
            <Text className="text-white text-base">
              Text Lab Component (Coming in Story 4.3)
            </Text>
          </View>

          {/* Preview Grid will go here */}
          <View className="bg-gray-900 rounded-lg p-4">
            <Text className="text-white text-base">
              Preview Grid (Coming in Story 4.4)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
