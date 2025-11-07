import { View, Text, FlatList } from 'react-native';
import { useStyles } from '../hooks/useStyles';
import { useAppStore } from '../store/appStore';
import StyleTile from './StyleTile';

export default function PreviewGrid() {
  const inputText = useAppStore((state) => state.inputText);
  const styledResults = useStyles();

  if (!inputText || inputText.trim() === '') {
    return (
      <View className="bg-gray-900 rounded-lg p-8 items-center">
        <Text className="text-6xl mb-4">✨</Text>
        <Text className="text-white text-base text-center mb-2">
          Start typing to see the magic
        </Text>
        <Text className="text-gray-400 text-sm text-center">
          Your text will be transformed into multiple stylish fonts
        </Text>
      </View>
    );
  }

  if (styledResults.length === 0) {
    return (
      <View className="bg-gray-900 rounded-lg p-8 items-center">
        <Text className="text-6xl mb-4">⚠️</Text>
        <Text className="text-white text-base text-center">
          No styles available
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-white font-semibold mb-4 text-lg">
        Styled Versions ({styledResults.length})
      </Text>
      <FlatList
        data={styledResults}
        renderItem={({ item }) => <StyleTile style={item} />}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
