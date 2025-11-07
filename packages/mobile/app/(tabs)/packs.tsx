import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PacksScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-3xl font-bold text-white mb-2">Font Packs</Text>
          <Text className="text-gray-400 mb-6">
            Discover unique text styles
          </Text>

          {/* Default Pack */}
          <View className="bg-gray-900 rounded-lg p-4 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xl font-bold text-white">Default Pack</Text>
              <View className="bg-blue-600 px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-bold">FREE</Text>
              </View>
            </View>
            <Text className="text-gray-400 text-sm mb-3">
              10 classic Unicode styles for everyday use
            </Text>
            <View className="bg-blue-600 px-4 py-2 rounded-lg">
              <Text className="text-white text-center font-semibold">
                Active
              </Text>
            </View>
          </View>

          {/* Coming Soon */}
          <View className="bg-gray-900 rounded-lg p-4 opacity-50">
            <Text className="text-gray-400 text-sm text-center">
              More packs coming soon!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
