import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/appStore';

const MAX_LENGTH = 200;

export default function TextLab() {
  const inputText = useAppStore((state) => state.inputText);
  const setInputText = useAppStore((state) => state.setInputText);

  const characterCount = inputText.length;
  const isNearLimit = characterCount >= MAX_LENGTH * 0.9;

  const handleClear = () => {
    setInputText('');
  };

  return (
    <View className="bg-gray-900 rounded-lg p-4 mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white font-semibold">Text Lab</Text>
        <Text
          className={`text-sm ${isNearLimit ? 'text-red-400' : 'text-gray-400'}`}
        >
          {characterCount}/{MAX_LENGTH}
        </Text>
      </View>

      <View className="relative">
        <TextInput
          className="bg-gray-800 text-white rounded-lg p-4 text-base min-h-[120px]"
          placeholder="Type your text here..."
          placeholderTextColor="#6b7280"
          multiline
          maxLength={MAX_LENGTH}
          value={inputText}
          onChangeText={setInputText}
          style={{
            textAlignVertical: 'top',
          }}
        />

        {inputText.length > 0 && (
          <TouchableOpacity
            className="absolute top-2 right-2 bg-gray-700 rounded-full w-6 h-6 items-center justify-center"
            onPress={handleClear}
          >
            <Text className="text-gray-400 text-xs">✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {inputText.length === 0 && (
        <Text className="text-gray-500 text-xs mt-2">
          Start typing to see your text transformed into different styles
        </Text>
      )}
    </View>
  );
}
