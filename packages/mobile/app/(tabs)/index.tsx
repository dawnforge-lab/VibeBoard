import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextLab from '../../components/TextLab';
import PreviewGrid from '../../components/PreviewGrid';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" keyboardDismissMode="interactive">
          <View className="p-6">
            <Text className="text-3xl font-bold text-white mb-2">
              VibeBoard
            </Text>
            <Text className="text-gray-400 mb-6">
              Transform your text into stylish Unicode fonts
            </Text>

            <TextLab />

            <PreviewGrid />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
