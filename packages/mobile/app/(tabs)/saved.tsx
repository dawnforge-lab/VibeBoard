import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SavedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-3xl font-bold text-white mb-2">
            Saved Styles
          </Text>
          <Text className="text-gray-400 mb-6">Your favorite text styles</Text>

          <View className="bg-gray-900 rounded-lg p-8 items-center">
            <Text className="text-6xl mb-4">❤️</Text>
            <Text className="text-white text-base text-center">
              No saved styles yet
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-2">
              Tap the heart icon on any style to save it here
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
